# GitHub Pages and SEO

The user approved GitHub.io hosting, query-string article URLs, and retaining live public content without a frontend redeployment. This supersedes the original local-only delivery restriction for this hosting phase.

## Two delivery targets

- `npm run dev` / `npm run build`: the existing Next.js server, clean article paths and authenticated draft preview.
- `npm run build:pages`: a separate App Router static export under `pages-site/out`. Public routes are `/en/`, `/tr/`, localized `/about/`, `/portfolio/`, and `/blog/?slug=localized-slug`. Root uses a meta refresh to `/en/`; GitHub Pages cannot issue an application HTTP redirect. `/admin/` contains the embedded Studio when configured. Studio uses hash navigation internally so refreshing editor routes works on a static host. It retains Sanity's authentication boundary.

Shared CSS and imported content keep the same design. The build copies public assets and does not modify the original portfolio repository. Preview endpoints and privileged tokens are excluded from the static target.

## Configuration

The GitHub repository is `ChagataiDuru/chagataiduru.github.io`. Pages is configured to deploy via the included GitHub Actions workflow, on commits to `main` or manual dispatch. It does **not** rebuild when Sanity content is published.

Configure these repository **Actions variables**, not tokens:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (a public dataset)
- `CONTENT_MODE=auto` or `sanity`
- `NEXT_PUBLIC_SANITY_PREVIEW_ORIGIN=http://127.0.0.1:3000` for local draft preview

The first connection or a change to these build-time settings requires a build. In Sanity CORS, add `https://chagataiduru.github.io` with credentials enabled for Studio, and your exact local preview origin with credentials enabled. Do not add wildcard origins. Start the local Next.js server with the Viewer token in `.env.local`; the online Studio Presentation tool points to that local server. Tokens are never added to GitHub variables, exported assets or the public client. Preview remains available only through Sanity's authenticated handshake. Browser rules about online frames accessing localhost may require opening the local Studio directly instead.

Public pages query `perspective: published`, without a token or credentials, and subscribe to Live Content API with `includeDrafts: false`. Matching sync tags trigger a refetch. Reconnection, tab visibility and a 30-second fallback poll also refresh content. Errors hide the content behind a localized error/retry screen. They never switch to fixtures or an empty blog. An unpublished article disappears from the live list and shows the unavailable state at its query URL. Related translation references are dereferenced from published documents only.

Without credentials the deployed site explicitly shows fixture content mode. `/admin/` shows setup instructions. Real login, uploads, preview and publishing remain unverified until the real project is configured.

## SEO and static-host limitations

Each language has the correct HTML `lang`, descriptive title and description. About, Portfolio and the blog index are prerendered. Canonical URLs use the public HTTPS origin and trailing slashes. Available language alternatives, Open Graph/Twitter metadata, WebSite, ProfilePage/Person, CollectionPage, BlogPosting and breadcrumb JSON-LD are provided. Imported content does not assert current employment or graduation status.

Article query pages share one static shell. The shell deliberately omits a canonical URL; after a published article loads, the browser sets its unique canonical, title, description, language alternatives, publication metadata and BlogPosting data. Links use actual crawlable `<a href>` query URLs. Unknown/unpublished articles and CMS errors receive client-side `noindex`; nonexistent paths receive GitHub Pages' normal 404. Query misses cannot return a distinct HTTP 404 on this static host.

Google can render JavaScript metadata and structured data, but indexing is not guaranteed and may be delayed. Bots that do not execute JavaScript will see the shared article shell, so per-article social previews cannot be guaranteed. The static sitemap and About/Portfolio HTML reflect the last build; published runtime content updates immediately on a live event, with polling as a fallback. Removing content from every saved static HTML snapshot also requires a build. New article discovery happens through the live blog's crawlable links. A manual rebuild can refresh the sitemap and static snapshots; it is not required for normal live content display. No build-per-publish automation is installed.

`robots.txt` permits public crawling and excludes the editor/API. It is not an access-control mechanism. Sanity permissions protect drafts and editing. Search Console ownership verification and sitemap submission need access to the user's Google account and have not been performed.

Primary references:
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://www.sanity.io/docs/content-lake/live-content-api
