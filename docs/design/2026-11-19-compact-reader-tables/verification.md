---
title: Complete table flow and content-width verification
register: FOR AGENTS
date: 2026-11-19
updated: 2026-11-20
status: checks passed; prepared review held for coordinator inspection
provenance: All article tables at 950, 1440 and 390px; no-JS article and figures routes; live/source comparisons and current preview pictures.
---

# Outcome

[Current preview](https://e20a8c89.research-snacks.pages.dev/). Every article and figures table now has all rows in normal page flow. All table height caps and inner vertical scrolling have been removed. The seven hawks examples, sixteen episodes and twenty historical-stage rows are visible in the new full-table captures. Full view alone may scroll vertically. Table headers are static in the article and gallery, since horizontal scroll frames cannot make them stick to the page; Full view retains its own sticky header.

Native auto layout sizes date/value and short-label columns to their word or value minima, leaving prose the remaining room. Cell padding is 5px vertically and 4px horizontally, with 16px text and 1.35 line-height. A slash between words gains a wrapping opportunity without changing any source text. A small progressive enhancement moves only measured unused text-line space to columns with four-plus-line cells; its responsive proportions are recalculated from content on resize, font readiness and column/full-view changes. No column uses a hand-set pixel width, equal share or fixed table layout. JavaScript-off tables remain complete native tables.

The cream palette, site header, reading font, article structure, sidebar, search, home feed and prose measure remain. Prose is 34rem, approximately 60–72 characters at the live 16px size, with 1.55 line-height. No source findings, cells, links or research data changed. No sub-agents or other models were used. Nothing was merged or deployed to production.

# Width and vertical-flow audit

All 85 article tables were checked at 950, 1440 and 390px: 255 table-width comparisons. There are no vertically clipped table frames. All 66 JavaScript-off article/figures route-width combinations also have no vertical table clipping. The headless release checks additionally cover the actual overflow hints and compact controls after resizing.

At 950px the hawks passage column uses 2, 3, 2, 2, 3, 3 and 2 lines. At 1440px it uses 2, 3, 2, 2, 2, 2 and 2. The date column accommodates its longest full date, and the passage column has the greatest width.

**Remaining tables with four-plus-line cells and reusable width elsewhere: none found.** The scan flags at least 8px of reusable width, measured across every cell in the prospective donor column. Before refinement six table/width combinations met this condition; afterwards none do. The largest residual slack in any desktop table with a four-plus-line cell is 7.24px. The full per-column widths, text-line counts and spare-space readings are in column-audit.json.

Some long cells still need four or more lines. In the hawks examples, some Source cells use four lines and Judgement cells use up to five: their longest complete words set the narrow-column minima, while the passage already uses its space. Blank space beside one short date is not transferable because another row contains the longest date. The twenty-stage table also has long evidence descriptions. All such text remains intact and every row remains on the page.

# Sideways scrolling

Only the seven-column concordance on [Can a cake be sickly?](https://e20a8c89.research-snacks.pages.dev/2026-11-17-can-a-cake-be-sickly/#figure-2) still scrolls at 950px and 1440px: approximately 929px of minimum content inside 648px and 704px frames. Long unbroken source classification identifiers plus the other columns cause this. Headers, prose and slash boundaries wrap. No other desktop table scrolls sideways; phone tables can still need horizontal scrolling.

# Page heights — information

Every table row is now included in normal document height. There are no bounded table frames whose extra vertical travel is omitted. The live column remains wider at 950px because live collapses its sidebar; this preview retains it.

| Page | Width | Live px | Preview px | Change |
| --- | ---: | ---: | ---: | ---: |
| Home | 950 | 4,493 | 2,665 | -1,828 |
| Revolution speed | 950 | 10,288 | 12,330 | +2,042 |
| Hawks and doves | 950 | 9,076 | 10,573 | +1,497 |
| Decipherment | 950 | 25,615 | 31,126 | +5,511 |
| Home | 1440 | 4,136 | 2,557 | -1,579 |
| Revolution speed | 1440 | 11,544 | 12,222 | +678 |
| Hawks and doves | 1440 | 9,707 | 10,465 | +758 |
| Decipherment | 1440 | 28,963 | 29,827 | +864 |
| Home | 390 | 8,271 | 3,518 | -4,753 |
| Revolution speed | 390 | 18,972 | 18,573 | -399 |
| Hawks and doves | 390 | 15,291 | 15,630 | +339 |
| Decipherment | 390 | 54,264 | 56,694 | +2,430 |

# Row density — information

417 of 1,782 row-width comparisons are taller by more than 1px: 225 at 950px, 80 at 1440px and 112 at 390px. These are information; the page-height ceiling remains withdrawn.

The required 16px table type replaces 14px in live general tables. Complete words and headers wrap, while atomic values stay intact. Vertical padding remains 5px; there are no filler rows or fixed row heights. The single-line body row remains approximately 32.6px versus 32.7px live. Complete differences and causes are in row-density.json.

# Checks and evidence

- bun run check passed: 48 pages, TypeScript, 11 tests and 327 assertions, privacy, citations, RIS, metadata, links, anchors and RSS.
- The full headless release suite passed locally and on this immutable preview: no-JS content, sorting/filtering/reset/columns/full view, CSVs and concordance export, search/category, Contents jumps/markers, dark and forced colours, 200% text, blocked storage, citation copy and chart fallback.
- New release assertions check every article table for vertical clipping after resize, all seven source rows and two-to-three-line passage cells at 950px. The independent layout scan covers the no-JS article and figures routes too.
- Full-table pictures at 950 and 1440px include all seven examples, sixteen episodes and twenty historical stages; their last row is inside the captured viewport. Other affected table pictures and walkthrough states were replaced in the same prepared review, with the decision block retained and owner review still held.
- All original Markdown cells, links and source order remain exact; the added wrapping opportunities contribute no characters. Tables and their controls remain 16px. The count shading and shared match colour remain unchanged.

# Limits

No physical phone, screen reader, real Zotero save or independent model review was run. External source article content was not rechecked; the previous OUP challenge remains a source-check limitation. Original chart presentation remains as live. Small font-metric differences between browsers can change line breaks.
