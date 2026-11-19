---
title: Compact tables and the existing reading journeys
register: FOR AGENTS
date: 2026-11-19
status: implementation from the owner’s replacement brief; coordinator review first
provenance: Owner rejection and replacement parcel; live page measurements; Online Reader Framework table surface.
---

# Purpose and boundaries

Help a reader check a public claim, compare its evidence and trace a number to its source. The audience is the existing publication reader. Preserve the live cream palette, fonts, header, article structure, appendix, source wording and sidebar. Nothing is published to production. This parcel replaces the rejected design; its prescribed direction supplies the design boundary rather than an invitation to another visual round.

# Current screen audit

The live article has a working left outline, current-section marker, facts, source links, citation, data, RSS and Markdown. Keep these. At 950px its 960px breakpoint hides the outline; lower that breakpoint to 760px. The live home stacks a hero, inline filters and boxed long summaries; a compact single-column feed and header search replace those. Live tables retain exact cells but have no general sort/filter/full-view tools and can break words.

# Journeys and screen contracts

| Journey and viewer | Arrives knowing / expects | Sees and is told | Does | Observable right-when |
| --- | --- | --- | --- | --- |
| One-minute reader, arriving at a shared hawks-and-doves link | The claim, not the method | Existing title, claim and verdict; the sidebar at 950px; phone Contents after facts | Reads verdict, then chooses a section | Verdict is present before narrative; outline remains available at 950px and collapses only below 760px |
| Sceptic, checking 48.4% in revolution-speed | Needs the source behind the number | Adjacent label and percentage; authored source paragraph and links | Reads row, follows Tufekci and Wilson source link | Source anchor/URL opens from the same evidence section; complete table CSV remains available |
| Comparing reader, using the decipherment corpus table | Needs to compare dated records | Compact source table, sortable headers, Filter rows, count, Source order | Sorts a numeric/date/text column, filters Linear A, clears and resets | Ascending/descending/source cycle is exposed by aria-sort; filtered rows retain complete cells and visible match marks |
| Figures reader, avoiding narrative | Knows the snack title | Figures and tables link in meta and sidebar; standalone index with chart/table kind | Opens visuals, downloads CSV, follows back link | Every main table/chart is reachable, source notes retained, back link names its exact article anchor; Markdown works without JS |
| Topic reader, arriving on home | Wants one topic, not all experiments | One header with Search; compact feed; category counts and RSS | Opens search by button or slash/Ctrl-K; selects result; alternatively follows category | Search covers title/claim/verdict/tag/body; keyboard selection navigates; category link works without JS |
| Returning reader in a long snack | Knows a target section | Sticky left outline at 950px, current marker; phone disclosure after facts | Jumps to corpus, then methods, then back | Anchor jumps immediately, marker follows, no page overflow; phone disclosure closes after selection |

Each journey is walked on real pages at 950px and 390px. One header bar plus the local table toolbar is the maximum chrome before content. Empty table search, reset, hidden columns, full view/Escape and unavailable JS are explicit states in the interactive walkthrough. Build observations and page heights are recorded alongside it after implementation.

# Density decisions

Tables use 16px type, 1.35 line height and 5px vertical padding, approximately the live single-line row height. Natural-width tables keep numbers next to labels. Long tables have their own bounded scroll surface and full view, so evidence remains complete without lengthening the page. This follows the reference reader table rather than increasing row padding. All transforms are reversible local views; source cells, Markdown and downloaded source CSV remain in source order. Merged cells disable row transforms.
