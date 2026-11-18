---
title: Research Snacks Astro migration parity inventory
date: 2026-11-18
source: scripts/build-site.py and scripts/test-build-site.py at 9af527d
purpose: Preserve the existing publishing contract while adding RSS and house controls
reader: Site maintainers checking the migration and future builds
---

# Baseline inventory

The baseline is the Python build at `9af527d`, captured before implementation in ignored `.check/old-site/`. The four entry Markdown files, About source and all entry assets remain canonical. This is an implementation and verification record, not a research revision.

| Existing contract | Verification planned | Result |
|---|---|---|
| Required frontmatter; folder/id match; date/id shape; list fields; references mapping; HTTP claim source; useful build failures | Positive build and negative fixtures | PASS — `bun test`: positive parsing plus invalid id/title/date/tools/claim-source fixtures; build validates all four entries. |
| Privacy scans every recognised text extension recursively under entries, plus About: home/absolute paths, emails, hostnames and script URLs | Negative fixtures against new loader; existing Python assertions | PASS — recursive fixture plus all twelve sensitive-pattern probes; all entry/content scans pass. |
| Descending date then id ordering; first About paragraph as home intro; category label capitalisation on cards | Old/new DOM comparison | PASS — `check-parity.ts` compares every home card and intro with baseline. |
| Home cards retain date, title, claim, verdict, time and complete summary; entry facts include claim/source, verdict, time, human time, tools and sources | Old/new DOM comparison | PASS — all home-card and entry-facts text is equal to baseline (ignoring markup whitespace). |
| Markdown tables, fenced code, raw HTML escaped, bare URLs linked; numeric/year/percent/dash cells right-aligned; image click-through/lazy loading | Renderer fixtures and output comparison | PASS — renderer fixture, body text/link/heading comparison and built numeric cells. |
| H2/H3 stable unique anchors; sticky desktop sidebar and mobile details; current section and nested H3 disclosure | Anchor comparison and headless scrolling/mobile checks | PASS — all old anchors retained; headless observer/current group and phone details checks. |
| Exact How this was made split; shaded appendix, introduction, timeline/method/tokens, References/Files/Cite this page | Old/new DOM comparison | PASS — appendix bodies, introduction, references, files and page citation compared on four entries. |
| Formatted references: personal/corporate authors, article/container/volume/issue/pages, publisher/place, notes, DOI preference | Byte comparison of reference DOM | PASS — four references lists retain the same text/links; all four RIS exports are byte-identical. |
| RIS types/repeated authors/all fields/page ranges/corporate names; multiline injection rejected; absent when no references | Port nine legacy regression checks; byte-compare all exports | PASS — six Bun regression tests plus built checks port all nine legacy test contracts; all reference fields/types and injection cases covered. |
| One page citation set and canonical URL; surname-first author; undated home/About; dated entry; no COinS/journal title; copy success/fallback/failure | Built assertions, kit citation checker and browser tests | PASS — all seven pages pass built metadata assertions; static shared checker and copy success/fallback/failure pass. Live checks below. |
| Social metadata, first alphabetic chart as OG/Twitter image, article type, summary fallback | Metadata comparison | PASS — every legacy citation/DC/OG/Twitter pair retained. |
| Vega 5.30.0, Vega-Lite 5.21.0, embed 6.26.0: tooltips, legend, export; CSV/PNG/spec links; PNG if JS/network fails | Headless charts and JS-off fallback | PASS — SVG plots/export actions render on every entry; links retained; JS-off and blocked-CDN PNG fallbacks pass. |
| Inline HTML infographic takes precedence over Vega; sickly table search/corpus/sort/CSV export; PNG stays downloadable | DOM and browser checks | PASS — snippets copied/inlined unchanged; 39 KWIC rows, text search, corpus filter, sort and visible CSV export pass. |
| Files listing: Data and Code headings, sorted filenames and download attributes; copy all other entry files recursively (excluding index.md, caches and .DS_Store) | List/link and byte comparison | PASS — Data/Code names and links compared; 103 entry downloads/RIS byte-identical. |
| Check it yourself link derived from every id; sister sites/parent site; About; licence text | Built link assertions | PASS — all four derived repo links, About/parent/sister/licence links retained. |
| Cream/navy/amber visual design, responsive layout, dark system theme, versioned CSS, copy.js and RIS MIME header | Desktop/phone comparisons, file manifest and release checks | PASS — inspected six old/new page pairs at 1280 and 390 pixels; original palette, shell and layout retained. Text balancing changes a few line breaks; no-JS nested TOC is expanded for findability. |
| Every old output path still exists, including data/code/charts/RIS/style.css/copy.js | Complete file manifest difference and live HTTP checks | PASS — baseline 112 files versus 125 new files: zero removed; 13 additions, detailed below. |

