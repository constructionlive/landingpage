# Newsletter agent: integration spec

Everything an autonomous sender needs to hold the subscriber list, compose an
issue, and send it without mailing someone who opted out.

The register lives on the marketing site. This document is the whole contract —
the agent talks to HTTPS endpoints and nothing else.

---

## 1. What the agent needs, and what it must not be given

Put these in the agent's `.env`:

| Variable | Purpose |
|---|---|
| `NEWSLETTER_API_KEY` | Bearer credential for reading and importing subscribers |
| `NEWSLETTER_UNSUBSCRIBE_SECRET` | HMAC key for building each recipient's opt-out link |
| `RESEND_API_KEY` | Sending, on the agent's side only |
| `NEWSLETTER_BASE_URL` | `https://www.construction.live` |

**Do not give the agent the Convex deployment URL.** It buys nothing: every
piece of data reaches the agent through the endpoints below, and Convex is
already reachable behind them. Handing over the deployment address only widens
what a leaked agent config exposes. If a future need appears that genuinely
can't be served over HTTPS, add an endpoint rather than the URL.

**The two keys are not interchangeable and must not be merged.** The API key is
an access credential — revoke it the afternoon a laptop goes missing. The
signing secret derives links that must keep working for months in inboxes
nobody can reach. Rotating the API key must never break an opt-out link.

### Host

Use `https://www.construction.live` — the `www` host. It is what the site treats
as canonical and what it builds every unsubscribe link with, so the agent should
match it exactly.

Whether the bare apex (`construction.live`) redirects to `www` is a hosting
setting, not something this codebase controls. Don't rely on it: a redirect on a
`POST` can drop the request body, so an import aimed at the apex may silently
arrive empty. Always use the `www` host.

---

## 2. Syncing the subscriber list

### `GET /api/newsletter/subscribers`

```
Authorization: Bearer <NEWSLETTER_API_KEY>
```

| Query param | Meaning |
|---|---|
| `since` | Epoch ms, or any parseable date string. Omit for a full sync. |
| `cursor` | From the previous response, to continue a sync. |
| `limit` | Rows per page, 1–500, default 200. |

```json
{
  "subscribers": [
    {
      "email": "jordan@reyeselectric.com",
      "name": "Jordan Reyes",
      "company": "Reyes Electric",
      "interest": "Subcontractor / trade",
      "status": "subscribed",
      "createdAt": 1756080000000,
      "resubscribedAt": null,
      "unsubscribedAt": null,
      "updatedAt": 1756080000000,
      "unsubscribeUrl": "https://www.construction.live/newsletter/unsubscribe?token=...",
      "oneClickUrl": "https://www.construction.live/api/newsletter/unsubscribe?token=..."
    }
  ],
  "isDone": true,
  "cursor": "...",
  "nextSince": 1756080000000
}
```

`name`, `company`, `interest`, `resubscribedAt` and `unsubscribedAt` are `null`
when unset. Every timestamp is epoch milliseconds.

### The feed reports removals, not just additions

**Unsubscribes come back in this feed.** A sender that only learns about new
subscribers can add people and never remove them, and keeps mailing everyone
who ever opted out. `status` is the field to act on: anything other than
`"subscribed"` comes out of the local list.

### The sync loop

