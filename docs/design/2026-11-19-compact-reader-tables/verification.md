---
title: Compact Research Snacks preview verification
register: FOR AGENTS
date: 2026-11-19
status: functional checks pass; density targets unmet; coordinator inspection first
provenance: Live and preview browser measurements at 950, 1440 and 390px; source-preservation and headless release checks.
---

# Outcome

[Preview](https://2915770a.research-snacks.pages.dev/). Preserve the live cream palette, fonts, masthead, facts and appendix. The sidebar stays visible at 950px and down to 760px. Compact tables add sort/filter/source order, column selection, full view and complete-table CSV; the home feed replaces the hero and inline filters. No entry source or research-data repository changed. The rejected design remains unmerged. No sub-agents or other models were used.

# Page heights

Measured after fonts, images and interactive charts settled, in source order with no table filters. Long tables have a bounded internal scroll surface; all cells remain reachable. Page height measures the document, not the cumulative internal table scroll distance.

| Page | Width | Live px | Preview px | Change |
| --- | ---: | ---: | ---: | ---: |
| Home | 950 | 4,493 | 2,665 | -1,828 |
| Revolution speed | 950 | 10,288 | 12,205 | +1,917 |
| Hawks and doves | 950 | 9,076 | 10,434 | +1,358 |
| Decipherment | 950 | 25,615 | 26,267 | +652 |
| Home | 1440 | 4,136 | 2,557 | -1,579 |
| Revolution speed | 1440 | 11,544 | 12,114 | +570 |
| Hawks and doves | 1440 | 9,707 | 10,343 | +636 |
| Decipherment | 1440 | 28,963 | 25,503 | -3,460 |
| Home | 390 | 8,271 | 3,518 | -4,753 |
| Revolution speed | 390 | 18,972 | 17,072 | -1,900 |
| Hawks and doves | 390 | 15,291 | 13,691 | -1,600 |
| Decipherment | 390 | 54,264 | 41,294 | -12,970 |

Five desktop comparisons exceed live. The narrower prose measure and retained sidebar contribute; this is an observed failure of the requested limit, not an approved trade-off. The home is 38–57% shorter and meets the first-screen target; all three phone articles are shorter.

# Row density

All 85 article tables (84 Markdown tables and the concordance) were compared at all three widths: 255 table-width and 1,782 row-width measurements, including headers. There are 68 taller rows beyond a 1px tolerance: 43 at 950px, 24 at 1440px and one at 390px. Complete examples and their old/new heights are in row-density.json. The strict per-row ceiling is unmet. The coding matrix's checked first rows match or improve on live density and do not contain bars or overlapping labels.

# Functional verification

- bun run check passed: 48 pages, TypeScript, 11 tests with 327 assertions, privacy, citations, RIS, metadata, links, anchors and RSS.
- bun run check:release passed locally and on the deployed preview. All eleven article and figures routes were checked without JavaScript at 950, 1440 and 390px. Tables remain complete, table text is 16px and the page does not overflow horizontally.
- Keyboard events exercised sort ascending/descending/source order, row filtering and recovery, column hiding/restoring, full view and Escape/focus return, search/selection, category navigation and Contents jumps. Numeric/date/currency/year-range comparators have source-value tests. Header states expose aria-sort.
- Exact source cell strings, inline links and order are preserved in all Markdown tables plus the embedded concordance. CSV is generated from the canonical cells, independent of temporary reader filters.
- Light and dark count-cell contrast is at least 4.5:1. Numeric text is tabular and right-aligned. Forced-colours and 200% text, blocked storage, chart-CDN fallback, copy fallback and the existing concordance export passed.
- Real-page journeys were walked at 950px and on a phone viewport. At both widths the methods jump reached #how-this-was-made, its current marker followed, and the phone disclosure closed. The interactive walkthrough contains actual captured states for all six journeys.

# Limits and exceptions

The page-height and row-height limits above remain unmet and block an owner-ready claim. The decipherment time field gives the initial survey start and separate review rounds, without one complete elapsed total; its feed says “timing in article” rather than inventing a short total. Original chart typography and presentation are retained; this parcel does not repeat the rejected chart redesign. The Tufekci/Wilson DOI reaches the OUP article address but the external page presented an automated-browser challenge, so its content was not rechecked. No physical phone, screen reader or actual Zotero connector save was tested. No independent model verdict is claimed; the parcel forbids other models.

# Review boundary

The original rejection is recorded in its agent-owned resolution marker, including all three messages. A new review with paired live/preview pictures, all requested widths and the interactive walkthrough is prepared in DTC and archived pending coordinator inspection. It is not an owner approval request yet. Production is unchanged.


# Final comparator check

The published financial tables use compact currency units. The comparator also recognises bn, mn, tn/trn and the displayed About prefix without changing source strings. In the deployed canals/nuclear table, ascending currency sort placed $3.8bn first and $18.2bn last, exposed aria-sort=ascending and right-aligned the currency column. The source-value unit suite now has 327 assertions. The final comparator correction does not change the height of the four pages in the measurement table; the review pictures retain the same relevant rendering.

The walkthrough is registered in ReportScout and archived pending coordinator inspection. Its contract checks name every commitment, including the explicitly failed height condition. The original rejection resolution, new held review and all captured images remain in the private review record; no private estate paths are stored in this public repository.
