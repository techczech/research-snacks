---
title: Research Snacks front-page design review
date: 2026-11-21
register: FOR DOMINIK
status: Awaiting design choice; no implementation or deployment
---

Two static prototypes compare a latest-first list with subject filters (A) and a page grouped by subject (B). Both retain the cream publication and compact type. All ten entries' original metadata is archived in research/front-page/inventory-frontmatter.json. The entry source files and production front-page component are unchanged.

Read journeys.md for the audience, the three live journeys, the page contract, grouping decisions and implementation boundaries. The interactive walkthrough covers arrival, latest work, subscription, subject choice and the unchanged entry-page boundary. It is a proposed journey, not a locked design or observed user study.

## Source and rebuild

copy-front-page.md is the canonical editable discovery copy. front-page-options.css owns prototype-only layout. build-front-page-options.ts compiles two self-contained HTML mockups using the existing site CSS and live entry dates and URLs.

```sh
bun docs/design/2026-11-21-front-page/build-front-page-options.ts
```

copy-front-page-walkthrough.md is the canonical contract and drawing text for the optional walkthrough. Rebuild its intermediate contracts/drawings and the HTML with:

```sh
bun docs/design/2026-11-21-front-page/build-front-page-walkthrough.ts
python3 <ux-journeys-skill>/scripts/build-screen-walkthrough.py docs/design/2026-11-21-front-page/contracts-front-page.json docs/design/2026-11-21-front-page/drawings docs/design/2026-11-21-front-page/walkthrough-front-page.html
```

The only screenshot files retained are the review evidence in the DTC record's image folder. capture-front-page.ts takes that directory as its first argument and uses Playwright chrome-headless-shell, never the desktop browser. It records measurements and checks in verification-front-page.json. Measurements cover all ten entries, 950/1440/390 CSS px, no page overflow, 200% text, subject counts, navigation and JavaScript off. The no-JavaScript variant of A exposes grouped fallback sections instead of its chronological enhanced list.

## Independent scoring

The frozen packet is packet-front-page-scoring.md. Two fresh same-model judges looked at the actual screenshots in different orders, without seeing a recommendation. P is the live page, Q is A and R is B. They scored purpose/comprehension, scanning/topic choice and returning for new work on equal 1–10 scales.

| Page | Purpose | Choose | Return | Overall mean | Seat range |
| --- | ---: | ---: | ---: | ---: | --- |
| Current | 6 | 5 | 8 | 6.3 | 6.33–6.33 |
| A: latest checks | 9 | 9 | 9 | 9.0 | 9–9 |
| B: subject sections | 9 | 8 | 7 | 8.0 | 8–8 |

There was no scoring disagreement. Both judges found that B delays the first full finding on a phone and its three latest links do not cover all six entries on the newest date. A's RSS line takes a separate phone row; the chosen build should tighten that row. This is a small, reversible choice scored once, without a hill-climbing loop. Same-model agreement is weaker evidence than cross-family review. Scores do not replace the owner's choice.

My recommendation is A. It keeps one newest-first route for returning readers and adds the subjects that the current content supports. It also makes questions and findings easier to compare at 950px. Both options have an estimated half-day implementation and verification cost; this is a planning estimate, not measured work time.

## Verification limits

The prototypes link to the public search page rather than rebuilding the existing dialog. Search-dialog and theme integration, screen-reader interpretation, live RSS-reader behaviour and a real phone were not tested on these mockups. Full shell and release checks belong to the chosen implementation. No production source, canonical entry wording, entry contents sidebar or permalink has been changed. No preview or production deployment has been made.

The choice authorises building A or B on this branch and deploying a feature preview. Publication remains a separate decision after that preview.