```js
let since  = store.getWatermark();   // null on the first run
let cursor = null, isDone = false;

while (!isDone) {
  const url = new URL("/api/newsletter/subscribers", process.env.NEWSLETTER_BASE_URL);
  if (since)  url.searchParams.set("since",  since);
  if (cursor) url.searchParams.set("cursor", cursor);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.NEWSLETTER_API_KEY}` },
  });
  if (!res.ok) throw new Error(`sync failed: ${res.status} ${await res.text()}`);

  const page = await res.json();
  for (const row of page.subscribers) store.upsertByEmail(row);

  ({ isDone, cursor } = page);
  if (isDone) store.setWatermark(page.nextSince);
}
```

Three rules that are easy to get wrong:

1. **Store `nextSince` only once `isDone` is true.** Saving it mid-pagination
   moves the watermark past rows the remaining pages still hold, and those rows
   never arrive again.
2. **Upsert by email; never append.** The watermark is inclusive, so the
   boundary row repeats on the next sync. That is deliberate: a repeat is a
   harmless no-op, while an exclusive boundary can drop a row written in the
   same millisecond — and the dropped row is a person who keeps getting mail
   after opting out.
3. **A `since` the server can't parse is a `400`, not a full sync.** Silently
   widening it would answer a delta request with the entire list, which looks
   like it worked right up until the issue goes out to everyone twice.

Sync immediately before every send. Anyone who opted out since the last sync is
still in the local copy until then.

---

## 3. Importing a list the agent already holds

### `POST /api/newsletter/subscribers`

```
Authorization: Bearer <NEWSLETTER_API_KEY>
Content-Type: application/json
```

```json
{
  "subscribers": [
    {
      "email": "jordan@reyeselectric.com",
      "name": "Jordan Reyes",
      "company": "Reyes Electric",
      "interest": "Subcontractor / trade",
      "status": "subscribed",
      "subscribedAt": "2025-03-02",
      "consentSource": "Mailchimp export, opted in via site form"
    }
  ]
}
```

Only `email` is required. `status` defaults to `"subscribed"`. `subscribedAt`
takes epoch ms or a date string and becomes their **consent date** rather than
the import date. `consentSource` records where the agreement came from — having
an address and being able to show they agreed are different claims, and the
second is the one that gets asked about.

```json
{
  "counts":  { "created": 412, "updated": 30, "suppressed": 4, "unsubscribed": 2 },
  "results": [{ "email": "...", "result": "created" }],
  "invalid": [{ "index": 17, "email": "bad@", "reason": "invalid_email" }]
}
```

### Rules the import enforces

- **No welcome email is sent.** These people subscribed elsewhere; greeting them
  as new signups reads as a mistake at best.
- **An address unsubscribed on the server is never resurrected.** Re-importing
  an old export is the ordinary way somebody who opted out last month quietly
  reappears. Those rows come back as `suppressed` — **that is the count to
  read after every import.**
- **Suppression flows the other way.** A row sent as
  `"status": "unsubscribed"` will opt out someone the server still thinks is
  subscribed. So **import an old suppression list first, as its own batch.**
  That is the safe direction to be wrong in.
- Existing details are never blanked by an empty column.

### Limits

- **500 rows per request.** More is a `413` with `max` and `received`, never a
  silent truncation — importing the first 500 of 2000 and returning `200` looks
  identical to a complete import. Chunk and loop.
- **No repeated address within one batch** (`duplicate_in_batch`). The write is
  a single transaction, so the second copy would read a row the first hadn't
  committed and insert it twice.
- A malformed row is reported in `invalid` and skipped; one bad address does not
  cost the other 499.

---

## 4. Building the unsubscribe link

The agent derives each recipient's link from their address. No call back to the
site, no table of tokens to hold.

```
token = HMAC_SHA256(NEWSLETTER_UNSUBSCRIBE_SECRET, email.trim().toLowerCase())
        rendered as lowercase hex
```

```js
import crypto from "node:crypto";

