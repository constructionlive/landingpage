# Agentic landing pages

Audience landing pages at `/for/<slug>` — `/for/subcontractors`,
`/for/consultants`, `/for/general-contractors` — created and maintained over
HTTP by an agent, with no editor UI and no deploy.

They are not blog posts. A post is dated editorial in a reverse-chronological
list; a landing page is undated, stands alone, and exists to convert one
audience. They live in their own `landingPages` table and their own API.

## How it's secured

The same `BLOG_AGENT_API_KEY` bearer secret as the blog API, sent as
`Authorization: Bearer <key>`. One key for both surfaces on purpose: it's one
caller, and a second secret would be a second thing to rotate and to leak.

The secret is verified inside every Convex function (`convex/agentAuth.ts`), not
only at the HTTP edge, so a public Convex function URL is not itself a write
path. An unset secret refuses every call rather than falling open.

## Why these are static and the blog isn't

`/blog` is `force-dynamic` and queries Convex on every request. `/for/<slug>` is
prerendered:

- `generateStaticParams` builds every page that exists at deploy time.
- Every write through this API calls `revalidatePath`, so an edit is live within
  the second without a redeploy.
- `revalidate = 3600` is only a backstop for writes that reach Convex some other
  way (the dashboard, a script). Nothing depends on it for normal edits.
- `dynamicParams` stays on, so a page created after the last deploy renders on
  first request instead of 404ing.

A landing page changes when someone deliberately edits it and otherwise not at
all, so a database round trip per visitor buys nothing — and these are the pages
paid traffic lands on, where that round trip is what the click is paying for.

## Endpoints

Base: `https://www.construction.live` (or `http://localhost:3000`).

| Method   | Path                | Purpose                                          |
| -------- | ------------------- | ------------------------------------------------ |
| `GET`    | `/api/pages`        | List pages (slug, headline, timestamps).         |
| `POST`   | `/api/pages`        | Create a page. Body below.                       |
| `GET`    | `/api/pages/<slug>` | Read one page, including its HTML `content`.     |
| `PUT`    | `/api/pages/<slug>` | Partial update — only the fields sent are written. |
| `DELETE` | `/api/pages/<slug>` | Delete the page.                                 |
| `GET`    | `/api/blog/spec`    | What this key can do, as JSON. Shared with the blog. |

Images: reuse `POST /api/blog/images`. It hosts bytes on the same Convex storage
host and returns a URL usable anywhere, landing pages included.

### Create / update body

Required on create: `slug`, `headline`, `content`. Everything else is optional.
On update send only what changes.

```jsonc
{
  "slug": "subcontractors",                 // becomes /for/subcontractors
  "headline": "Stop losing money to paperwork you didn't cause",

  // Hero, all optional
  "eyebrow": "For subcontractors",          // small label above the headline
  "subheadline": "One sentence on what changes for them.",
  "ctaLabel": "Book a 20-minute demo",
  "ctaHref": "/book",                       // internal path or absolute URL
  "secondaryCtaLabel": "See pricing",
  "secondaryCtaHref": "/pricing",

  // The middle of the page, as HTML
  "content": "<h2>…</h2><p>…</p>",

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

- `newSlug` — move the page to a different URL. Both the old and new URLs are
  purged from the cache. The slug never changes from an edited `headline`.
- An empty string `""` on an optional field clears it; omitting the key leaves
  it untouched.

Slugs are lowercased and may contain only letters, numbers and hyphens — they
become a URL segment, so anything else is rejected rather than silently mangled.

Responses: create/update return `{ id, slug, url }`; delete returns
`{ deleted, slug }`. Error codes match the blog API: `unauthorized` (401),
`not_configured` (503), `not_found` (404), `slug_conflict` (409),
`invalid_request` / `missing_fields` (400).

## What the template guarantees

The hero and the call-to-action are real fields rather than part of `content`,
so every page gets the two things free-form HTML most often forgets:

- exactly one `<h1>`, from `headline`;
- a working CTA, rendered twice — once in the hero and once after the body, so
  someone who read to the end doesn't have to scroll back up.

The site header (`SiteNav`) and footer (`SiteFooter`) are always present, so a
landing page is part of the site rather than an orphan. `content` fills the
middle and is styled by the same rules as blog post bodies (`.page-content` in
`app/globals.css`), so headings and lists look the same wherever they're written.

## Content (HTML) conventions

Same dialect as blog posts: `<p>`, `<h2>`, `<h3>`, `<ul>`/`<ol>` with `<li>`,
`<blockquote>`, `<strong>`, `<em>`, `<a>`, `<img>`, `<hr>`. Start the body at
`<h2>` — the `<h1>` is the headline field, and a second one competes with it.

## SEO

- In `sitemap.xml` automatically, at priority 0.8, with `lastModified` from the
  page's real update time. Pages that set `noIndex` or point `canonicalUrl`
  elsewhere are excluded.
- `robots.txt` allows `/for/` — nothing to configure.
- Canonical, OpenGraph and Twitter tags come from the fields above, defaulting to
  the headline and subheadline when the explicit ones are absent.
- `"noIndex": true` keeps a page out of search entirely. Use it for a
  paid-traffic variant that would otherwise compete with the page it was cloned
  from.

## Tracking

PostHog captures a `$pageview` for these like any page. On top of that:

- `landing_page_viewed` fires once per view with a `slug` property, so all the
  persona pages are one funnel with a breakdown rather than a URL regex pasted
  into every insight.
- `cta_clicked` fires on both buttons with `location: "landing_<slug>"`,
  `variant: "primary" | "secondary"` and the `href`. The primary and secondary
  are separated because "the CTA converts at 4%" is a different decision from
  "the primary converts and nobody touches the secondary".

Both respect the consent gate: posthog-js is initialised opted-out for EEA/UK
visitors, so nothing is captured before they accept.

## Examples

```bash
BASE=https://www.construction.live

# list
curl -H "Authorization: Bearer $BLOG_AGENT_API_KEY" "$BASE/api/pages"

# create
curl -X POST "$BASE/api/pages" \
  -H "Authorization: Bearer $BLOG_AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "consultants",
    "eyebrow": "For consultants",
    "headline": "Bill for judgement, not for chasing documents",
    "subheadline": "Your value is the advice. The hours around it are admin nobody wants to pay for.",
    "ctaLabel": "Book a demo",
    "ctaHref": "/book",
    "content": "<h2>Where consultant hours actually go</h2><p>…</p>",
    "metaDescription": "How consultants cut the admin hours around the advice."
  }'

# change one line of copy
curl -X PUT "$BASE/api/pages/consultants" \
  -H "Authorization: Bearer $BLOG_AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"subheadline": "A shorter, sharper promise."}'

# delete
curl -X DELETE "$BASE/api/pages/consultants" \
  -H "Authorization: Bearer $BLOG_AGENT_API_KEY"
```

## For a future session (how to write a landing page when asked)

1. `GET /api/pages` first, to see what exists and avoid a slug clash.
2. Pick a slug that reads as an audience, not a campaign code:
   `/for/subcontractors`, not `/for/lp-2026-q3`.
3. Write the headline as the promise to that audience, and the subheadline as
   the one sentence that makes it credible. These are the `<h1>` and the meta
   description — they do the SEO work.
4. Body starts at `<h2>`. Name the audience's actual problem before the product.
5. Always set `ctaLabel` and `ctaHref`. A landing page without one is a blog
   post with a bigger headline.
6. `POST`, then open the returned `url` and read it.
