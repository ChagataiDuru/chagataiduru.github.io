# Çağatay Duru website

## Purpose and delivery
English/Turkish blog, CV and portfolio. Local-first delivery in this workspace. No deployment, domain changes or Sanity project creation unless explicitly authorized. Never modify /Users/cagatayduru/Documents/GitHub/cs16-portfolio. Real CMS workflow validation requires the user's Sanity project configuration.

## Authorized hosting update
The user subsequently authorized GitHub.io hosting, query-string article URLs, SEO optimization, and preserving live public updates without redeploy. Use the separate `pages-site` static App Router target (`npm run build:pages`) while retaining local Next.js for authenticated draft preview. Public Pages article paths are /en/blog/?slug=... and /tr/blog/?slug=.... Never bundle privileged tokens or draft endpoints. Public reads use published perspective and draft-free Live Content API. Follow docs/GITHUB_PAGES.md and document static sitemap, HTML snapshot, social preview and query soft-404 limitations honestly.

## References and design
- https://www.sebastianaaltonen.com/about (primary proportions, typography, white space)
- https://localjoost.github.io/Upgrading-reading-and-positioning-QR-codes-with-HoloLens-2-to-Unity-2020-%2B-OpenXR-plugin/ (article readability and compact author sidebar)
White background, black sans-serif text, generous whitespace, minimal borders and underlined links. Responsive biography/portrait columns; readable article column and author sidebar that stacks on mobile. No game interactions, comments, contact forms or translation services.

## Stack and routes
Next.js App Router, TypeScript, next-sanity, embedded Sanity Studio. / redirects to /en. /en and /tr are blog indexes; localized /blog/[slug], /about and /portfolio. /admin hosts Studio. Use native semantic HTML, system sans-serif and CSS. Preserve Turkish characters.

## CMS and localization
siteSettings singleton; localized profile, post and project documents with language en/tr. Use @sanity/document-internationalization and translation.metadata reference documents. Each language publishes independently. Only published related documents appear in translation navigation and SEO alternatives. No public draft retrieval. Privileged tokens stay in server-only modules or local import scripts; never NEXT_PUBLIC tokens. Draft mode activation uses the verified next-sanity Studio handshake. Public metadata always uses published content. Live Content API via defineLive and SanityLive. No browser draft token.

Without project ID/dataset, explicitly identify local fixture mode. A configured CMS failure must produce an error, never fallback to fixtures or a misleading empty list. Import content as drafts; preserve dates, flag stale employment/graduation and Turkish translation review. Never invent projects, links or blog posts.

## Commands
npm install; npm run dev; npm run typecheck; npm test; npm run build; npm start. Configure .env.local from .env.example. npm run import:content uploads the supplied portrait/PDF and creates drafts without overwriting existing records; requires a server-only write token.

## Verification
Run typecheck, meaningful content/security tests and production build. Visually inspect desktop/mobile against references. Check both languages, Turkish characters, navigation, PDF, rich text/code, empty blog, unknown slugs, missing translations, CMS errors, SEO and denied unauthenticated draft access. With credentials, test Sanity login, uploads, previews, publish/update/unpublish and live public changes without redeploy. Never claim the CMS works until verified. Record outstanding live validation and content review in docs/VERIFICATION.md and docs/CONTENT_REVIEW.md.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
