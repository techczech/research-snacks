# AGENTS.md (research-snacks)

- Register: FOR AGENTS. Public repo: nothing private, ever.
- What: one folder per experiment in `entries/` -> static site in `site/` via `bun run build` (Astro + bun). Live: researchsnacks.semanticmachines.fyi. Sister site: model-data-points (datapoints.semanticmachines.fyi).

## Add an entry

1. Folder `entries/YYYY-MM-DD-short-slug/` contains only `index.md` (frontmatter fields in README.md; `id` = folder name) and `charts/`. Charts holds only rendering assets: PNG, chart CSV, Vega-Lite specifications and HTML infographic snippets.
2. Research data and analysis code belong in `techczech/research-snacks-data`, under `snacks/<entry-id>/`. Check its source/licensing decisions before copying; withhold restricted corpus text and run records. Add the verified local-to-GitHub paths to `src/lib/research-assets.json`; the build rewrites entry data/code links to GitHub blob URLs and generates the Files lists. Keep the checking-repository link. Every number must be traceable to those research files. Time taken is measured; human time is an estimate and says so.
3. Privacy check before commit: no personal names, machine nicknames/hostnames, file paths, email addresses, account or plan details, private document titles or content. The build rejects local paths, emails and hostnames in every text file under `entries/`; it cannot catch the rest, so read the entry.
4. Prose: short and literal, British spelling; `dominik-writer` for longer write-ups.
5. `bun run check`, then check the entry headlessly (`bun run check:release`). Check charts and data/code links. Commit, push, `scripts/deploy.sh --production` from clean `main` (needs `CLOUDFLARE_ACCOUNT_ID=b6ae5bced06492ee6f0c8f92776804da` if several accounts). Check the entry URL (https://researchsnacks.semanticmachines.fyi/<id>/) returns 200.

## Notes

- Id (with its date) is the URL; keep it stable.
- `site/` git-ignored. Licence: content CC BY 4.0, code MIT.
- One-off setup (Pages project, custom domain, DNS) is not scripted.

## Astro and shared web patterns

- `src/lib/content.ts` owns frontmatter/privacy validation, Markdown, references, figures and TOC. `scripts/prepare-site.ts` copies assets to ignored `.generated/public/`; Astro writes `site/`. `entries/` and `content/about.md` stay canonical.
- Kit copies in `src/scripts/kit/` and `src/styles/kit/dialog.css` are unchanged. Wrap them in the site script; never edit a copy. The legacy `/copy.js` URL is retained, while new pages use the bundled kit.
- `/rss.xml` contains complete entry summaries, dates, links and category/tag labels. Every Astro page advertises it. Markdown counterparts, `/llms.txt`, JSON-LD and `/search-index.json` serve agents.
- `bun run check` builds and checks types, citations, RIS, privacy, local links/anchors and RSS. `bun run check:release [preview-url]` runs headless Chromium checks; nothing visible may launch. `scripts/deploy.sh --preview` publishes the feature branch; production requires clean `main`. When several agents share this checkout, commit only with explicit paths (`git commit -m … -- <your paths>`; never `git add -A` or `git commit -a`, which sweep up other agents' staged files), push, then build and deploy production from a fresh clone of origin/main in a scratch folder, and delete it after.
- Migration contract and evidence: `docs/parity-research-snacks-astro.md`. Baseline source: commit `9af527d`; all existing output paths must remain valid. Keep source entry files and their downloadable assets unchanged during framework work.
