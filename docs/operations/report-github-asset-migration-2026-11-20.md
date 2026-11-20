---
title: Research Snacks GitHub asset migration
date: 2026-11-20
status: live-and-verified
provenance: Coordinator classification instructions, existing source licences, file hashes and numerical/site checks
---

# GitHub asset migration

Research data and code are mapped to GitHub blob pages. Entry folders contain only Markdown and rendering assets. Nine previously missing research files have been added to the checking repository; four text-bearing files are withheld and thirteen run records or working notes are removed. The earlier blocked-inventory report records the preceding state.

## Classification of the 26 missing files

Class 1 is research code or derived/provenance data, class 2 is text withheld under the source/licensing policy, and class 3 is a run record or working note.

| Entry | File | Class | Action and reason |
| --- | --- | ---: | --- |
| one-in-270-jobs | `code/charts.py` | 1 | Added to GitHub; site copy removed. Original renderer for the jobs figures; analysis output code. |
| one-in-270-jobs | `code/extract.py` | 1 | Added to GitHub; site copy removed. Original IPUMS extract request code; no microdata or credentials included. |
| one-in-270-jobs | `code/extract2.py` | 1 | Added to GitHub; site copy removed. Original second IPUMS extract request code; no microdata or credentials included. |
| ai-wealth-control-2035 | `data/claim-source.md` | 2 | Withheld from GitHub and removed from site. Quotes third-party social-post text and an author reply; no redistribution permission recorded in the applicable source register. |
| ai-wealth-control-2035 | `data/source-manifest.json` | 1 | Added to GitHub; site copy removed. Primary-source URLs, retrieval statuses and checksums; source provenance without source documents. |
| ai-wealth-control-2035 | `data/usage-snapshot.json` | 3 | Removed from site; not added to GitHub. Run token and timing snapshot, not numerical research input. |
| ai-wealth-control-2035 | `code/usage.py` | 3 | Removed from site; not added to GitHub. Usage exporter used only for the token table. |
| can-a-cake-be-sickly | `data/20261007-160001-food-constructions.md` | 3 | Removed from site; not added to GitHub. Dated working note from the earlier study. |
| can-a-cake-be-sickly | `data/20261007-160002-collocation-measures.md` | 3 | Removed from site; not added to GitHub. Dated working note from the earlier study. |
| can-a-cake-be-sickly | `data/20261007-160003-american-sparsity-and-tags.md` | 3 | Removed from site; not added to GitHub. Dated working note from the earlier study. |
| can-a-cake-be-sickly | `data/_REPORT-sickly-inanimate-predication.md` | 3 | Removed from site; not added to GitHub. Earlier report draft, also containing withheld corpus contexts. |
| can-a-cake-be-sickly | `data/analysis-bnc-sickly-food-constructions.csv` | 2 | Withheld from GitHub and removed from site. Contains extensive BNC left/right contexts; the existing source register explicitly withholds BNC text extracts. |
| can-a-cake-be-sickly | `data/kwic.json` | 2 | Withheld from GitHub and removed from site. Contains BNC, OANC and historical web concordance lines; existing sharing decision withholds all contexts. |
| can-a-cake-be-sickly | `data/original-sickly-evidence.md` | 3 | Removed from site; not added to GitHub. Earlier evidence working note, also containing corpus quotations; stand-off evidence is already preserved separately. |
| can-a-cake-be-sickly | `data/original-sickly-method.md` | 3 | Removed from site; not added to GitHub. Earlier report packaging/method working note; the checking repository has the current METHOD.md. |
| can-a-cake-be-sickly | `data/original-sickly-report.html` | 3 | Removed from site; not added to GitHub. Earlier complete HTML report with corpus contexts; not a numerical rerun input. |
| can-a-cake-be-sickly | `data/repackaging-usage-sickly.json` | 3 | Removed from site; not added to GitHub. Repackaging run usage and timing record. |
| can-a-cake-be-sickly | `data/sickly-kwic.csv` | 2 | Withheld from GitHub and removed from site. Exports complete concordance lines; BNC/web redistribution permission is not established and contexts are withheld. |
| can-a-cake-be-sickly | `data/source-manifest-sickly.json` | 1 | Added to GitHub; site copy removed. Checksums and sizes identifying study artifacts; records provenance without reproducing withheld text. |
| can-a-cake-be-sickly | `data/word-sketch.json` | 1 | Added to GitHub; site copy removed. Only word-level collocate/count/score triples: 156 aggregate rows, no example sentences or source passages. |
| can-a-cake-be-sickly | `code/build-sickly-figures.py` | 1 | Added to GitHub; site copy removed. Figure renderer; adapt to existing shareable stand-off annotations and locators instead of withheld contexts. |
| can-a-cake-be-sickly | `code/session-usage-codex.py` | 3 | Removed from site; not added to GitHub. Run usage exporter used only for the token table. |
| pace-of-change-1900-2026 | `code/extract.py` | 1 | Added to GitHub; site copy removed. Original IPUMS extract request code; no microdata or credentials included. |
| ai-capex-historical-booms | `data/usage-ai-capex.json` | 3 | Removed from site; not added to GitHub. Run token and timing record, not numerical research input. |
| ai-capex-historical-booms | `code/session-usage-codex.py` | 3 | Removed from site; not added to GitHub. Run usage exporter used only for the token table. |
| literally-pet-peeve-redo | `code/make-charts.py` | 1 | Added to GitHub; site copy removed. Renders the literally snack from already checked expected CSV tables. |

