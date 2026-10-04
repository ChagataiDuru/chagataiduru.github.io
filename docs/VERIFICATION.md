# Local verification — 4 October 2026

## Completed

- `npm test`: all six meaningful tests passed: fixture/configuration policy, missing article translations, seven-project/no-post content integrity, URL safety, escaped highlighted code including Turkish characters/unknown syntax, and rich text headings/lists/links.
- `npm run typecheck`: passed.
- `npm run build`: production compilation and TypeScript passed. No Sanity credentials were provided; build used fixture mode.
- Production HTTP checks: `/` redirects to `/en`; both language indexes, About and Portfolio return 200 with the correct HTML language, canonical and localized copy. Each portfolio has seven projects.
- Unknown English/Turkish article slugs and unsupported languages return 404.
- The CV URL returns a PDF whose bytes match the imported source. Copied portrait and PDF SHA-256 hashes equal the original assets.
- `/admin` explicitly states that the CMS is disconnected; no simulated login or publishing is presented.
- The draft enable endpoint rejects a forged preview request in fixture mode (503) and does not set a draft cookie. Forged bypass/perspective cookies did not expose preview content in fixture mode; configured CMS checks remain pending. Client-supplied locale headers are overridden.
- A separate production instance using an unavailable Sanity project/dataset received a real Sanity API 404 (dataset not found) and returned 500 rather than silently returning fixtures or an empty blog. This validates the CMS failure branch; it does not verify an authorized project or any editing workflow.
- Desktop (1280px) and mobile (390px) About, Portfolio and empty-blog layouts inspected through the in-app browser. Turkish characters render correctly; language navigation changes `html lang`; mobile profile columns stack. Reference pages were inspected directly; no screenshots were attached by the user.
- Article layout checked with a clearly labeled temporary QA fixture, not a blog post: author sidebar, headings, lists, link, image/caption and highlighted code. The sidebar stacks above the article on mobile. Long code is confined to an internally scrollable block. The temporary public QA file is removed before delivery.
- The final build serves the sitemap dynamically, so publication does not freeze sitemap entries at build time.
- The final Turkish CMS failure screen was visually verified; it shows a localized error and retry button without internal error details.
- Source repository Git status matches its initial state; its existing local changes were not modified.

## Real CMS checks still required

Creating a Sanity project, adding its ID/dataset, server-only Viewer token and permitted credentialed CORS origins are prerequisites. No real login, upload, preview, publication, update or unpublication has been verified.

1. Sign in at `/admin` with an authorized Sanity account. Confirm signed-out visitors cannot mutate content.
2. Run the draft importer using a temporary Editor token. Verify uploaded portrait/PDF and all localized draft records. Remove the import token.
3. Review career dates and Turkish translations. Open Presentation; verify the authenticated draft handshake, image/file preview and visual editing.
4. Create a disposable test article with rich body content. Keep it a draft; confirm an unauthenticated browser and Sanity’s public API cannot retrieve it.
5. Publish only English. Confirm the article/index update live without redeploy; confirm no Turkish translation link or `hreflang` is emitted.
6. Publish the Turkish related document with a different localized slug. Confirm reciprocal translation navigation/metadata and correct canonical URLs.
7. Update a published title/body; verify public live refresh. Unpublish a translation; verify its link disappears. Unpublish the original; verify the index removal and article 404 without redeploy.
8. Repeat profile/project publication and CV download from uploaded Sanity assets. Check a genuine CMS network outage yields an error and never fixtures/empty results. Restore connectivity and verify retry.
9. Exit preview; confirm draft cookies are cleared. Repeat unauthorized enable-route tests against the configured CMS (expect 401 for invalid secrets).

## Dependency limitation

The installed compatible Sanity 5.29 / localization plugin combination currently has 15 npm audit findings (5 moderate, 10 high), mainly propagated from Studio CLI/transitive dependencies. The available localization plugin declares Sanity 5 as its peer; no forced downgrade or incompatible peer override was applied. Review and update this dependency set before connecting a production CMS; the current Pages site has no CMS credentials. This local verification does not certify those upstream dependencies as vulnerability-free.

No custom domain configuration was performed. GitHub.io hosting was subsequently authorized; see the update below.


## GitHub Pages and SEO update

