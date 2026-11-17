# Research Snacks

Small research experiments with AI agents: how fast can a claim be checked? Each entry takes a public claim, checks it against public data with an AI agent, and records the verdict, the time taken and how long a person would have needed. Published at https://researchsnacks.semanticmachines.fyi. Sister site: [Model Data Points](https://datapoints.semanticmachines.fyi).

## Add an entry

1. Create `entries/YYYY-MM-DD-short-slug/index.md`: YAML frontmatter plus a Markdown body. The folder name is the id and the URL.
2. Required frontmatter: `id` (equal to the folder name), `title`, `date`, `claim`, `claim_source` (URL), `verdict`, `time_taken`, `human_time`, `tools` (list), `data_sources` (list), `summary`.
   Optional: `author` (default Dominik Lukeš) and `references`, a list of mappings with `type` (article, report, dataset, webpage, video, post), `authors`, `title`, `year` or `date`, and where they apply `container`, `volume`, `issue`, `pages`, `publisher`, `place`, `doi`, `url`, `note`, `corporate: true` for an organisation as author. Every page carries `citation_*` and Dublin Core metadata so reference managers save the page as one web page item. Entries include a copyable "Cite this page" block; references remain formatted text with a separate `references.ris` download for importing the reference list.
5. End the body with a "Models, tools and tokens" table. `python3 scripts/session-usage.py <session.jsonl>` prints calls and tokens by model for a Claude Code session and its subagents.
3. Put assets beside it: `charts/` (PNG; the first, alphabetically, is the social-media image), `data/` (CSV), `code/` (scripts). Link them from the body with relative paths such as `charts/1-example.png`.
4. Build. It fails with a clear message on a missing field, an id that differs from the folder name, or private material (local paths, email addresses, hostnames).

## Build

Needs [uv](https://docs.astral.sh/uv/):

```sh
uv run scripts/build-site.py
```

Run the citation, RIS and privacy regression checks with `uv run scripts/test-build-site.py`.

Writes the static site to `site/` (git-ignored); the intro text comes from `content/about.md`. Preview with `python3 -m http.server -d site`.

## Deploy

`scripts/deploy.sh` builds and publishes `site/` to the Cloudflare Pages project `research-snacks` with wrangler.

## Licence

Content: CC BY 4.0. Code: MIT. See [LICENSE](LICENSE).
