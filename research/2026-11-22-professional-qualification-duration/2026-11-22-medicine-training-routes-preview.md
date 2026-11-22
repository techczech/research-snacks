---
date: "2026-11-22"
status: "Initial preview receipt; revised preview verified separately"
provenance: "Targeted headless checks and source-coding audit by the building agent"
title: "Medicine training routes — six-place preview"
kind: "visualisation"
created: "2026-11-22T13:30:13Z"
project: "https://github.com/techczech/research-snacks"
prompt: "Compare selected medicine routes from school and age 18, keeping registration and later training separate."
sources:
  - url: "https://ec.europa.eu/growth/tools-databases/regprof/"
  - url: "https://apps.who.int/nhwaportal/"
artefact: "research/2026-11-22-professional-qualification-duration/medicine-preview/medicine-timeline.html"
---

# Checked

The packaged page has six routes, 50 stages and 26 source-register entries. Each stage has explicit start/end months, a duration basis, a source passage reference and source/access dates. The build rejects duplicate stage IDs, invalid periods, incomplete source metadata and overlong excerpts. A separate check rejects unexpected stage fields and asserts continuity without counting embedded or parallel rows again. Expected first general-licence/full-registration milestones are 108, 72, 75, 72, 66 and 72 post-school months for California, England, Bavaria, Japan, India and Singapore respectively. These are different legal milestones, not comparable independent-GP qualifications.

`verify.ts` passed for all three clocks, California's licence-versus-residency distinction, Germany's embedded clinical year, Japan's later management role, a selected evidence panel updating with a new clock, the specialty/role switch, CSV download with provenance, offline requests (zero network requests), six no-JavaScript route rows, 50 no-JavaScript stage records, 26 source entries, mobile page width at 390px, dark theme and forced-colour rendering. No JavaScript errors occurred. The single-HTML structural audit passed with no external runtime resources, fetches, imports or local-reference blockers.

A representative temporary edit to `preview.md` was rebuilt and checked for propagation to the packaged page, then restored. The building agent inspected current desktop and phone captures and shortened clipped bar labels. Captures used for checking were deleted; the page is the deliverable. The first automated launch used the repository's obsolete Chromium revision; the test now uses an installed headless revision. No browser installation was required. Source retrieval did not bypass TLS failures. The first structural audit mistook JavaScript HTML-template strings for live links; serialising their opening brackets as JavaScript string escapes removed the false positives without changing generated links. Browser checks confirmed that the resulting DOM still exposes the intended source URLs.

# Not established

- Full NMC originals and current NExT operational status remain unconfirmed; the India row says so visibly.
- A current global medical-duration dataset from WHO was not obtained.
- EU records lack verified observation dates and overlap definitions; the snapshot is labelled accordingly.
- No independent full source audit or independent screenshot review has run on this preview.
- No author acceptance, production build, release check or deployment is claimed.

The preview carries selected route assumptions and the source access limits. It is ready for author review of the comparison and interaction; publication still requires the missing source checks and review.


This receipt preserves the initial preview check. The coordinator-requested phone and family-practice corrections, current 55-stage/30-source counts and full site-check result are recorded in `medicine-preview/verification.md`. The artefact path points to the current rebuilt preview.