- The user accepted query article URLs and retained live content without a redeploy.
- `npm run typecheck`, `npm test` (12 tests), the server production build, and `npm run build:pages` passed locally.
- Static EN/TR HTML contains the correct `lang`, title, description, canonical, available hreflang, Open Graph/Twitter metadata and JSON-LD. The generic article shell has no incorrect canonical.
- Browser verification: About and the seven-project Turkish portfolio render correctly; canonical/hreflang point to the public HTTPS origin. At 390px the page width equals the viewport. Unknown query articles display the unavailable state, correct title and client-side noindex, with no translation link.
- Exported PDF bytes match the original. No API/draft routes are exported. Environment files and build outputs are ignored by Git.
- A mock public transport verifies published-only reads, draft-free SSE, sync-tag matching, publish/update/unpublish refresh, connection recovery and error reporting. This verifies code behavior, not an actual Sanity project.
- The static export's sitemap and HTML snapshots update at build time. Live content and article metadata update in the browser. Non-JavaScript social crawlers and query-route HTTP status codes have the limitations recorded in docs/GITHUB_PAGES.md.
- GitHub Actions run 37210284643 succeeded in 1m39s on a clean Ubuntu/Node 24 runner: npm ci, typecheck, 12 tests, static build and Pages deployment all passed. Deployed application commit: 48f3013.
- Live URL: https://chagataiduru.github.io/; HTTPS is enforced. Both languages and all six main pages returned 200 with correct HTML language, canonical and JSON-LD. robots.txt, sitemap.xml and the editor setup page returned 200. The CV bytes match the imported PDF. Unknown paths and the unavailable public draft endpoint returned 404.
- The hosted Turkish About page was visually inspected at desktop and 390px mobile widths; no horizontal overflow. Proof screenshots: docs/screenshots/github-pages-desktop.png and github-pages-mobile.png.
- Hosted content is explicitly fixture mode. Real Sanity login, uploads, preview and publish/update/unpublish remain pending project configuration. Search Console registration was not performed.

## Sanity connection — 5 October 2026

- Connected project `shoydm6q`, public dataset `production`. The supplied Developer API token is stored only in Git-ignored `.env.local` with mode 0600. It was not added to GitHub variables or exported browser assets. Rotate the token shared in chat; use a Viewer token for ongoing local preview after import.
- Deployed the authoritative existing embedded Studio schema. Installed and read Sanity's `sanity-best-practices` get-started, migration and TypeGen references. The original `/admin` architecture is retained. The skill is available on subsequent turns.
- TypeGen found six queries and generated 25 schema types. The installed CLI 6.7.2 uses `sanity schemas extract` without the older unsupported `--force` option.
- Uploaded the original portrait and PDF. The downloaded Sanity PDF bytes match the source. Created 17 drafts: settings, two profiles, and seven projects per language. Created eight related translation groups. There are no blog posts. Ordinary project IDs use Sanity's ID helpers; import source identifiers support idempotence. Singletons retain their deliberate IDs.
- A second import created zero drafts and preserved all 17 existing records. Biography, role, project descriptions, technologies, dated review notes and review flags match the source fixtures.
- Verified real unauthenticated raw queries cannot retrieve the imported drafts. An anonymous mutation dry-run was rejected. Forged preview secrets return 401 without a cookie; a genuine Sanity secret handshake enabled draft-only local preview. Separate public and forged-cookie requests did not expose it. Exit preview cleared the cookie. The temporary preview secret was cleaned up.
- A temporary technical probe (`catoVerification`, excluded from all website queries) verified actual draft-free Live Content API publish/update/unpublish and counterpart availability in under 15 seconds per step, without a build or the fallback poll. Six live snapshots were received. All probe records were removed; imported content remained untouched. This is transport validation, not a claim that a real blog article or signed-in Studio workflow was exercised.
- Automatic approval review rejected credentialed CORS additions and the proposed temporary test on real imported projects. Neither rejected action was executed. The live test used the safer isolated probe instead. Approval for CORS on exactly `https://chagataiduru.github.io` and `http://127.0.0.1:3000` is pending.
- The online editor is connected independently of the public content mode. GitHub variables contain only public project/dataset/preview-origin values. Public Pages content remains explicitly fixture mode during review; set `CONTENT_MODE=auto` and run the initial connection build after published content is ready. Later content changes require no frontend redeployment.
- Browser account login, Studio uploads, Presentation interaction and real article publishing remain to be verified after the CORS permission and the user's Sanity account sign-in.
