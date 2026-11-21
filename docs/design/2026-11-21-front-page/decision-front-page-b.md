---
title: Research Snacks front page B with chronological All, tags and search
date: 2026-11-21
register: FOR DOMINIK
status: Chosen for implementation and preview; production not authorised
source: Owner choice in chat on 21 November 2026
---

Dominik chose: “B but iterate on it so that the all list is chronological and we also have a tag cloud a a more prominent search box”.

Purpose and reader: help an outside reader choose an evidence check. Readers need no prior knowledge of the author's earlier writing or AI. This revision retains B's compact cards and subject navigation, makes All a chronological collection, exposes existing tags and brings search into the first screen.

## Updated screen contract

Viewer: a first-time field expert, returning RSS reader or topic seeker. Purpose: choose a relevant check. Arrives knowing only a subject or the site's name. Expects: all ten checks, recognisable questions/findings, dates, subject counts, tags and visible search.

Sees: one existing site header; a plain heading with the approved two-sentence purpose and a prominent labelled search input; subject choices with counts; a compact tag cloud; the selected subject or All checks, newest first, in B's two-column cards. A phone uses one column. There is no separate latest-three strip because the complete All list is chronological.

Steps: read the purpose and a question/finding; select All or a subject; select a tag for its existing tag page; type and submit a search to the shared search dialog; open a canonical entry and return with Back. Subjects use shareable URL state and anchor fallbacks without JavaScript. Search remains usable as a normal GET form without enhancement. No second search engine, shortcut map or dialog is introduced.

Extra: research minutes remain inside the entries, avoiding ambiguity with reading time. Full original claim quotations, tags, sources and methods remain inside entries. Existing header search, About, RSS, citation, themes, shortcuts and agent formats stay available. Entry pages and their left Contents sidebar are unchanged.

States: All (ten); each subject (4/5/1); unknown subject (All); direct URL and reload; Back; no JavaScript; search typed, results and no results; keyboard open/close with focus returned to the actual search opener; dark, forced colours and enlarged text.

Evaluation: All links match the full date-descending entry order, with existing stable id order for same-day ties. Subject lists preserve that order. Tags are derived from existing metadata, show counts and link to working tag pages; font sizes stay at least the current base. Search accepts a query in the new field and shows the same shared results as header/keyboard search. No page overflow at 950/1440/390px or 200% text. At least two complete cards are visible at 950px. All entry content and canonical URLs are preserved.

Implementation: keep discovery summaries in a content Markdown file and expose an explicit reviewed id-to-subject map. Untouched future entries fall back to their existing title/verdict and category; an entry is never silently omitted. This adds front-page presentation metadata rather than changing research claims, RSS categories or entry frontmatter.

## Verification notes

The cloud includes authored categories as well as explicit tags because existing tag pages match either. This makes the cloud count agree with its destination: Linguistics has four matching checks, not three explicit tag occurrences. There are nineteen topic routes. No Research fallback category is invented in the cloud for entries without metadata.

The original release check expected category navigation to remove unmatched cards by loading another page. The chosen front-page behaviour scopes cards in place, so that assertion now counts visible cards. The release check also visits the original category URL and keeps its original full-page count assertion. Both routes and browser Back are verified.
