---
title: Medicine timeline preview — editable source and build contract
date: 2026-11-22
status: Author preview, no production publication
provenance: Approved option A restricted to medicine
---

# Build and review

From the Research Snacks repository root:

```sh
bun research/2026-11-22-professional-qualification-duration/medicine-preview/build.ts /path/to/research-snacks-data/snacks/2026-11-22-medicine-training-routes
```

The public data package contains canonical route coding in `routes.md`, source passages, school-baseline CSVs, structured EU duration facts, the separate Commission GP-table transcription and retrieval/reproduction scripts. `preview.md` owns all authored interface and explanatory copy. CSS and behaviour are separate authoring files; `build.ts` packages them and the data into `medicine-timeline.html`, which works from disk without a server or runtime data requests. The generated output is a review artefact, not an entry in the production site.

Pattern contract: adapt the Research and Learning live-model pattern and clickable diagram pattern from `html-effectiveness`, using a chronological route diagram. Preserve a visible overview, three working clock controls, selectable source-linked stages, a nearby explanation of endpoints and a CSV export of the actual records. Stage buttons and endpoint buttons are keyboard accessible. Below 700px each route name sits above its full-width axis and bars; a linked list supplies stage names and durations without horizontal scrolling. Later specialist and role rows are visibly separate; overlapping rows add no time. No new navigation or feedback framework is introduced.

Visual thesis: a restrained editorial timeline, with strong alignment, numbered clocks and a quiet evidence panel. Content sequence: question, clock controls, route comparison, selected source evidence, wider database context, method. Interaction thesis: changing the clock moves the same stages; selecting a stage reveals its evidence; hiding specialties changes visibility without silently changing route arithmetic. Colours distinguish stages, while shapes and text distinguish milestones.

The India source-access limitation is visible before the chart. No author claims, first-person statements or competence ranking are included. Programme assumptions, nominal versus minimum duration, source dates and gaps remain attached to the data. Germany is Bavaria, and the US example is California; neither is represented as the single national route.
