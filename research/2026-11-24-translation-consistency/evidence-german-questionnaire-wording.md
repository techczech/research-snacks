---
title: German EVS questionnaire source and selected key words
date: 2026-11-24
register: FOR AGENTS
status: source-wording-verified-corpus-analysis-not-run
provenance: Official EVS country listing and GESIS document 66247; ordinary unauthenticated retrieval, isolated Python processing and selected-page visual checks.
---

# Germany source receipt

The [official EVS 2017 country table](https://europeanvaluesstudy.eu/surveys/surveys-evs/evs-2017/participating-countries-and-country-information-survey-2017/) links Germany's field questionnaires to [GESIS document 66247](https://access.gesis.org/dbk/66247). Germany is a named national version here, not a generic German-language questionnaire from Austria or Switzerland.

The web tool timed out or could not retrieve this document. Ordinary unauthenticated Python urllib retrieval returned HTTP 200 with application/zip, not a PDF. An initial PDF-only check therefore saved nothing. The successful ZIP download contained five questionnaires and one matrix/split workbook. No credentials, registration, form submission or security bypass was used. Search also surfaced a German WVS questionnaire, which was not downloaded because this session's WVS download boundary remains in force.

Archive: `evs-2017-germany-questionnaires.zip`; 4,294,960 bytes; SHA-256 `54ad2831592a43dd1a87e7624d4364b22bcdf508e5703f0fa2bd2c7b053bf2cb`. Full originals remain in ignored project output, not the public record; no archive redistribution right is assumed.

| Questionnaire | SHA-256 | Selected-form source locations |
|---|---|---|
| `ZA7500_q_de_CAPI.PDF` | `70b3c95d1ad46bd906a3a1e31834c0f578966a381727cd0f7ec4571bfa60f429` | Work: PDF page 8, Q12/v49; having children: page 14, Q27/v83; child qualities: page 15, Q28/v87 and v88. These three pages were visually checked. |
| `ZA7500_q_de_CAWI_full.pdf` | `a0f13d71a49ab116f5a2248af985e59dbeee0f2a7c2b22b8432061cf61d3d80d` | Work: page 17; having children: page 27; child qualities: page 29. Selected forms checked in extraction. |
| `ZA7500_q_de_CAWI_matrix.pdf` | `a07561ac649dbb152a54226a53e56688b3146aefbb02f5d3a220950ab460dbe7` | Work: page 17; having children: page 27; child qualities: page 29. Selected forms checked in extraction. |
| `ZA7500_q_de_Mail_full.pdf` | `796c3a2c02f3977958c2c7886e51ca9c005889ee8bea20248b3bdd64fd330a21` | Work: page 9; having children and child qualities: page 17. Selected forms checked in extraction. |
| `ZA7500_q_de_Mail_matrix.pdf` | `5ae34a362f6e0aa5f09d84f90c7fec906095f65ccb192d0ebe28b518e3d169c7` | Work: page 9; having children and child qualities: page 17. Selected forms checked in extraction. |

The workbook `ZA7500_mixed_mode_matrix_split_questionnaires_DE.xlsx` was inventoried but not extracted or analysed. Archive members were individually selected with basename and size checks; no extract-all operation or downloaded code execution occurred. Python ran with -I, outside the downloads directory.

## Verified short forms

| Context | German form | Note |
|---|---|---|
| Industriousness as a child quality | `Fleiß` | Q28/v87 in the CAPI instrument. |
| Sense of responsibility as a child quality | `Verantwortungsgefühl` | Q28/v88; do not silently replace it with `Verantwortung` or `Verantwortungsbewusstsein`. Those would be proposed corpus alternatives. |
| Having children as a social duty | `Pflicht` | Q27/v83. |
| Work as a social duty | `Verpflichtung` | Q12/v49; preserve the difference from `Pflicht`. |

The four lexical forms were also found in all four non-CAPI variants. This checks selected-word stability across the supplied instruments, not equality of their full wording, routing, layout, administration, or response formats. Corpus meaning and equivalence have not been judged.

## German corpus choice

Exact corpus-info metadata calls succeeded for `preloaded/detenten23_rft3` and `preloaded/detenten23_rft4`. The [provider's corpus page](https://www.sketchengine.eu/detenten-german-corpus/) records rft4 as a later pipeline correction using the same texts, with 2023 web material and a 2024 Wikipedia component. Pin rft4 for the proposed study and preserve that decision before results are seen. No concordance, collocation or word-sketch query was run.

This receipt supports source selection. It does not grant a licence to republish the questionnaire archive or establish a semantic finding.

## Usage and retained scratch

The [German/full-brief usage snapshot](usage-german-brief.json) selects this thread's one Codex instance from 08:20 UTC on 24 November 2026. Recorded calls span 08:21:33–08:29:10 UK time / UTC, seven minutes and 37 seconds of elapsed transcript time. Later checks, commit and handoff are excluded; reasoning is included in output. Earlier usage snapshots remain unchanged.

| Agent | Harness | Model | Calls | Input, uncached | Cached read | Cache write | Reasoning, within output | Output | Total |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| Scoping agent | Codex | gpt-6.1-sol | 18 | 74,927 | 6,160,512 | 0 | 4,213 | 16,905 | 6,252,344 |

Retained scratch in ignored `.generated/translation-consistency-scoping/`: `downloads/evs-2017-germany-questionnaires.zip` and its five individually saved PDFs; `pdf-checks/evs-german-capi-pdf-page-8.png`, `pdf-checks/evs-german-capi-pdf-page-14.png`, `pdf-checks/evs-german-capi-pdf-page-15.png`; and five corpus-info caches in `corpus-metadata/`. Earlier EVS renders, the raw catalogue cache and the untracked scout lock are also retained. No delete command was run. Scout saved a receipt without corpus indexing.
