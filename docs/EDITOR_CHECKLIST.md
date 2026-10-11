# First editing session

Project: `shoydm6q`, public dataset `production`. Editor: https://chagataiduru.github.io/admin/.

## Account and preview

1. Sign in with the Sanity account that owns or can edit this project. The local API token does not sign you into Studio.
2. Start `npm run dev` and use http://127.0.0.1:3000/admin for local editing and authenticated Presentation preview. The hosted editor also points Presentation at this local server. If the browser blocks the hosted-to-local frame, use the local editor.
3. In Presentation, open the English and Turkish About drafts. Confirm the portrait and CV appear. Exit preview, then check the same URL in a separate signed-out session; unpublished drafts must remain unavailable.

## Review the imported content

The import contains settings, two profiles and fourteen projects, all as drafts. There are no blog posts. The seven projects per language and their translations are linked already; placeholder URLs were omitted.

- Confirm NTT Data employment end/status and Özyeğin graduation/degree/minor wording in both profiles. Until confirmed, retain the dated uncertainty notes.
- Review the Turkish biography, role names, skills and project descriptions.
- Review the original English PDF before replacing it: it still contains the old source wording. Both languages currently download that same original file.
- Keep `needsReview` enabled until each document is reviewed. Upload a revised CV through the profile's file field when available; no translated PDF has been invented.

## Activate the public CMS content

After reviewing the records, publish site settings, both profiles and the projects independently in each language. Then change the repository Actions variable `CONTENT_MODE` from `fixture` to `auto` and run the Pages workflow once. This initial build activates the CMS connection; subsequent publishing, updates and unpublishing refresh the public website without another build.

Check the two About pages, two portfolios, uploaded CV and intentionally empty blog indexes. A CMS error must show the error/retry state, never old fixtures or a misleading empty result. Do not run publish/unpublish tests on real career/project records; the isolated `catoVerification` transport check is available instead.

## First real article

Create an English or Turkish post when there is real author-supplied content. Set its title, language, slug, excerpt, publication date, tags and body. Add meaningful image alt text and a language to code blocks. Preview the draft and publish the desired language. Use the language menu to create a related translation; its link appears publicly only after that document is published.

Public article URLs are `/en/blog/?slug=...` and `/tr/blog/?slug=...`. The static sitemap and social-crawler limitations are documented in [GITHUB_PAGES.md](GITHUB_PAGES.md). Search Console verification and sitemap submission require the owner's Google account; they have not been performed.
