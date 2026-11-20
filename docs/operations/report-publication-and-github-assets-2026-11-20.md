---
title: Research Snacks publication and GitHub asset inventory
date: 2026-11-20
status: design-and-withdrawal-live; asset-migration-stopped
provenance: Git source, clean production builds, live HTTP checks and public GitHub Git-tree metadata
---

# Publication and asset inventory

The approved compact reading design is live. The metaphor-use pilot is withdrawn. The data/code migration stopped at its required inventory gate: 26 files have no counterpart in the public checking repository, and one script has different contents. No data/code links or folders were changed for this migration.

## Published stages

| Stage | Commit | Deployment | Result |
| --- | --- | --- | --- |
| Approved design | [9ba2b70](https://github.com/techczech/research-snacks/commit/9ba2b70edae69204e2161035f2ec4b0ded0dd9b8) | [Design deployment](https://86ebf0f6.research-snacks.pages.dev) | Published and verified before withdrawal |
| Pilot withdrawal | [48ab8d2](https://github.com/techczech/research-snacks/commit/48ab8d2ff86f5cdd0936d72a1a514ddebade2d85) | [Withdrawal deployment](https://b69bd8d2.research-snacks.pages.dev) | Published and verified before asset inventory |

Each production deployment used a separate, fresh, clean clone of remote main. Both production clones and integration clones were deleted after verification. Build/type/unit/site checks and the headless release suite passed in each production clone. The rejected redesign was not merged. Its remote branch and the merged design remote branch were deleted; the rejected local branch was retained.

The design verification covered home, About, all eleven then-current snacks, decipherment figures, RSS, search and llms: 17 routes returned 200. Sixteen matched the build byte for byte. Cloudflare upgrades one legacy HTTP link on the cake article to HTTPS on the custom domain; that exact transformation accounts for its only difference. The immutable design deployment matched the cake build exactly. The withdrawal build likewise passed 17 route comparisons, including the new sitemap, with the same single edge transformation.

### Withdrawal changes

- Removed the pilot entry and its 36 accompanying chart, data and code files from this site.
- Added 302 redirects for the old path with or without its final slash and every descendant path. Seven live checks covered root, slash, Markdown, figures, data, code and chart URLs; all returned 302 to home.
- Home, search and RSS each contain ten entries. A live scan of 108 generated HTML, Markdown, feed and index routes found no pilot link or listing. The sitemap excludes it.
- Added a generated sitemap; the preceding build had none.
- Other snacks and About had no incoming links to the pilot, so no prose needed changing.
- The analysis home, checking repository and Zenodo were not changed.

## File mapping gate

Compared all 189 data/code files in the ten remaining entries against [checking repository revision 717613c](https://github.com/techczech/research-snacks-data/commit/717613cabaad25d3ad64d6b9f2b1da508a51e8ea). Matching uses Git blob hashes, including a search throughout each snack folder for relocated files. There are 114 byte-identical files at the expected path, 48 byte-identical files elsewhere in the same snack folder (mostly `expected/`), 26 missing files and one differing script.

[Full file mapping and hashes](inventory-research-asset-files-2026-11-20.csv) · [Every discovered link occurrence](inventory-research-asset-links-2026-11-20.csv)

The link inventory records 500 occurrences: 239 HTML links, 233 generated Markdown links and 28 authored Markdown/URL occurrences. All target an inventoried site file. It covers article text, Files lists, references, figures pages, generated Markdown copies and chart JSON dependencies; no chart JSON dependency on data/code was found. These are occurrence counts, including authored/generated representations, not 500 distinct targets.

| Entry | Data files | Code files | Identical, same path | Identical, relocated | Missing | Different |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| [2026-11-16-one-in-270-jobs](https://researchsnacks.semanticmachines.fyi/2026-11-16-one-in-270-jobs/) | 2 | 6 | 5 | 0 | 3 | 0 |
| [2026-11-17-ai-wealth-control-2035](https://researchsnacks.semanticmachines.fyi/2026-11-17-ai-wealth-control-2035/) | 5 | 2 | 3 | 0 | 4 | 0 |
| [2026-11-17-can-a-cake-be-sickly](https://researchsnacks.semanticmachines.fyi/2026-11-17-can-a-cake-be-sickly/) | 15 | 2 | 2 | 0 | 15 | 0 |
| [2026-11-17-pace-of-change-1900-2026](https://researchsnacks.semanticmachines.fyi/2026-11-17-pace-of-change-1900-2026/) | 11 | 11 | 20 | 0 | 1 | 1 |
| [2026-11-19-ai-capex-historical-booms](https://researchsnacks.semanticmachines.fyi/2026-11-19-ai-capex-historical-booms/) | 29 | 3 | 13 | 17 | 2 | 0 |
| [2026-11-19-canals-nuclear-investment-booms](https://researchsnacks.semanticmachines.fyi/2026-11-19-canals-nuclear-investment-booms/) | 27 | 2 | 15 | 14 | 0 | 0 |
| [2026-11-19-decipherment-methods-and-agents](https://researchsnacks.semanticmachines.fyi/2026-11-19-decipherment-methods-and-agents/) | 20 | 3 | 23 | 0 | 0 | 0 |
| [2026-11-19-hawks-and-doves](https://researchsnacks.semanticmachines.fyi/2026-11-19-hawks-and-doves/) | 15 | 3 | 10 | 8 | 0 | 0 |
| [2026-11-19-literally-pet-peeve-redo](https://researchsnacks.semanticmachines.fyi/2026-11-19-literally-pet-peeve-redo/) | 23 | 2 | 15 | 9 | 1 | 0 |
| [2026-11-19-revolution-speed-2011-redo](https://researchsnacks.semanticmachines.fyi/2026-11-19-revolution-speed-2011-redo/) | 5 | 3 | 8 | 0 | 0 | 0 |
| **Total** | **152** | **37** | **114** | **48** | **26** | **1** |

### Missing files

These have neither an exact-path counterpart nor a byte-identical counterpart elsewhere within their snack folder. They were not uploaded.

#### 2026-11-16-one-in-270-jobs

- `code/charts.py`
- `code/extract.py`
- `code/extract2.py`

#### 2026-11-17-ai-wealth-control-2035

- `data/claim-source.md`
- `data/source-manifest.json`
- `data/usage-snapshot.json`
- `code/usage.py`

#### 2026-11-17-can-a-cake-be-sickly

- `data/20261007-160001-food-constructions.md`
- `data/20261007-160002-collocation-measures.md`
- `data/20261007-160003-american-sparsity-and-tags.md`
- `data/_REPORT-sickly-inanimate-predication.md`
- `data/analysis-bnc-sickly-food-constructions.csv`
- `data/kwic.json`
- `data/original-sickly-evidence.md`
- `data/original-sickly-method.md`
- `data/original-sickly-report.html`
- `data/repackaging-usage-sickly.json`
- `data/sickly-kwic.csv`
- `data/source-manifest-sickly.json`
- `data/word-sketch.json`
- `code/build-sickly-figures.py`
- `code/session-usage-codex.py`

#### 2026-11-17-pace-of-change-1900-2026

- `code/extract.py`

#### 2026-11-19-ai-capex-historical-booms

- `data/usage-ai-capex.json`
- `code/session-usage-codex.py`

#### 2026-11-19-literally-pet-peeve-redo

- `code/make-charts.py`

### Different script

[`2026-11-17-pace-of-change-1900-2026/code/ngrams.py`](https://github.com/techczech/research-snacks-data/blob/717613cabaad25d3ad64d6b9f2b1da508a51e8ea/snacks/2026-11-17-pace-of-change-1900-2026/code/ngrams.py) exists in both places, but the GitHub version also saves each Ngram query response to `ngram-responses.jsonl`; the site version returns the fetched response without saving that snapshot. The inventory records both blob hashes. No version was substituted.

## Stopped work and remaining checks

The instruction was: “where a file exists on the site but not in the data repo, list it and stop to report, do not add it yourself.” That gate was reached. Build-level link rewriting, removal of the ten entries’ data/code folders, the entry-authoring instructions update and a third production deployment were not performed. Existing data/code still come from the site; the existing Check it yourself GitHub links remain.

No rewritten-URL 200 check or removed-path link check was run because no links were rewritten and no data/code folders were removed in this stage. Chart interactivity passed in the withdrawal build and remains unchanged. The coordinator needs to resolve the missing files and the script version before migration can resume.
