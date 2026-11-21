---
title: Data sources page contract
register: AS DOMINIK
purpose: Help researchers find public data and trace a snack to its dataset
reader: An outside researcher who knows neither the site nor its working process
provenance: Dominik's delegated brief of 21 November 2026; research-datasets README and datasets.json at e509e9958c6e0123fd7952525895947372e828c5
---

The site checks public claims against public data. This addition lets a researcher find a dataset or trace the data behind a published check.

## Journey and screen contract

Viewer: a researcher looking for a corpus of child language. They know what sort of material they want, but not the providers. They arrive through Data sources in the existing navigation. The page's purpose is to find a suitable dataset. They expect a description, access terms, licence, provider and examples of its use.

They see the existing publication header, the literal heading “Data sources”, a short description, download links, a collapsed access key and one combined search/filter toolbar. The title-sorted list follows immediately. They search “child language”, find CHILDES and TalkBank, read their descriptions and registration requirement, open Notes for restrictions, then follow the provider link. The right-when condition is that they can identify the relevant corpus and understand how to get it without confusing access with reuse rights.

A reader checking an existing snack reaches its closing How this was made appendix, follows a Data sources link to the anchored catalogue item, reads the access and licence, and can return through its Used in links. The new page is one list surface; no existing front-page controls or layout are replaced.

The list shows all records without JavaScript. With JavaScript the query, access, usage and sort state survive reload and browser Back. A zero-result state offers Clear filters. A deep link reveals its item even if filters would hide it. Notes use native disclosures. Controls are absent without JavaScript rather than appearing functional.

## Copy brief and sources

The opening paragraph explains what the collection contains. The access key reuses the catalogue README wording. Record titles, providers, descriptions, licences and notes are copied unchanged from the pinned public catalogue; snack labels come from the current site's entry titles. No new research claims are introduced. Downloads preserve the upstream bytes and absolute snack URLs; rendered links point internally.

## Evaluation

Search “child language” finds CHILDES and TalkBank; notes-only search works. Access and usage filters combine, sort changes order, URL reload and Back restore controls. All catalogue snack links resolve and every related snack has an appendix link to the matching anchor. No-JavaScript pages retain every record and disclosure. At 390, 950 and 1440 pixels, and 200% text, no page scrolls sideways. The existing home remains the approved design, with one additional navigation destination.
