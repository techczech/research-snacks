---
title: Data sources feature verification
created: 2026-11-21
provenance: Pinned research-datasets e509e9958c6e0123fd7952525895947372e828c5; local static build and chrome-headless-shell checks
---

The Data sources page contains 62 catalogue datasets: 43 used by published snacks and 19 considered only. Its 55 snack links resolve to current internal entry routes. Each related snack links back from its How this was made appendix. The source descriptions, notes, licence labels and downloads preserve the public catalogue; snack labels use the current entry titles.

The snapshot is committed with its upstream revision and JSON/CSV SHA-256 checksums. Builds do not fetch it. The sync script reads committed Git blobs and defaults to the already pinned revision. The build fails before replacing output if a catalogue snack link is absent or the snapshot checksums differ.

## Checks run

- `bun run check`: 19 tests, 958 assertions, 48 HTML pages; types, privacy, citations, social and agent metadata, local links/anchors and RSS pass.
- `bun run check:data-sources`: chrome-headless-shell at 950, 1440 and 390 px. Search (including notes), combined access/usage filters, zero results/clear, sort, URL reload and Back, anchored records, snack appendix links and downloads pass.
- Full catalogue content remains visible without JavaScript at all three widths; native Notes disclosures work. Controls that require JavaScript are hidden.
- 200% text has no horizontal page overflow at all three widths. The shared footer theme controls now wrap when text is enlarged; ordinary home content and layout are unchanged.
- Dark theme, forced colours and blocked localStorage checked. Keyboard traversal, shared search, Escape and focus return pass. No page errors observed.
- Web kit copies match their source. Catalogue privacy-pattern scan passes. Catalogue security harvest reports no findings for the existing runtime dependencies.

The implementation agent inspected the built list at 950, 1440 and 390 px and its filtered, dark and enlarged-text states. There was no independent screenshot/design review, and the existing whole-site release browser suite was not repeated for this bounded addition. The feature remains a preview pending Dominik's visual decision.

Screenshots and the deployed-preview check results are retained with `dtc://open/research-snacks/2026-11-21-review-data-sources.md`. Build output and temporary checks are ignored and removed after the handoff. The feature worktree stays until merge. No production deployment or merge is authorised by this record.