export function unsubscribeLinks(email) {
  const token = crypto
    .createHmac("sha256", process.env.NEWSLETTER_UNSUBSCRIBE_SECRET)
    .update(email.trim().toLowerCase())      // normalise, or it will not verify
    .digest("hex");

  const q = `email=${encodeURIComponent(email)}&token=${token}`;
  const base = process.env.NEWSLETTER_BASE_URL;

  return {
    // Goes in the visible body copy.
    page:     `${base}/newsletter/unsubscribe?${q}`,
    // Goes in the List-Unsubscribe header.
    oneClick: `${base}/api/newsletter/unsubscribe?${q}`,
  };
}
```

**The HMAC covers the normalised address** — `.trim().toLowerCase()`. Sign the
raw address and `Jordan@Co.com` yields a token that will not verify. This is the
single most likely thing to get wrong.

**The two URLs are not interchangeable.** The page asks before acting, because
inbox security scanners fetch every link in a message and a `GET` that acted on
sight would opt out people who never clicked. The API path is the RFC 8058
one-click endpoint that mail providers `POST` to directly.

### What every issue must carry

```
List-Unsubscribe: <https://www.construction.live/api/newsletter/unsubscribe?email=…&token=…>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
```

…plus a visible unsubscribe link in the body, pointing at the **page** URL.
Both are required: Gmail and Yahoo demand the header on bulk mail, and without
it their unsubscribe button reports the sender as spam instead.

Opt-outs through either route write straight back to the register, so they
disappear from the next sync automatically. Nothing to reconcile.

### Rotating the signing secret

Links are derived, not stored, so changing the secret invalidates every link
already delivered. To rotate, set the old value as
`NEWSLETTER_UNSUBSCRIBE_SECRET_PREVIOUS` on the **site**; both are accepted
until it is removed. Update the agent's copy, then drop the previous value once
the links carrying it no longer matter.

---

## 5. Unsubscribing directly

Rarely needed — the links handle it — but available for a reply that says "take
me off" in words.

### `POST /api/newsletter/unsubscribe`

Params in the query string or a JSON body:

```json
{ "email": "jordan@reyeselectric.com", "token": "<hmac for that address>" }
```

```json
{ "status": "unsubscribed", "email": "jordan@reyeselectric.com" }
```

| `status` | Meaning |
|---|---|
| `unsubscribed` | Was subscribed, now is not. |
| `already` | Was already unsubscribed. Not an error. |
| `unknown` | No such address. Not an error — treat as done. |

There is no way to unsubscribe by address alone. An endpoint that accepted a
bare address is an endpoint for removing anyone whose address you can guess.

`GET` on this path does **not** unsubscribe; it redirects to the confirmation
page, for mail clients that follow the header link as a human click.

---

## 6. Sending an issue

1. **Sync first** (§2). Always, immediately before composing.
2. **Filter to `status === "subscribed"`.** Never mail any other status.
3. **Compose per recipient** with that recipient's own links from §4.
4. Send through Resend with both `List-Unsubscribe` headers set.
5. **Never Bcc a block of addresses.** One message to many recipients cannot
   carry a per-recipient opt-out link, which is the thing that makes the send
   lawful — and it leaks the list to everyone on it.
6. **Log what was sent to whom, and when.** If a complaint arrives, the send log
   and `consentSource` are the whole defence.

### Frequency

The site promises "about once a month" on `/newsletter` and in the welcome
email. The agent should hold to that. Sending more often than the page promised
is a broken promise made in writing.

---

## 7. Error reference

Every failure is JSON: `{ "error": "<code>" }`.

### `GET /api/newsletter/subscribers`

| Status | Code | Meaning |
|---|---|---|
| 401 | `missing_api_key` | No `Authorization: Bearer` header. |
| 401 | `unauthorized` | Key rejected. |
| 400 | `invalid_since` | `since` could not be parsed. Do not retry as a full sync. |
| 503 | `not_configured` | Server missing its key or Convex URL. Not the agent's fault; alert a human. |
| 500 | `read_failed` | Upstream read failed. Retry with backoff. |

### `POST /api/newsletter/subscribers`

| Status | Code | Meaning |
|---|---|---|
| 401 | `missing_api_key` / `unauthorized` | As above. |
| 400 | `invalid_body` | Body was not JSON. |
| 400 | `missing_subscribers` | No `subscribers` array. |
| 400 | `empty_import` | Array was empty. |
| 400 | `no_valid_rows` | Every row was rejected; see `invalid`. |
| 413 | `too_many_rows` | Over 500. Carries `max` and `received`. Chunk and retry. |
| 503 | `not_configured` | Alert a human. |
| 500 | `import_failed` | Retry with backoff; the import is idempotent. |

### `POST /api/newsletter/unsubscribe`

| Status | Code | Meaning |
|---|---|---|
| 400 | `missing_token` | No token supplied. |
| 403 | `invalid_token` | Signature did not verify. Usually the normalisation bug in §4. |
| 503 | `not_configured` | Alert a human. |
| 500 | `unsubscribe_failed` | Retry with backoff. |

Retry `5xx` with backoff. Never retry a `4xx` unchanged — it will fail the same
way, and `403` in particular means the link the agent built is wrong for
everyone, not just this recipient.

---

## 8. Not for the agent

`POST /api/newsletter` is the public signup endpoint behind the form on the
website. It is unauthenticated, screened only by a honeypot field, and it
**does** send a welcome email. The agent should never call it: use the import endpoint (§3),
which is authenticated and deliberately silent.

---

## 9. Local store

Minimum the agent should keep:

| Field | Why |
|---|---|
| `email` (primary key) | Upsert target. Store the address as given; match on lowercase. |
| `status` | Decides who gets the issue. |
| `name`, `company`, `interest` | Personalisation and segmenting. |
| `updatedAt` | Debugging a sync. |
| `watermark` (one row, global) | The `nextSince` from the last completed sync. |
| send log: email, issue id, sent at | The record that answers a complaint. |

The register on the site is the source of truth for `status`. When the local
copy and a sync disagree, the sync wins.
