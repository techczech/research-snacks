# Research Snacks

Small research experiments with AI agents: how fast can a claim be checked? Each entry takes a public claim, checks it against public data with an AI agent, and records the verdict, the time taken and how long a person would have needed. Published at https://researchsnacks.semanticmachines.fyi. Sister site: [Model Data Points](https://datapoints.semanticmachines.fyi).

## Check the research

The [research-snacks-data repository](https://github.com/techczech/research-snacks-data) holds shareable inputs, methods, rerunnable code and expected tables. This repo remains the website. The build derives a “Check it yourself” link from every entry id: `snacks/<id>/` in the checking repo. Prepare that folder and pass its clean-clone rerun before publishing a new entry.

## Add an entry

1. Create `entries/YYYY-MM-DD-short-slug/index.md`: YAML frontmatter plus a Markdown body. The folder name is the id and the URL.
2. Required frontmatter: `id` (equal to the folder name), `title`, `date`, `claim`, `claim_source` (URL), `verdict`, `time_taken`, `human_time`, `tools` (list), `data_sources` (list), `summary`.
   Optional: `author` (default Dominik Lukeš) and `references`, a list of mappings with `type` (article, report, dataset, webpage, video, post), `authors`, `title`, `year` or `date`, and where they apply `container`, `volume`, `issue`, `pages`, `publisher`, `place`, `doi`, `url`, `note`, `corporate: true` for an organisation as author. Every page carries `citation_*` and Dublin Core metadata so reference managers save the page as one web page item. Entries include a copyable "Cite this page" block; references remain formatted text with a separate `references.ris` download for importing the reference list.
5. End the body with a "Models, tools and tokens" table. `python3 -I scripts/agent-usage.py [--t3-thread TITLE] [transcript or rollout ...]` prints one row per agent instance (Claude Code sessions and subagents, Codex rollouts and their children) with input, cached, cache-write, reasoning and output tokens; `--json` gives the same rows for the data package's `usage.json`.
3. Put assets beside it: `charts/` (PNG; the first, alphabetically, is the social-media image), `data/` (CSV), `code/` (scripts). Link them from the body with relative paths such as `charts/1-example.png`.
4. Build. It fails with a clear message on a missing field, an id that differs from the folder name, or private material (local paths, email addresses, hostnames).

## Build

Needs [bun](https://bun.sh/). The site uses Astro, with the same stack as dlnet and compatible security patch versions:

```sh
bun install --frozen-lockfile
bun run build
```

Run `bun run check` for the build, TypeScript, citations, RIS, privacy, local links/anchors and RSS checks. Run `bun run check:release` for the headless browser release checks. The old Python build/test paths are compatibility launchers for these commands.

Writes the static site to `site/` (git-ignored); the intro text comes from `content/about.md`. Preview with `python3 -m http.server -d site`.

## Deploy

`scripts/deploy.sh --preview` checks, builds and publishes the current feature branch to a Cloudflare Pages preview. Compare it with the current site before merging. `scripts/deploy.sh --production` (the default) publishes clean `main` to the `research-snacks` project with wrangler. Set `CLOUDFLARE_ACCOUNT_ID=b6ae5bced06492ee6f0c8f92776804da` when several accounts are available.

## Subscribe and search

Subscribe at [researchsnacks.semanticmachines.fyi/rss.xml](https://researchsnacks.semanticmachines.fyi/rss.xml). The RSS 2.0 feed includes each entry's complete summary, title, publication date, canonical link and category/tag labels. The footer and About page link to the feed, and every page supports feed autodiscovery.

Search is available at `/search/`, from the footer, with `/`, or with ⌘K / Ctrl+K. The keyboard sheet (`?`, also in the footer) can disable single-key shortcuts. The site follows the system theme by default and offers System, Light and Dark controls. Content and downloads remain available without JavaScript.

Agents can use `/llms.txt`, `/search-index.json`, JSON-LD and each page's `index.md` counterpart. Human-authored content remains in `entries/<id>/index.md` and `content/about.md`; generated files are not an additional editorial source.

The complete migration inventory, URL comparison and release evidence are in [the parity record](docs/parity-research-snacks-astro.md).

## Licence

Content: CC BY 4.0. Code: MIT. See [LICENSE](LICENSE).


## Update the Roman Numeral Reader

Run `scripts/copy-roman-numeral-reader.sh TOOL-REPOSITORY REVISION` with a reviewed commit.
The script copies the five browser assets into `scripts/assets/tools/roman-numeral-reader/`
and records the revision in `source-commit.txt`. Review the resulting diff, build,
and verify the live iframe and full-page link before deploying another preview.
The checking repository preserves the reader and data used for the preset counts.

## Update the Data sources catalogue

The `/data-sources/` page and snack appendix links use a committed snapshot of
[research-datasets](https://github.com/techczech/research-datasets). Builds use
only the local snapshot, verify its checksums and fail if any catalogue snack
URL does not match an existing entry. The download files preserve the upstream bytes.

After updating `datasets.yaml` and running `uv run build.py` in the catalogue
repo, commit its generated JSON and CSV, then run in this site:

```sh
bun scripts/sync-datasets.ts CATALOGUE_CHECKOUT FULL_COMMIT_SHA
bun run check
```

Review and commit `data/datasets.json`, `data/datasets.csv` and
`data/datasets-source.json` together. The source record pins the commit and
SHA-256 checksums. Omitting the commit re-reads the already pinned revision;
it never silently advances to a newer branch tip. Deploy a feature preview
and review the catalogue before publishing production.
`bun run check:data-sources [PREVIEW_URL]` checks the catalogue headlessly at
390, 950 and 1440 pixels, including no JavaScript and 200% text.

## Update the medicine training timeline

The medicine snack bundles a self-contained tool in
`scripts/assets/tools/medicine-training-routes/index.html`. Its original route
coding, renderer input and portable builder live in the corresponding
[checking package](https://github.com/techczech/research-snacks-data/tree/main/snacks/2026-11-22-medicine-training-routes).
Rebuild from a reviewed data revision with `code/timeline/build.ts`, supplying
the snack data directory and this output path. Record the revision and output
hash in `source-commit.txt`. Keep registration eligibility, clinical training
and family-practice credential endpoints distinct when changing the coding.

Run `bun run check`, `bun scripts/check-medicine.ts` and the normal release
check. The medicine check exercises the sandboxed embedded tool at 390, 728,
1024 and 1400 pixels, both shared-axis views, all three clocks, hover, touch and keyboard details,
consistent marker visibility, CSV download, source records, sticky axis, dynamic
frame height and no-JavaScript access. A feature preview is required before
any publication approval.
