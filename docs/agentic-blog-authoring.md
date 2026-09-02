# Agentic blog authoring

Lets a non-interactive caller — the editorial agent — create, update and delete
blog posts over HTTP, without signing in as a writer and without a commit/deploy
per post. Posts written this way are the **same `posts` rows** the authenticated
`/blog/new` editor writes, so they show up in the same `/blog` list, at the same
`/blog/<slug>` URLs, with the same SEO fields. The public blog pages are
`force-dynamic`, so a new or edited post is live immediately.

This sits alongside the human authoring flow — it does not replace it. A person
still writes posts through the signed-in editor; the agent writes through this
API. Both land in one place.

## How it's secured

A bearer secret shared with the caller, mirroring the newsletter sending API.
There is no user session — the caller is a program. The secret
(`BLOG_AGENT_API_KEY`) is checked at the HTTP edge **and** again inside every
Convex function, so a public Convex URL is not itself a write path. An unset
secret refuses every call rather than falling open.

## One-time setup

Set the secret on the Convex deployment (do this for each deployment you use —
dev and production):

```bash
# generate a strong secret
openssl rand -base64 32

npx convex env set BLOG_AGENT_API_KEY "<that-secret>"
```

Optionally pin who agent posts are attributed to. Without it, the author is
resolved as: an explicit `authorEmail` in the request → `BLOG_AGENT_AUTHOR_ID` →
the first `admin` → the first `writer`.

```bash
# a Convex users table _id (find it in the Convex dashboard → Data → users)
npx convex env set BLOG_AGENT_AUTHOR_ID "<users-table-id>"
```

The Next.js app only needs its usual `CONVEX_URL` / `NEXT_PUBLIC_CONVEX_URL`; it
does **not** hold the secret — it forwards the caller's bearer to Convex, which
verifies it. Hand the agent two things: the site base URL and the secret.

## Endpoints

Base: `https://www.construction.live` (or your local `http://localhost:3000`).
Every request needs `Authorization: Bearer <BLOG_AGENT_API_KEY>`.

| Method   | Path                | Purpose                                             |
| -------- | ------------------- | --------------------------------------------------- |
| `GET`    | `/api/blog`         | List posts (id, slug, title, excerpt, featured, timestamps). |
| `POST`   | `/api/blog`         | Create a post. Body below.                          |
| `GET`    | `/api/blog/<slug>`  | Read one post, including its full HTML `content`.    |
| `PUT`    | `/api/blog/<slug>`  | Partial update — only the fields sent are written.   |
| `DELETE` | `/api/blog/<slug>`  | Delete the post.                                    |
| `POST`   | `/api/blog/images`  | Host an image, get back a public URL to embed.       |

### Create / update body

All fields optional except `title` and `content` on create. `content` is
**HTML** (see conventions below). On update, send only what changes.

```jsonc
{
  "title": "How agentic AI files a project's paperwork",
  "content": "<p>…HTML…</p>",
  "slug": "agentic-ai-project-paperwork",   // optional; derived from title if omitted
  "excerpt": "A short summary for the card and meta description.",
  "coverImageUrl": "https://…",             // card + article hero
  "authorEmail": "someone@construction.live", // optional attribution override

  // Pinning (see "Featuring a post")
  "featured": true,
  "featuredOrder": 1,                       // optional tie-break, lower goes first

  // SEO / social (all optional)
  "metaTitle": "…",
  "metaDescription": "…",
  "metaKeywords": "…",
  "canonicalUrl": "https://…",
  "noIndex": false,
  "ogTitle": "…",
  "ogDescription": "…",
  "ogImageUrl": "https://…",
  "twitterCard": "summary_large_image",     // or "summary"
  "twitterTitle": "…",
  "twitterDescription": "…",
  "twitterImageUrl": "https://…"
}
```

Update-only extras:

- `newSlug` — rename the post (changes its URL). The slug is **not** auto-changed
  from an edited `title`; a live URL only moves when you pass `newSlug`.
- An empty string `""` on an optional field clears it; omitting the key leaves it
  untouched. `featuredOrder` is a number, so it takes `null` to clear instead.

