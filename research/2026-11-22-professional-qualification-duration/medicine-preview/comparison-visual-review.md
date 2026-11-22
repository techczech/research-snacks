---
title: Independent review of the shared-axis medicine comparison
date: 2026-11-22
register: FOR AGENTS
status: changes-required
reviewer: GPT-6.1 Sol, independent of this revision's implementation
scope: Current phone and desktop captures, rendering/display annotations and one focused headless interaction probe
provenance: Author-requested comparison contract, current screenshots, targeted check log and source-code inspection
---

# Verdict

The new views are substantially clearer than the predecessor: countries share one scale, short labels stay near the plotted points, and the milestone view makes coincident first/general registrations comparable without implying different years. The popover shows a specific stage, clock interval, meaning and short source link, with a clear Close action. **Fix R1 before sending this revision for author review.** No other material visual or meaning error was found in this review scope.

# Material finding

## R1 — School-bar details disagree with the chart and cannot open their full record (P2, Spec)

**Trigger:** select the Age 18 clock and open Bavaria's school bar. The bar's accessible label correctly says **0 to 1 years**, but its popover says **−12–1 years**. Selecting **Full stage record and source passage** then throws `Cannot read properties of null (reading 'focus')` because the target record does not exist.

**Evidence:** a focused headless run against the current self-contained build returned:

```json
{"bar":"Bavaria, Germany · School before university · 0 to 1 years","popover_period":"-12–1 years · Age 18","recordExists":0,"error":"Cannot read properties of null (reading 'focus')"}
```

**Cause and locators, in the checking package:**

- `code/timeline/render.mjs:15` reconstructs every synthetic school stage as all school years before university, regardless of the selected clock.
- `code/timeline/render.mjs:24` constructs the plotted Age 18 school bar differently, using only the remaining year. The two constructions therefore disagree.
- `code/timeline/render.mjs:47` offers a full-record link for the synthetic stage, but `recordsTable` at line 50 includes only the original professional stages.
- `code/timeline/behaviour.js:75` resolves the synthetic ID and calls `row.focus` at line 77 without finding a target.

**Consequence:** a one-year residual school stage appears to be thirteen years in its inspector, and every synthetic school bar has a dead full-record action. The original professional-route coding is unaffected, but the displayed clock interval is wrong.

**Minimum correction:** use the same clock-aware synthetic-school construction for the bar and its inspector. Give school bars a real school-baseline record target inside the expanded records area, or another working full-detail destination with the baseline sources; guard the target lookup. Keep the original 55 professional records distinguishable from school-baseline records. For Bavaria's current G9 adjustment, include the governing additional national source alongside UIS when presenting the school detail.

**Regression checks:** Age 18 Bavaria must show 0–1 in both bar and inspector. All six Primary entry school bars must show 0 to their selected school duration. Every school-bar full-record action must open the matching baseline without a console error and return a reachable source. These cases were absent from the successful targeted log supplied for review.

# What the current captures establish

- At 390 px, the full 0–12 axis fits above the stacked country tracks. The labels sit above each row, rather than occupying half the plot width. At 1400 px, country labels occupy the left column and all bars share the same physical origin and scale.
- The repeated per-row axes and long link lists are gone. Short First, Licence and GP labels are legible next to the shapes. The later family-training bar is visible to California's year-11 diamond in the supplied enabled state.
- In the dot plot, Bavaria's first/general markers are vertically separated at the same x coordinate, as are Japan's. The distinct circle shapes and separate lanes make the coincidence readable.
- The phone Japan initial-training label is abbreviated by available space, but the two-year value remains visible, with the full label supplied through the inspector/table. This is a minor density compromise, not a release blocker.
- The phone touch capture keeps the MD inspector within the visible page width and height. It shows the stage name, 4–8 years, a meaning that does not imply a licence, an AAMC link, a full-record action and a large Close button.
- The light and dark captures retain readable text, distinguishable bar fills, explicit marker shapes and a visible keyboard focus ring. The palette and annotations do not rely solely on colour.
- The display annotations preserve the distinction between a general licence and later GP/family-training completion. California, Japan and Singapore retain explicit conditions; the visible GP marker is explained as training completion in the shared legend. No changed duration or new competence claim was found.

# Predecessor comparison

Also inspected the old/current laptop first-screen captures, old/current phone first-screen captures, and both full-height phone captures from the visual gate. The predecessor uses a new axis for every phone row, detached marker symbols, then many per-row explanatory links. The replacement groups the bars and short point labels into a compact shared-scale region, adds the milestone switch, and keeps the context below. This is a substantial improvement for aligned comparison.

One non-blocking usability consideration remains: the phone comparison region initially shows approximately two and a half routes, with the other routes reachable by scrolling inside the region. The full-page capture does not make that inner scrolling very conspicuous. A compact route count or continuation/scroll affordance could make the remaining countries easier to discover without restoring the old long link lists. This is an observation from the capture, not a tested learner failure or a request to redesign the page.

# Captures actually inspected

All are current confirming captures from the targeted comparison check:

- `routes-390.png`, `routes-bottom-390.png`
- `routes-1400.png`, `routes-bottom-1400.png`
- `milestones-390.png`
- `milestones-1400.png`, `milestones-bottom-1400.png`
- `touch-popover-390.png`
- `light-popover.png`, `dark-popover.png`
- Predecessor/current visual-gate pairs: `old-tools-medicine-training-routes-laptop.png`, `tools-medicine-training-routes-laptop.png`, `old-tools-medicine-training-routes-phone.png`, `tools-medicine-training-routes-phone.png`, and the corresponding old/current `phone-full.png` captures.

The bottom captures are scrolled comparison regions, so the preceding country's label/content can be partly outside the crop; these crops were not treated as evidence that a row had been removed.

# Verification and reading limits

Read the revision contract, the current successful targeted check log, all of `code/timeline/render.mjs` and `behaviour.js`, the visual-annotation file, and the registration/training endpoint notes in the canonical route coding. Ran one additional headless probe of the school-bar Age 18 inspector and its full-record action; it reproduced R1. No visible browser or app was launched, and no implementation was edited.

The supplied log reports four widths, all three clocks, both views, exact marker positions, hidden family markers, hover/keyboard/touch, sticky positioning, CSV export and no-JavaScript access. Those results are the builder's recorded checks, not an independently rerun complete suite. No independent live check was made of every popover, source navigation, screen-reader announcement, forced-colour state or 200% text state. No new legal-source audit, learner-comprehension test or production/noindex deployment verification was performed. A corrected build requires the affected probe and current captures to be checked again before a pass verdict.
