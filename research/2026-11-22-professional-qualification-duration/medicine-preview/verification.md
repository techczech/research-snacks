---
title: Medicine timeline preview — validation and evidence limits
date: 2026-11-22
status: Preview ready, publication not authorised
provenance: Targeted headless checks and source-coding audit by the building agent
---

# Checked

The packaged page has six routes, 55 stages and 30 source-register entries. Each stage has explicit start/end months, a duration basis, a source passage reference and source/access dates. The build rejects duplicate stage IDs, invalid periods, incomplete source metadata and overlong excerpts. A separate check rejects unexpected stage fields and asserts continuity without counting embedded or parallel rows again. Expected first general-licence/full-registration milestones are 108, 72, 75, 72, 66 and 72 post-school months for California, England, Bavaria, Japan, India and Singapore respectively. These are different legal milestones, not comparable independent-GP qualifications.

`verify.ts` passed for all three clocks, California's licence-versus-residency distinction, Germany's embedded clinical year, Japan's later management role, a selected evidence panel updating with a new clock, the specialty/role switch, CSV download with provenance, offline requests (zero network requests), six no-JavaScript route rows, 55 no-JavaScript stage records, 30 source entries, mobile page width at 390px, dark theme and forced-colour rendering. No JavaScript errors occurred. The single-HTML structural audit passed with no external runtime resources, fetches, imports or local-reference blockers.

A representative temporary edit to `preview.md` was rebuilt and checked for propagation to the packaged page, then restored. The building agent inspected current desktop and phone captures and shortened clipped bar labels. Captures used for checking were deleted; the page is the deliverable. The first automated launch used the repository's obsolete Chromium revision; the test now uses an installed headless revision. No browser installation was required. Source retrieval did not bypass TLS failures. The first structural audit mistook JavaScript HTML-template strings for live links; serialising their opening brackets as JavaScript string escapes removed the false positives without changing generated links. Browser checks confirmed that the resulting DOM still exposes the intended source URLs.

# Not established

- Full NMC originals and current NExT operational status remain unconfirmed; the India row says so visibly.
- A current global medical-duration dataset from WHO was not obtained.
- EU records lack verified observation dates and overlap definitions; the snapshot is labelled accordingly.
- No independent full source audit or independent screenshot review has run on this preview.
- No author acceptance, production build, release check or deployment is claimed.

The preview carries selected route assumptions and the source access limits. It is ready for author review of the comparison and interaction; publication still requires the missing source checks and review.

## Coordinator-requested correction

The coordinator independently inspected the initial preview at 1400px and 390px and found the phone route-label column consumed half the screen, and three later-training bars concerned internal/general medicine rather than family practice. The amendment puts each route name above a full-width axis below 700px. Bars show numeric durations on phones, with full linked stage labels immediately below; milestone labels wrap. The general-practice routes now use JMSB general practice, optional MD Family Medicine authorised by NMC, and Singapore's FPAB family-medicine residency. New training-completion markers do not replace the earlier general medical licence markers. There are now 55 stages and 30 source-register entries.

The original preview builder also passed an unsupported `write: false` option to `Bun.build`, breaking the site's TypeScript check. The option was removed; the existing build call has no output directory and returns in-memory build artefacts. No type cast, check exclusion or compiler suppression was added. The full `bun run check` passes, including the Astro build, TypeScript, 19 tests and site validation. The family-medicine retrieval manifest is retained as a source record.

The expanded headless check verifies each complete timeline fits at 390px in all three clock modes, every country label sits above its bars, each route retains its family-practice training stage, and completion months for Japan, India and Singapore are 132, 102 and 108 respectively. It also verifies milestone text is not transformed or coloured as a marker symbol. Current phone and desktop renders were visually checked by the building agent; the coordinator's independent visual review was of the prior version. Full source audit and publication approval remain pending.
