---
title: Targeted independent recheck of the corrected medicine comparison
date: 2026-11-22
register: FOR AGENTS
status: pass
reviewer: GPT-6.1 Sol, independent of this revision's implementation
scope: Prior R1, current phone and desktop captures, and focused school-record and sticky-axis probes
provenance: Current built tool, renderer and behaviour code, actual screenshots and independent headless checks
build_sha256: ab66b5372fbd3f2da2de66a30e748453dbd820d84c8391b3e30615df567322c8
---

# Verdict

**R1 is resolved. No new material issue was found in this targeted scope.** The current shared-axis views are suitable for the next author preview. This is a bounded UI/source-display recheck, not a release authorisation or a new legal-source audit.

# R1 verification

The current `code/timeline/render.mjs:11` takes the selected clock when resolving a synthetic school stage. `code/timeline/behaviour.js:30` passes that clock. The full-record table now adds six distinct school-baseline rows at `render.mjs:54`, while retaining the original 55 professional rows. The full-record handler checks for a target before focusing it at `behaviour.js:77`.

An independent headless probe of the built tool at phone width confirmed:

| Case | Chart / popover period | Full-record result |
|---|---|---|
| Bavaria, Age 18 | 0–1 years in both | Matching school row opens and receives focus. It states 13 total school years, primary entry at 6 and selected leaving age 19, and links both UIS and the Bavarian school-structure source. |
| California, Primary entry | 0–12 years | Matching row receives focus and has a source link. |
| England, Primary entry | 0–13 years | Matching row receives focus and has a source link. |
| Bavaria, Primary entry | 0–13 years | Matching row receives focus and has a source link. |
| Japan, Primary entry | 0–12 years | Matching row receives focus and has a source link. |
| India, Primary entry | 0–12 years | Matching row receives focus and has a source link. |
| Singapore, Primary entry | 0–12 years | Matching row receives focus and has a source link. |

The probe found 55 professional records, six school-baseline records and 32 source-register records. It raised no page error. The earlier `null.focus` failure did not recur.

# Current visual assessment

- The phone training view fits the entire shared 0–12 scale. Country labels sit above the tracks, and point values remain directly visible. Long labels are shortened within narrow segments, but their numeric duration remains visible and the full label remains reachable through details.
- Desktop training rows retain a left label column and common track origin. California's family-training bar visibly reaches its year-11 completion diamond. Japan's initial-training and GP completion points remain separately labelled.
- The desktop milestone capture shows all six jurisdictions in one compact plot. First/general points for Bavaria and Japan share the same x position in separate thin lanes. Shape and text distinguish the points without relying on colour.
- The new explicit instruction to scroll within the chart addresses the previous non-blocking discoverability concern. The current touch capture includes it. The unused bar-colour key is omitted in the milestone mode.
- The phone touch popover remains within the visible host viewport and contains stage name, interval, practice meaning, source link, full-record action and a large Close control. The light/dark captures keep the same content and visible focus treatment.
- Some bottom-only comparison crops partly clip the header because of the capture framing. An additional independent geometry probe in the embedded page checked the top and bottom of both views at 390 and 1400 pixels: the shared axis stayed at the scrolling region's top in every case. The crops are not evidence of a missing or unstuck axis.

# Captures and records actually read

Inspected the ten current targeted captures: `routes-390.png`, `routes-bottom-390.png`, `routes-1400.png`, `routes-bottom-1400.png`, `milestones-390.png`, `milestones-1400.png`, `milestones-bottom-1400.png`, `touch-popover-390.png`, `light-popover.png` and `dark-popover.png`. Also inspected the visual-gate laptop/phone first-screen captures and read its passing report (69 and 43 maximum line characters, respectively). The latest touch capture demonstrates the added scroll wording; the first-screen gate captures establish the layout/readability measurements.

Read the prior findings, revision contract, all current `render.mjs` and `behaviour.js`, the relevant targeted-test assertions and the current successful check log. The builder's log reports four widths, two views, three clocks, exact shared-scale positions, no orphan family markers, hover/keyboard/touch, popup fit, sticky header, download and no-JavaScript access. Those complete-suite results were read, not independently rerun in full.

# Limits

The independent probes covered the previously broken school paths and sticky-axis geometry. They did not rerun every popover, screen-reader announcement, external source navigation, native-popover fallback, forced-colour mode or 200% text case. The screenshot review is not a learner-comprehension test. No production deployment, preview noindex status, source-law currency or complete end-to-end release suite was independently verified here. No implementation, source coding or expected output was edited.
