---
title: Final table-balance preview verification
register: FOR AGENTS
date: 2026-11-19
updated: 2026-11-20
status: ready for the owner's publication decision; no production deployment
provenance: All article tables at 950, 1440 and 390px; no-JS article/figures routes; headless release checks and current live/preview pictures.
---

# Outcome

[Final preview](https://aa9779d5.research-snacks.pages.dev/). The runtime spare-width redistribution module and the forced narrow short-column rule are removed. Tables use native auto layout and 0.6rem horizontal padding (9.6px at the base size), with 5px vertical padding. Only pure dates, numbers, percentages, amounts and short codes receive single-line protection. All text and headers wrap. Every row remains in normal page flow, with no inner vertical scrolling except in Full view.

Native layout was inspected first on the hawks examples. It left the longest passage at five lines at 950px, so the authorised fallback is applied to that table: relative column preferences proportional to the square root of the longest source cell's character count. Native auto layout still respects word/date minima. There are no hand-set pixel column widths, equal shares or fixed table layout; no client-side width redistribution remains. Other tables retain native auto layout.

# Remaining wrapping limit

At 950px the hawks Source cells use 2–3 lines, Judgement uses 2–4, and the passage uses 3–5. Three longer passages remain at four or five lines, so the hoped-for two-to-three-line range is not met in every row. This is shown in the owner review; it is not represented as a complete match to that expectation. The longest reprinted Knight passage remains five lines. Source and Judgement are no longer squeezed to their previous narrowest widths. Source text is intact, dates remain protected, and the table fits beside the sidebar.

# Horizontal scrolling and completeness

No table newly needs sideways scrolling after restoring padding. Across all 85 article tables at 950 and 1440px, the only scrolling table remains the seven-column concordance on [Can a cake be sickly?](https://aa9779d5.research-snacks.pages.dev/2026-11-17-can-a-cake-be-sickly/#figure-2). It is approximately 1,007px wide inside 648px and 704px frames; the earlier 4px-padding version was approximately 929px. Long unbroken source identifiers and the seven columns set the minimum width. All other tables, including the examples, episodes, historical stages and selection tables, fit at both desktop widths. Full inventories are in table-overflow.json and column-audit.json.

There is no vertical table clipping in 255 article table/width checks, or the 66 JavaScript-off article/figures route-width combinations. Full captures at 950 and 1440px include every requested row. Article/gallery headers remain static; Full view alone retains internal scrolling and sticky headers.

# Page heights — information

All rows contribute to document height. Prose remains 34rem, approximately 60–72 characters at the live 16px size, with 1.55 line-height. Page height is not an acceptance ceiling.

| Page | Width | Live px | Preview px | Change |
| --- | ---: | ---: | ---: | ---: |
| Home | 950 | 4,493 | 2,665 | -1,828 |
| Revolution speed | 950 | 10,288 | 12,416 | +2,128 |
| Hawks and doves | 950 | 9,076 | 10,595 | +1,519 |
| Decipherment | 950 | 25,615 | 31,817 | +6,202 |
| Home | 1440 | 4,136 | 2,557 | -1,579 |
| Revolution speed | 1440 | 11,544 | 12,265 | +721 |
| Hawks and doves | 1440 | 9,707 | 10,444 | +737 |
| Decipherment | 1440 | 28,963 | 30,345 | +1,382 |
| Home | 390 | 8,271 | 3,518 | -4,753 |
| Revolution speed | 390 | 18,972 | 18,717 | -255 |
| Hawks and doves | 390 | 15,291 | 15,824 | +533 |
| Decipherment | 390 | 54,264 | 58,436 | +4,172 |

# Row differences — information

510 of 1,782 row-width comparisons are taller by more than 1px: 252 at 950px, 108 at 1440px and 150 at 390px. These are informational.

The required table size is 16px; live general tables use 14px. Complete words, balanced widths and restored side padding affect wrapping, while vertical padding stays at 5px. There are no fixed row heights or filler rows. The complete comparison is in row-density.json.

# Checks and hand-back

- bun run check passed: 48 pages, TypeScript, 11 tests and 327 assertions, privacy, citations, RIS, metadata, links, anchors and RSS.
- The full headless release suite passed locally and on this immutable preview: no-JS content, keyboard sort/filter/reset/columns/full view/search, complete CSVs and concordance export, category navigation, Contents jumps/marker, dark and forced colours, 200% text, blocked storage, citation copy and chart fallback.
- Every original Markdown cell, link and source order is preserved. No entry source or research-data repository changed.
- Current captures at 950 and 1440px cover full examples, episodes, historical stages and selection tables. Live/new examples and First source of information pairs were recaptured. Other affected table pictures and walkthrough states were replaced.
- The same DTC record is ready for the owner with three choices: publish this version; keep the preview and change it; keep the live site as it is. The 950px comparisons come first. No production deployment or merge has occurred.

# Limits

The exact two-to-three-line hope remains partly unmet as described above. No physical-phone, screen-reader, real Zotero-save or independent-model review was run. External source article content was not rechecked; the previous OUP challenge remains a source-check limitation. No sub-agents or other models were used. Original chart presentation is retained.
