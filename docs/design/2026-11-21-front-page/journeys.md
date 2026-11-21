---
title: Research Snacks front-page journeys and design choice
date: 2026-11-21
register: FOR DOMINIK
status: Proposed; awaiting visual choice
source: Live front page and all ten entry frontmatters
---

Purpose and reader declaration: help an outside reader choose one relevant research check. Readers know their field but need no knowledge of AI agents or the author's earlier writing. This is a design comparison, with evidence, pictures, costs and one choice; implementation details and previous chat history are not required reading.

The site checks public claims against evidence using AI assistance. The front page helps a reader choose a check to read.

## What the live journeys show

This is an expert walkthrough, not observed participant testing. The live front page was visited on 21 November 2026. All ten entries' category, tags, claim, verdict and publication date were read; the exact inventory is in research/front-page/inventory-frontmatter.json.

1. First visit from a shared link: sees Research Snacks twice, then “Small research experiments with AI agents”, then Entries and three broad categories. Told how experiments were made before what a reader gets. Reads long quotations and long verdicts to decide whether to open an entry. “A 2011 claim”, “how close was I” and a time such as “17 min” require interpretation. The minutes are research time, not reading time. Right when: the first screen explains the evidence checks and offers at least two recognisable questions with findings at 950px.
2. Returning RSS reader: sees dated entries in descending order and a small RSS link. This route already works; it should stay chronological and new additions should remain first. Six entries share 19 November, with no evidence for their publication time within that date. Right when: a newest-first view and Subscribe link are visible, with dates, without inventing an unread state or update history.
3. Topic seeker: Linguistics opens four matching entries and browser Back returns to the front page. Economic history is absent: five entries have neither category nor tags and fall back to “Research”. History contains only revolution speed. Right when: Linguistics shows four entries; Economic history shows all five economic checks; a clear All route restores ten. Search remains the existing shared dialog.

## Inventory and supported grouping

Current: Linguistics 4; History 1; Research (fallback for absent category) 5. Four linguistics entries have tags, revolution speed has political/history tags, and the other five have none. Nothing is deleted or retrospectively recategorised in entry frontmatter by this proposal.

Proposed front-page subjects: Linguistics 4 (usage, metaphor, decipherment); Economic history 5 (jobs, work, wealth, investment); Political change 1 (revolution speed). These are editorial navigation groups, not claims that all entries currently carry those categories. A small explicit id-to-subject map can live with the front-page component; existing tag URLs remain valid. The wealth forecast sits under Economic history because its evidence compares historical transitions; the question and finding make its forecast status clear. Use ordinary text labels; AI assistance describes the method across the whole collection rather than an exclusive topic.

## Front-page screen contract

Viewer: an outside field expert deciding which check to read. Arrives knowing only the shared site's name or a topic. Expects questions, evidence findings, dates and a route by subject. Purpose: choose a relevant check. Why here: shared site link, return from RSS, or topic enquiry. Achieve: open a relevant entry with an accurate expectation of its finding.

Sees in order: one existing site header (64px); plain Research Snacks heading and two short explanatory sentences; subject choices with counts and the newest-first route; real questions with short findings; existing citation and footer routes. No additional sticky toolbar. What to know: these are evidence checks assisted by AI, with full sources and methods inside each entry; dates mean publication, never time to read. Steps: choose all/latest or a subject, compare the question and finding, open the unchanged entry URL, use Back to return. Extra: research duration moves off list rows and remains in entries; source tags remain accessible through the existing entry pages and search; RSS remains visible; About, sister site, citation, theme, keyboard help and agent formats retain their routes.

States: all ten; filtered four/five/one; no JavaScript (all content visible, subject links jump to groups); unknown subject (all); search unchanged; return via Back; empty collection (future implementation message rather than a blank page). No results state is added to search; its existing one remains.

Evaluate: at 950/1440/390 CSS px there is no horizontal page scroll; all ten canonical links exist; dates and findings are readable without clipping; topics show 4/5/1; the latest date is 19 November; filters or jumps work with keyboard and without JavaScript; new dated entries automatically join the latest view. The header and content begin on the first screen. Original entry wording, left contents sidebar, figures, search behaviour and permalinks stay unchanged.

## Two candidate journeys

A, Latest checks: arrive at a newest-first list with aligned Question and Finding columns. Choose a subject to narrow the list in place. On a phone, each row becomes a question followed by its finding. Back restores the subject through URL state. Cost: about half a day including the front-page subject map, concise copy, filter integration and release checks (planning estimate). Gives up the full claim quotation and all tags on each row; those remain inside entries.

B, Browse by subject: arrive at a small latest-additions strip, then three subject sections. Choose a subject to jump straight to it; read questions and findings together in each section. On a phone, the latest strip precedes the subject sections. Cost: about half a day including grouping, concise copy, anchor navigation and release checks (planning estimate). Gives up a single chronological list; the latest strip repeats three entry links to make new work discoverable.

Both are static design prototypes. Search links open the existing public search page; the production dialog, theme switch and other shared components are not reimplemented in the mockups. Canonical questions and verdicts are archived in the inventory; shorter discovery copy is editable in copy-front-page.md and is a proposal for this page only.

## Boundaries and next step

Choose A, B, or ask for a revised direction. The chosen design will then be built on this branch and deployed as a feature preview. Publication requires a separate go-ahead after that preview. No production source has been edited for these mockups and nothing has been deployed.
