---
title: Compact Research Snacks preview verification
register: FOR AGENTS
date: 2026-11-19
updated: 2026-11-20
status: functional checks pass; prepared review held for coordinator inspection
provenance: Live and preview browser measurements at 950, 1440 and 390px; source-preservation and headless release checks.
---

# Outcome

[Updated preview](https://07add71d.research-snacks.pages.dev/). The live cream palette, fonts, masthead, facts, appendix and sidebar remain. Text and links now wrap normally, all headers wrap, and pure full dates can break before the year if that avoids sideways scrolling. The 16-row episodes and selection tables fit at 950px. Small fitting tables have no tools line; their CSV is on the figures page. Tables with at least eight body rows or actual horizontal overflow retain one compact tools line, with the overflow hint on that line only while needed. Resize updates both controls and hint. The sticky header is opaque in both themes.

The figures page starts with one “Figures and tables” heading, the linked snack title at body size, then the index with “Table 1: …” labels. Table-filter and site-search matches share the same gold background and dark text in both themes. Missing total times are omitted from feed metadata. No entry source or research-data repository changed. No sub-agents or other models were used; nothing was merged or published to production.

# Reading measure and the revised instruction

The owner withdrew the page-height ceiling: “I don't mind longer pages, why is that a target”. Prose remains at 34rem (544 CSS px at the live 16px size), approximately 60–72 characters with line-height 1.55. It was not widened for this preview. Heights and row differences below are information, not pass/fail gates. Component padding remains 5px vertically, with no fixed row heights or empty filler rows.

# Tables still scrolling sideways

All 85 article tables, including the embedded concordance, were inspected at both widths. There is one distinct table:

| Snack and table | Columns | 950px | 1440px | Reason |
| --- | ---: | --- | --- | --- |
| [Can a cake be sickly? — concordance](https://07add71d.research-snacks.pages.dev/2026-11-17-can-a-cake-be-sickly/#figure-2) | 7 | 1,398px table inside 648px frame | 1,398px table inside 704px frame | Long source URLs and classification identifiers plus the other columns exceed the combined unbroken-word minima. Headers and prose already wrap; the former 64rem minimum has been removed. |

No other table scrolls sideways at 950px or 1440px. Wide phone tables remain confined to their own frames. The original source strings and links are preserved; words are not split to conceal overflow. Machine-readable details are in table-overflow.json.

# Page heights — information

Measured after fonts, images and charts settled, in source order without filtering. These are document heights; cumulative scrolling inside bounded table frames is not included.

| Page | Width | Live px | Preview px | Change |
| --- | ---: | ---: | ---: | ---: |
| Home | 950 | 4,493 | 2,665 | -1,828 |
| Revolution speed | 950 | 10,288 | 11,894 | +1,606 |
| Hawks and doves | 950 | 9,076 | 10,353 | +1,277 |
| Decipherment | 950 | 25,615 | 26,075 | +460 |
| Home | 1440 | 4,136 | 2,557 | -1,579 |
| Revolution speed | 1440 | 11,544 | 11,807 | +263 |
| Hawks and doves | 1440 | 9,707 | 10,258 | +551 |
| Decipherment | 1440 | 28,963 | 25,316 | -3,647 |
| Home | 390 | 8,271 | 3,518 | -4,753 |
| Revolution speed | 390 | 18,972 | 17,449 | -1,523 |
| Hawks and doves | 390 | 15,291 | 13,896 | -1,395 |
| Decipherment | 390 | 54,264 | 41,374 | -12,890 |

The home is substantially shorter. Some articles are longer, which is now permitted.

# Row-height differences — information

543 of 1,782 row-width comparisons are taller by more than 1px: 264 at 950px, 137 at 1440px and 142 at 390px. 51 are header rows; the other 492 are body rows.

The differences reflect the required 16px table type (live general tables use 14px), wrapping complete words and headers into the frame beside the retained sidebar, and keeping dates, numbers and short codes intact. They are not added padding: the single-line body row remains approximately 32.6px, compared with approximately 32.7px live. For example, the episodes table's “22 February 1848, banquet protest” changes from one line to two at 950px; the selection headers use two lines and their values remain adjacent to their labels. Full row-by-row measurements, labels, causes and source comparisons are in row-density.json. At this width the live page collapses its sidebar and gives tables a 918px main column; this preview retains a 704px main column beside the sidebar. At 1440px both retain a sidebar.

# Functional verification

- bun run check passed: 48 pages, TypeScript, 11 tests with 327 assertions, privacy, citations, RIS, metadata, links, anchors and RSS.
- The complete headless release suite passed locally and on this immutable preview: no-JS tables/figures, keyboard sort/filter/reset/columns/full view/search, CSVs and concordance export, category links, Contents jumps/markers, dark/forced colours, 200% text, blocked storage, citation copying and chart fallbacks.
- Every table's actual overflow hint and tool-row eligibility were checked after resizing through 950, 1440, 390 and back to 950px. The linked-source examples and both annotated revolution tables have explicit fit assertions.
- Every Markdown table retains its exact cells, links and source order. Count-cell contrast remains at least 4.5:1 in light and dark; both match surfaces use the same gold/dark-text pair at approximately 10.47:1 contrast.
- Real preview pictures were recaptured at 950, 1440 and 390px, including both newly annotated revolution tables. The existing prepared review and its walkthrough were updated and remain held for coordinator inspection. All twelve walkthrough screens load their current desktop/phone pictures, switch state and navigate to the next step without console errors.

# Limits

No physical phone, screen reader, real Zotero connector save or independent model review was performed. The previous source check reached the OUP article address but an automated-browser challenge prevented reading its content; external article content was not rechecked in this round. Original chart presentation remains as live. Page and row measurements describe the tested Chromium layout and can vary slightly with browser font metrics.
