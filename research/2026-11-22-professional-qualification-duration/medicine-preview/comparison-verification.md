---
title: Shared-axis medicine comparison — verification record
date: 2026-11-22
status: source-preserving revision verified for preview; deployment pending
provenance: Author feedback, unchanged source-coded route data, actual browser geometry and interaction checks
---

# Revision scope

Two views replace repeated per-country axes and long per-row stage lists. Training stages and Milestones use the same three clocks, route origins and marker shapes. First registration, general licence and family-training completion remain distinct. The source-coded route JSON and all three expected CSVs are unchanged from the source-reviewed first snack preview.

The display annotation file supplies explicit short labels, permission summaries, source short names and selected milestone IDs. These are original display judgements over the already coded source meanings, not new source evidence or a claim of equal practice rights. Japan's two-year clinical-training duty and local credential conditions remain visible in the details and full table.

# Checks run

The targeted headless check exercises 390, 728, 1024 and 1400 pixel widths, both views and all three clocks. It checks every plotted point against the same physical origin and scale, verifies one shared axis, and asserts that hidden family bars have no remaining family marker. It also checks mouse hover, keyboard focus/Enter/Space/Tab/Escape/close/focus-return, real touch input, source links, full-record navigation, popup fit in the host viewport, sticky header on both chart and parent scrolling, export and no-JavaScript access to all 55 rows and 32 source records. A native-popover absence probe exercises the inline fixed-panel fallback. No console errors or document/chart horizontal overflow were found.

Light and dark bar-label contrast is calculated from actual computed colours and must meet 4.5:1. Four data colours are used, with neutral patterned school segments. Marker shape and visible text distinguish categories independently of colour. Dark bar colours also exceed 3:1 against the dark chart surface (3.09–3.68:1). White label contrast is 4.75–5.65:1 for the dark palette. A permission or year is never available only through hover.

Host code relays bounded viewport geometry and theme to the opaque-origin iframe. Source identity checks remain in the height-message handler; the child verifies the sender is its parent. No parent-DOM access, allow-same-origin permission, extra service or dependency is introduced. The relay permits a sticky axis and visible popovers inside the auto-sized tool frame.

# Retained access and limits

The shared chart uses an explicitly scrollable region so the axis stays visible. Full records and sources are combined in one native details element; no-JavaScript readers can expand it. Examinations, embedded practical years and the optional Japanese facility-manager experience remain in that full table rather than extra competing main tracks. Three-clock CSV export and the EU/GP-report/WHO context remain unchanged. The page still maps requirements, not typical completion or competence effects.

The independent screenshot review and final commit, fresh-clone, release-suite and deployed-preview receipts are added after completion. Production remains unauthorised.


## Independent review correction

The first independent screenshot review found R1: synthetic school detail construction incorrectly used the whole school history on the Age 18 clock and had no full-record target. The renderer now resolves school segments using the selected clock and supplies six school-baseline rows alongside the unchanged 55 professional-stage rows. Regression checks open Bavaria Age 18 (0–1) and California primary entry (0–12), follow each full-record action and assert the target receives focus. The six full route-note/evidence-context records remain available inside the same collapsed record area. The review's phone scrolling concern is addressed by an explicit chart-scroll cue. The milestone view also removes the irrelevant bar-colour key.

`bun run check` passed with 19 tests and 1,049 assertions. The full release suite passed all sixteen check groups. The visual gate passed at laptop and phone sizes: smallest visible text 18px; longest measured reading lines 69 and 43 characters, respectively; no sideways document scroll. The old desktop tool measured 109 characters per line. Both view captures and touch/light/dark popovers were independently inspected. A fresh data-clone check passed all three original expected tables and rebuilt the bundle byte-for-byte; final revision/hash follow after the recheck.


## Final recheck and package

A fresh independent recheck resolved R1 with no new material issue. It independently exercised Bavaria Age 18 and all six primary-entry school segments, confirmed valid focused source-bearing records, inspected all ten chart/popover captures and the visual-gate first screens, and checked sticky geometry at both ends of both views. It confirmed all six jurisdictions are visible together in the desktop milestone plot. The finding/recheck are preserved separately; neither is a new legal audit.

Data package revision: `3835c7fc9e7005110f9f22ad1eb879aa5dfaa11e`. Fresh-clone expected-table check passes and the portable build exactly matches the bundled tool, SHA-256 `ab66b5372fbd3f2da2de66a30e748453dbd820d84c8391b3e30615df567322c8`. The original route JSON and all three expected CSVs have no diff from the previous source-reviewed package. Display annotations are the only added interpretation layer. Native-popover fallback, bar-label light/dark contrast, touch/keyboard navigation and no-JavaScript records pass. The final independent recheck is `comparison-visual-recheck.md`.
