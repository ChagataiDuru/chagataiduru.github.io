# Çağatay Duru — blog, CV and portfolio

A local-first English/Turkish website built with Next.js App Router, TypeScript, `next-sanity` and embedded Sanity Studio. White, minimal typography follows [Sebastian Aaltonen’s About page](https://www.sebastianaaltonen.com/about); the article sidebar and readable column follow [LocalJoost’s article](https://localjoost.github.io/Upgrading-reading-and-positioning-QR-codes-with-HoloLens-2-to-Unity-2020-%2B-OpenXR-plugin/).

## Local setup

Use Node.js 22.12+ (tested with Node 25). Install and start:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open the exact local address printed by Next.js, normally http://127.0.0.1:3000. `/` redirects to `/en`; `/en` and `/tr` show the blog. Each language has `/about`, `/portfolio`, and `/blog/[slug]`. `/admin` is the editor.

With no project ID or dataset the site uses clearly labeled local fixtures. The editor shows setup instructions; login, uploads and publishing are unavailable. The source contains no blog posts, so both blog indexes are intentionally empty. Fixture content lives in `lib/fixtures.json`. Set `CONTENT_MODE=fixture` to choose fixtures explicitly, or `CONTENT_MODE=sanity` to require CMS configuration. Partial/invalid configuration fails rather than silently switching to fixtures. CMS failures show an error, never a misleading empty list.

## Connect Sanity

1. Create a project at [Sanity Manage](https://www.sanity.io/manage) and a **public dataset** (for example `production`). A public dataset exposes published content; drafts and mutations still require authentication. This implementation uses token-free public Live Content subscriptions. Private datasets require a different access design.
2. Add `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` to `.env.local`. Keep `NEXT_PUBLIC_SANITY_API_VERSION=2026-02-01`. Set `NEXT_PUBLIC_SITE_URL` to the exact local origin you use. Never derive canonical origins from arbitrary request headers.
3. In project settings → API → CORS Origins, add `http://127.0.0.1:3000` **with credentials enabled**. Also add `http://localhost:3000` if you use that address. Studio, public pages and preview should use the same origin. Add only your actual origins; do not use a wildcard. For GitHub Pages, also add the public origin as documented in `docs/GITHUB_PAGES.md`.
4. Create a Viewer API token and set `SANITY_API_READ_TOKEN`. It stays server-side and enables draft preview. Do not prefix it with `NEXT_PUBLIC_`. Studio itself signs in through Sanity’s account login and uses the permissions of the signed-in project member; the frontend token grants no editing rights.
5. Restart the development server after changing configuration. Open `/admin`, sign in with your Sanity account and verify that your account has editor/admin project access.

The schemas include singleton site settings, localized profile/CV, posts and projects. `@sanity/document-internationalization` connects independent language documents through `translation.metadata`. The profile IDs are `profile-en` and `profile-tr`; use the dedicated profile entries in Studio. New posts and projects are created in the language of the Studio language menu. Languages publish independently; bulk publishing is disabled. There is no automatic translation service.

## Import the existing content as drafts

The original repository remains unchanged. The imported portrait and CV are copied into `public/`; English and review-ready Turkish text are in `lib/fixtures.json`. The original English PDF remains unmodified and is downloadable in both languages; a Turkish CV PDF has not been invented.

Create an Editor API token and temporarily set `SANITY_API_WRITE_TOKEN` in `.env.local`, then run:

```sh
npm run import:content
```

This uploads the portrait/PDF, creates settings, two profiles and seven projects in each language as **drafts**, and connects translations. It creates no posts and publishes nothing. Existing published/drafted records are skipped; editor work is not overwritten. Asset uploads may complete before a document import failure. Sanity deduplicates identical uploads. Remove the write token after import. Review dates, career wording and Turkish translations using `docs/CONTENT_REVIEW.md` before publishing.

## Editing, preview and publishing

- Edit profile/CV, projects or posts in `/admin`. Upload images with meaningful alt text, upload a PDF for the CV, and use the body editor for headings, lists, links, images and code blocks. Code supports a language and optional filename, with server-rendered Shiki highlighting.
- Use **Presentation** to preview changes. `next-sanity` validates Sanity’s preview secret before enabling an HTTP-only draft cookie. No custom public draft API exists. `SANITY_API_READ_TOKEN` is required. Without a valid Studio preview handshake the enable route rejects the request. Preview is an authenticated editor capability; do not share preview URLs or cookies.
- Draft reads happen only server-side. No Viewer or Editor token is passed to the browser. Presentation supplies the editing context for live draft updates; standalone previews do not subscribe to draft events, so refresh them to see new draft edits.
- Click **Publish** separately for each language. Published content is returned by the normal public perspective. `SanityLive` refreshes public pages when publishing/updating/unpublishing occurs; no frontend redeploy is intended. Translation navigation and SEO resolve related documents using the **published** perspective, even inside draft preview.
- To remove a post/project/profile from the public site use Sanity’s **Unpublish** action. Verify the removal from an unauthenticated window. Missing article slugs return 404. A missing localized profile or empty published project collection has an explicit message.
- Publication date orders articles; it is not a scheduled publishing control. Sanity’s actual Publish action controls visibility.
- Use **Exit preview** to clear the draft cookie. Verify public behavior in a separate signed-out browser session.

**The live CMS workflow has not been verified without project configuration.** Creating a real project and supplying configuration are prerequisites for validating login, uploads, authenticated preview, publication and live updates. Follow `docs/VERIFICATION.md`; do not consider publishing operational until those checks pass.

## Verification commands

```sh
npm test
npm run typecheck
npm run build
npm start
```

With the fixture production server running, `node scripts/check-local.mjs` repeats the local HTTP checks (set `CATOSITE_CHECK_ORIGIN` for another local port).

`npm test` verifies mode selection, missing translations, content integrity, URL safety and rich-text/code rendering. See `docs/VERIFICATION.md` for HTTP and visual checks, limitations and the remaining live workflow checklist. GitHub.io hosting is now authorized; see `docs/GITHUB_PAGES.md` for static hosting, live public content, local authenticated preview and SEO limitations. There is no custom domain setup, contact form, comments, game interaction or translation service.

## GitHub.io build

```sh
NEXT_PUBLIC_SITE_URL=https://chagataiduru.github.io npm run build:pages
```

The export is `pages-site/out`. The included workflow deploys it to GitHub Pages. Query article URLs are `/{language}/blog/?slug=...`; publishing content does not trigger a frontend redeploy. See `docs/GITHUB_PAGES.md` before configuring Sanity and `docs/VERIFICATION.md` for the actual validation status.

## Connected project / review stage

The configured Sanity project is `shoydm6q`, public dataset `production`. The original portrait/PDF and 17 content documents were imported as drafts, with eight translation groups. Repeat imports preserve existing documents. The embedded editor at `/admin/` can be configured while public Pages remains in explicit fixture mode for review. Credentialed CORS must be approved on the exact editor origins before browser login works; then sign in with your Sanity account. Do not put the supplied token in GitHub variables or the browser. Rotate the token shared in chat and keep a least-privilege Viewer token only in `.env.local` for ongoing preview.

`npm run typegen` regenerates schema/query types. `npm run check:sanity` verifies the initial draft-only import, asset integrity and local preview security. `npm run check:sanity-live -- --disposable-probe` creates isolated technical test records, checks real live events, and cleans them up without changing imported content. It creates no blog posts. See the latest section of `docs/VERIFICATION.md` for actual checks and pending browser validation.
