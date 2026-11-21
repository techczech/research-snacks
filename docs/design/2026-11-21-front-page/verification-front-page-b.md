---
title: Verification of the chosen Research Snacks front-page revision
date: 2026-11-21
register: FOR DOMINIK
status: Local build, browser release checks and independent visual review passed; feature-preview deployment follows
source: Build checks, headless browser journeys and independent screenshot review
---

The build and content tests cover the complete chronological collection, one canonical card per entry, a labelled GET search form and exact agreement between cloud counts and linked tag pages. The original entry source and assets are unchanged.

The targeted browser journey passed at 950, 1440 and 390 CSS px: All has all ten entries in existing date-descending order; subjects scope 4/5/1; Back and reload retain the selected subject; All restores ten; an unknown subject shows All; existing tag pages remain reachable. The home query transfers into the shared dialog, shows the expected cake result and designed no-results state, and Esc returns focus to the field or button that opened it. Without JavaScript, subject anchors filter the server-rendered cards and the search form reaches the existing search page. Enlarged text has no horizontal page overflow.

A targeted regression test found that explicit tags alone undercounted the Linguistics tag page. Cloud counts now include the authored category, matching that page's established membership rule. A real 200% text overflow in long sidebar tags was fixed by allowing them to wrap.

The independent screenshot review found no blocking defect. One minor singular/plural wording defect in the existing shared search was corrected. The retained review pictures cover desktop, 950px, phone, expanded phone Topics, selected Economic history and search. No participant study, screen-reader test or physical-phone test was performed.

A later whole-site release run was blocked when the shared browser cache disappeared. Its replacement browser was installed only in ignored test output, with the current locked Playwright package; no project dependency or global app was changed. Browser checks use Chrome Headless Shell throughout. Final release results and deployed verification are appended below after completion.

## Final local result

bun run check passed: 17 tests, 716 assertions and validation of 43 generated pages. The complete bun run check:release suite passed, including the new home journeys and the original chart, table, citation-copy, contents, dialog, theme, forced-colour, blocked-storage, no-JavaScript and enlarged-text checks. The shared look gate found an existing 14px citation on the home page; its front-page text now uses the existing 16px base. The gate then passed at laptop and phone widths, with minimum visible text at 16px and no horizontal overflow. Preview deployment and its independent URL check follow this local verification.