# Additions

RSS 2.0 `/rss.xml` includes complete frontmatter summaries, titles, dates, canonical links and category/tag labels. Every page discovers the feed and links visibly to subscription. Agent routes include `llms.txt`, each page's Markdown counterpart, JSON-LD and a public search index. House controls use unchanged kit copies; they preserve the original article presentation.

# Verification record

Local checks passed on 18 November 2026: `bun run check` (Astro build, TypeScript, six tests/68 assertions, seven-page metadata/link/feed validator), `bun scripts/check-parity.ts` and the complete `bun run check:release` suite. Shared kit copies all report `same` under `src/`; the Python citation kit also remains unchanged. Screenshots are ignored.

## Output manifest difference

The baseline contains 112 files. All 112 exist after the switch. 103 entry assets and RIS exports are byte-identical. Existing HTML, `style.css`, `copy.js` and `_headers` are the nine changed files: HTML adds house/agent/feed controls; CSS uses rem sizing, an explicit theme and accessibility rules; the legacy copy handler changes only its explanatory header; headers add RSS and Markdown MIME types.

There are 13 added files: seven Markdown copies (home, About, search and four entries), `/search/index.html`, `/search-index.json`, `/llms.txt`, `/rss.xml`, and two hashed Astro CSS/JavaScript bundles. Bundle filenames change when source changes. No entry Markdown, About source, data, code, chart or RIS content changed. `docs/urls-research-snacks-baseline.txt` records every baseline output path; `_headers` is a hosting control file rather than a public URL.

## Release checklist

| Check | Result |
|---|---|
| JS off | PASS: all six original pages, content, images and local links; search page also contains a static complete page list. |
| Keyboard | PASS: native modal search/keys dialogs, Tab never enters background controls (browser chrome can receive focus), Esc and focus return; off switch disables `/`, `?`, `m`, while Ctrl+K works. |
| Reduced motion | PASS: computed scrolling is automatic and dialog animation is none. |
| 200% text | PASS: body doubles from 16 to 32 CSS pixels on six routes, at desktop and phone widths, without page overflow. Wide tables remain locally scrollable. |
| Dark/forced colours | PASS: screenshots captured and inspected; explicit light overrides dark system. |
| Storage blocked | PASS: throwing localStorage does not break theme, shortcuts off switch or search. |
| Kit drift | PASS: unchanged TypeScript/CSS/Python kit modules. Root check rerun after temporary baseline cleanup. |
| Citations | PASS: built home/About/entry static shared checker; live shared checker recorded below. |
| Charts/KWIC/copy | PASS: every Vega plot and export control; 39-row KWIC search/filter/sort/export; API/fallback/failure copy states. |
| RSS | PASS: well-formed RSS 2.0, required channel/item fields, canonical self link, unique permanent GUIDs, UTC RFC 822 dates, complete summaries, ordered dates and category labels. |

## House elements

Elements 1–13 and 16 are met, including list URL state and browser Back/Forward, visible routes to search/keys/theme/feed, print rules, focus rings, optional storage and safe DOM construction. Elements 14 (archive) and 15 (book reader) are not applicable. Entry HTML snippets are reviewed authored code, as in the original workflow; their scripts remain intact for the KWIC controls. Markdown raw HTML stays escaped; fetched search data is rendered as text/DOM nodes.

## Security and stack

The dlnet stack is retained (Astro + bun, micromark/GFM and unchanged kit). The reference's Astro 7.3.3 pin and initial YAML 2.8.1 pin had known advisories, so compatible patched versions Astro 7.4.8 and YAML 2.8.3 are used. The seven-day dependency age policy passed. The final security harvest has zero critical/medium/low findings and two high picomatch build-time ReDoS findings (2.3.2 and 4.0.7, GHSA-fc5q-39xc-vjpf); no patched release exists as of this run. Picomatch is used by build tooling over repository-controlled paths, and no Node server or package dependency tree is deployed. These findings remain recorded, rather than suppressed.

## Preview and production

Preview deployment, final visual inspection and live URL results will be recorded below before completion.