## Source decisions and display changes

The cake snack has no separate DATA-SOURCES.md. Its README explicitly applies the repository-wide [source register](https://github.com/techczech/research-snacks-data/blob/main/DATA-SOURCES.md), which withholds BNC concordance text and web-corpus passages. OANC permits redistribution but its contexts were already withheld consistently in this package. The wealth snack also uses that register; no permission to redistribute the quoted social-post source note is recorded. No new permission was inferred.

The files withheld as class 2 are:

- `2026-11-17-ai-wealth-control-2035/data/claim-source.md`.
- `2026-11-17-can-a-cake-be-sickly/data/analysis-bnc-sickly-food-constructions.csv`.
- `2026-11-17-can-a-cake-be-sickly/data/kwic.json`.
- `2026-11-17-can-a-cake-be-sickly/data/sickly-kwic.csv`.

Redistribution permission remains unestablished for the social-post text in claim-source.md and the historical web contexts mixed into kwic.json and sickly-kwic.csv. The BNC construction CSV is withheld under the explicit existing BNC policy. No unsettled text file was published.

The cake page formerly repeated concordance text in four chart assets (HTML, CSV, Vega-Lite spec and PNG). Those assets now display the existing 39 stand-off locator records, without source passages, source titles or source web URLs. Brief narrative corpus quotations were replaced by the same findings stated without quoting those passages. The page explains withholding and links to licensed reconstruction instructions. The first construction-count chart is unchanged. All 72 authored Markdown tables retain their original cells and numbers; timing and token figures are unchanged.

`word-sketch.json` has only 156 word/count/score triples, without example sentences, so it is class 1 aggregate data. The sickly source manifest contains artifact names, sizes and hashes; its README explains that this does not mean the earlier reports or corpus text are distributed.

## Mapping and publication

The [classified file inventory](inventory-research-asset-files-2026-11-20.csv) retains all 189 original files, their original site hashes, GitHub targets/hashes and action reasons. There are 172 public mappings: 162 previously identical files, nine added files and the existing GitHub superset of pace-of-change `code/ngrams.py`. The [original link inventory](inventory-research-asset-links-2026-11-20.csv) retains all 500 pre-migration occurrences, annotated with their final disposition.

`src/lib/content.ts` applies one build-time mapping to authored Markdown links, absolute site research URLs, frontmatter/reference URLs, rendered HTML and Files lists. Figures pages inherit the same links; Markdown copies use the same public files. Unknown data/code links fail the build. `scripts/prepare-site.ts` accepts only index.md and charts/ in an entry and copies only rendering assets. The site authoring instructions now describe this split.

[Data commit 2e33acb](https://github.com/techczech/research-snacks-data/commit/2e33acb0c3a357bcefe165466975eebee308abeb) adds the nine files and updates five snack README file lists. No check.py behaviour, expected outputs, release tag or Zenodo record changed. The coordinator retains release ownership.

## Checks

- The unchanged numerical checker passes all 99 expected tables across eleven stored data packages, including the withdrawn pilot, which was deliberately left untouched in the data repository.
- Added Python scripts parse. The adapted stand-off renderer completes from existing shareable inputs. No authenticated extracts or new corpus requests were made.
- Site build, TypeScript, 13 unit tests and generated-page checks pass; all ten site entries have no data/code folders in source or output.
- The headless release suite passes, including all interactive charts, keyboard table tools and search, 39-row locator filtering/sorting/export, phone layouts, no-JavaScript fallback, dark/forced colours and chart-CDN failure.
- Every authored Markdown table was compared cell for cell with the pre-migration source: all 72 are unchanged.
- Every generated HTML and Markdown link is checked for a removed site data/code target; none remains.

All 175 distinct GitHub blob URLs found in the generated HTML, Markdown, RIS and JSON returned HTTP 200. This includes every one of the 172 mapped research-file URLs and three additional method/guide links. Live verification confirms all 189 retired data/code URLs return the expected 302: 172 go to their GitHub files and 17 withheld/working artifacts go home. Routing uses 88 rules, within the observed 100-rule deployment limit. These redirects also prevent stale removed Markdown files from being served from the custom-domain cache.

## Production receipt

[Production deployment](https://5cfb6522.research-snacks.pages.dev) was built from a fresh, clean clone of remote main at [site source 3bf2928](https://github.com/techczech/research-snacks/commit/3bf2928f0702114ecc3a53669e0e8385397feff3). Build, type, unit, generated-site and headless release checks passed in that clone. All production and integration clones were removed after verification.

All 98 live HTML, Markdown and RIS routes match the checked build. Home, all ten snacks, decipherment figures, RSS, search index, llms and sitemap return 200. The four replacement locator assets match their local files byte for byte. All 189 retired file URLs redirect as mapped. The pilot root and six representative descendants remain 302 to home; 92 generated live routes exclude it, and home/search/RSS each list ten entries. The rejected redesign remains unmerged.

[Machine-readable verification receipt](verification-github-assets-2026-11-20.json) records route hashes, all 175 GitHub URL statuses and all 189 redirect targets. No data release was tagged or sent to Zenodo.