Responses: create/update return `{ id, slug, url }`; delete returns
`{ deleted, slug }`. Errors are JSON with a stable `error` code —
`unauthorized` (401), `not_configured` (503, secret missing on Convex),
`not_found` (404), `slug_conflict` (409), `invalid_request` / `missing_fields`
(400).

## Featuring a post

By default `/blog` leads with the newest post, so publishing anything pushes the
last piece down. Featuring pins a post there instead: featured posts sort ahead
of everything else no matter what gets published after them.

- `"featured": true` pins it. The top featured post takes the big hero slot at
  the top of `/blog`; any others sort to the front of the grid with a "Featured"
  tag.
- `"featuredOrder": 1` decides which one is the hero when several are pinned —
  lower wins. Leave it out and the newest featured post leads, which is usually
  what you want.
- `"featured": false` unpins it, and clears its order so re-pinning later doesn't
  inherit a stale number.
- Nothing pinned = the old behaviour, newest post in the hero.

`GET /api/blog` reports `featured` and `featuredOrder` for every post, so check
there before pinning rather than assuming what's currently on top.

```bash
# pin a post as the hero
curl -X PUT "$BASE/api/blog/agentic-ai-project-paperwork" \
  -H "Authorization: Bearer $BLOG_AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"featured": true, "featuredOrder": 1}'

# unpin it
curl -X PUT "$BASE/api/blog/agentic-ai-project-paperwork" \
  -H "Authorization: Bearer $BLOG_AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"featured": false}'
```

## Content (HTML) conventions

The body is stored and rendered as raw HTML, matching what the TipTap editor
produces, so agent posts and human posts look the same. Stick to the tags the
editor uses:

- `<p>` for paragraphs.
- `<h2>` and `<h3>` for headings (the post `<h1>` is the title — don't repeat it).
- `<strong>`, `<em>`.
- `<ul>`/`<ol>` + `<li>`.
- `<blockquote>`.
- `<a href="…">`.
- `<img src="…" alt="…">` — use a hosted URL (upload via `/api/blog/images`).
- YouTube via an `<iframe>` embed if needed.

Keep it clean semantic HTML — no inline styles, no `<script>`, no full-document
scaffolding (`<html>`/`<body>`). Write a real `excerpt`; it's the card summary
and the fallback meta description.

## Images

Two ways to get a hosted URL to put in `coverImageUrl` or an inline `<img>`:

```bash
# 1) upload raw bytes (e.g. a generated PNG)
curl -X POST https://www.construction.live/api/blog/images \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: image/png" \
  --data-binary @cover.png
# → { "url": "https://…convex.cloud/…", "storageId": "…" }

# 2) pull from an existing URL
curl -X POST https://www.construction.live/api/blog/images \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{ "sourceUrl": "https://example.com/photo.jpg" }'
```

The file is stored on a `*.convex.cloud` host, already allowlisted for the Next
image optimizer, so it renders through `<RemoteImage>` like an editor upload.
Any other `https://` image URL also works (rendered unoptimized).

## Examples

```bash
KEY="…"; BASE="https://www.construction.live"

# list
curl -s "$BASE/api/blog" -H "Authorization: Bearer $KEY"

# create
curl -s -X POST "$BASE/api/blog" -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"title":"My first agent post","excerpt":"A short summary.","content":"<p>Hello from the agent.</p>"}'

# read current content, then fix a typo (partial update)
curl -s "$BASE/api/blog/my-first-agent-post" -H "Authorization: Bearer $KEY"
curl -s -X PUT "$BASE/api/blog/my-first-agent-post" -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"content":"<p>Hello from the agent — now corrected.</p>"}'

# delete
curl -s -X DELETE "$BASE/api/blog/my-first-agent-post" -H "Authorization: Bearer $KEY"
```

## For a future session (how to write a blog when asked)

1. `GET /api/blog` to see what already exists and avoid slug clashes.
2. Draft the post as clean semantic HTML per the conventions above; write a real
   `excerpt` and the SEO fields.
3. If it needs a picture, generate/find one and `POST /api/blog/images` to host
   it; put the returned URL in `coverImageUrl` (and inline `<img>` as needed).
4. `POST /api/blog` to publish. To revise, `GET /api/blog/<slug>` first, then
   `PUT` only the changed fields.

The secret and base URL come from the user (or the environment) — never commit
them.
