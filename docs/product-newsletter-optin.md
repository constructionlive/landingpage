# Product signup → newsletter opt-in

Instructions for the agent building product signup. This covers one thing:
when a user ticks "subscribe to our newsletter" during onboarding, get them
onto the newsletter register.

You do not need a database connection or a Convex URL. One authenticated HTTPS
call does it.

---

## 1. The checkbox

- **Default it to unchecked.** A pre-ticked box is not consent, and in Canada
  (CASL) and the EU (GDPR) it is not valid consent at all. Everything below
  assumes the user actively ticked it.
- Label it plainly, e.g. *"Email me the construction.live newsletter — about
  one a week, unsubscribe any time."* Do not bundle it with the terms
  checkbox; consent to be marketed to has to be separable from signing up.
- **Record the tick on your side**: user id, timestamp, and the exact label
  text they saw. If the consent is ever challenged, that record is the answer.
- If unticked, do nothing. Never call the endpoint "just in case."

---

## 2. The call

```
POST https://www.construction.live/api/newsletter/subscribers
Authorization: Bearer $NEWSLETTER_API_KEY
Content-Type: application/json
```

```json
{
  "expressOptIn": true,
  "subscribers": [
    {
      "email": "jordan@reyeselectric.com",
      "name": "Jordan Reyes",
      "company": "Reyes Electric",
      "subscribedAt": 1756080000000,
      "consentSource": "product signup checkbox, onboarding step 2"
    }
  ]
}
```

`expressOptIn: true` is required for this use case. It does two things:

- **Allows a previously-unsubscribed address back onto the list.** Without it
  the server refuses, which is correct for a bulk file restore and wrong here:
  someone who unsubscribed last year and has now deliberately ticked a box has
  given fresh consent, and silently ignoring it means they never hear from us.
- **Sends the welcome email**, so the first thing they receive confirms what
  they signed up for and carries an unsubscribe link.

`consentSource` is **required** whenever `expressOptIn` is true. Say where the
tick happened, specifically enough to find it later. A row without it is
rejected.

`subscribedAt` should be the moment they ticked the box, in epoch ms.

Batch limit in this mode is **50 rows**. You will normally send one.

### Response

```json
{
  "counts": { "created": 1 },
  "results": [{ "email": "jordan@reyeselectric.com", "result": "created" }],
  "invalid": []
}
```

`result` is `created`, `resubscribed` (they had unsubscribed before and are
back), or `updated` (already subscribed — nothing to do, not an error).

---

## 3. Call it asynchronously. Never block onboarding.

The newsletter is a nice-to-have; finishing signup is not. **This call must
never be able to fail the user's onboarding.**

Do not `await` it in the request that completes signup. Enqueue it.

```js
// In the signup handler: record the consent, enqueue, return. Never await.
async function completeSignup(user, form) {
  const account = await createAccount(user, form);

  if (form.newsletterOptIn) {
    await consentLog.record({
      userId: account.id,
      label: NEWSLETTER_CHECKBOX_LABEL,
      at: Date.now(),
    });
    // Fire into your job queue. Do not await the HTTP call itself.
    await queue.enqueue("newsletter.optIn", {
      userId: account.id,
      email: account.email,
      name: account.name,
      company: account.company,
      at: Date.now(),
    });
  }

  return account;   // onboarding completes regardless of the newsletter
}
```

```js
// The worker. Retried by the queue; safe to run many times.
async function handleNewsletterOptIn(job) {
  const res = await fetch(
    "https://www.construction.live/api/newsletter/subscribers",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEWSLETTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expressOptIn: true,
        subscribers: [
          {
            email: job.email,
            name: job.name,
            company: job.company,
            subscribedAt: job.at,
            consentSource: `product signup checkbox, user ${job.userId}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (res.status >= 500) throw new Error(`retryable: ${res.status}`);  // queue retries
  if (!res.ok) {
    // 4xx is a bug in our request. Retrying sends the same thing again.
    logger.error("newsletter opt-in rejected", {
      userId: job.userId,
      status: res.status,
      body: await res.text(),
    });
    return;   // swallow: the user is already signed up and must not be affected
  }
}
```

If you have no job queue, the fallback is fire-and-forget with a caught
promise — never an `await` in the signup path:

```js
subscribeToNewsletter(payload).catch((err) =>
  logger.error("newsletter opt-in failed", { userId, err }),
);
```

That is strictly worse: a failure is lost rather than retried. Prefer the queue.

### Retry rules

| Response | Do |
|---|---|
| `2xx` | Done. |
| `5xx` | Retry with exponential backoff, a few attempts, then log and stop. |
| `429` | Back off and retry. |
| `4xx` | Do not retry — the request is malformed. Log it and alert an engineer. |
| Timeout / network | Retry as `5xx`. |

**The call is idempotent.** Sending the same address twice does not create a
second row or a second welcome email — a repeat comes back as `updated`. So
retrying is always safe, and you never need to check first.

---

## 4. When the user unsubscribes

Do not build anything for this. If a user unsubscribes from the newsletter,
that happens through the link in the email and is recorded on the newsletter
side. It has nothing to do with their product account and must not affect it.

Equally: **unsubscribing from the newsletter must never disable product
emails** (password resets, receipts, notifications), and unticking a
newsletter preference in your settings screen is the *only* thing that should
call the unsubscribe path. If you build a settings toggle, ask for the
matching spec before implementing it — the opt-out endpoint requires a signed
token and will not accept a bare email address.

---

## 5. Configuration

| Variable | Value |
|---|---|
| `NEWSLETTER_API_KEY` | The shared API key. Server-side only. |

**Never expose this key to the browser.** It reads the entire subscriber list.
The call above is made from your backend or a worker, never from client-side
JavaScript, and the key must not appear in any bundle, any log line, or any
error message returned to a user.

You do not need `NEWSLETTER_UNSUBSCRIBE_SECRET` for this. Do not request it.
