---
title: First translation snack — neighbouring-language words and ordinary associations
date: 2026-11-24
register: FOR DOMINIK
status: proposed-sample-awaiting-author-choice
provenance: Author's lexical-focus decision relayed at 08:08 UK time; selected local EVS questionnaire pages checked and official corpus documentation read on 24 November 2026.
---

# Start with Czech, Slovak and Polish words for work and obligation

**I recommend Czech, Slovak and Polish, using the EVS 2017 questionnaires already available.** The first snack would ask whether the words chosen as equivalents carry comparable associations in ordinary written use. It would use linguistic judgement with corpus support, as you requested. Full questions supply the context for selecting the words; whole-question equivalence and response differences would be separate later investigations.

The proposed core has three related word groups: industriousness/hard work, responsibility, and duty/obligation. They occur in the child-quality list and statements about duties towards society. This gives us both closely related forms and a visible difference in lexical choice. It does not assume in advance that the forms are equivalent, or that a different choice is wrong.

## Languages and questionnaire words

Czech and Slovak give the closest-language comparison. Polish adds another neighbouring language with a questionnaire already in the collection. English can help explain candidate meanings, but the glosses below are orientation labels, not newly verified quotations from the English master questionnaire. German would widen the first comparison beyond the three Slavic languages, but its questionnaire and key-word extraction still need retrieval and checking. Russian and Ukrainian remain available for a later extension.

| Word group and questionnaire context | Czech | Slovak | Polish |
|---|---|---|---|
| Industriousness, selected as a desirable quality in children | `pracovitost` | `pracovitosť` | `pracowitość` |
| A sense of responsibility, in the same child-quality list | `pocit odpovědnosti` | `pocit zodpovednosti` | `poczucie odpowiedzialności` |
| Having children as a duty/responsibility towards society | `zodpovědnost` | `povinnosť` | `obowiązek` |
| Work as a duty towards society, providing a second context for the same lexical group | `povinnost` | `povinnosť` | `obowiązek` |

These short forms were read on the existing EVS PDFs. The child-quality list is Czech/Slovak Q28 and Polish P28, with `v87` for industriousness and `v88` for responsibility in the Czech/Polish files. The society statements are in Czech/Slovak Q27 and Polish P27 (`v83` in the Czech/Polish files), and the work-attitude battery (`v49` in the Czech/Polish files; Q12 in the Czech/Slovak instruments). Dataset codes and national item positions must remain distinct.

Source locators for the displayed forms are `ZA7500_q_cz.pdf`, PDF page 10 / printed page 9; `ZA7500_q_sk.pdf`, PDF page 17 / printed page 11; and `ZA7500_q_pl.pdf`, PDF page 13 / printed page 12. The Polish work statement was also checked visually on PDF page 7 / printed page 6; Czech and Slovak work statements were inspected in extracted text on PDF pages 6 and 11. Several extraction outputs lose accented characters. The displayed child-quality and having-children forms were checked against rendered pages, rather than reconstructed from that damaged extraction. File hashes are in the [existing inventory](inventory-translation-questionnaires.json).

The previously downloaded Czech WVS questionnaire supplies the contrasting expression `tvrdá práce` in Q9, PDF page 3; the Slovak WVS Q9 uses `pracovitosť`, PDF page 5. Those two short expressions were located in fresh extraction; no WVS page image or full extract was saved in this repository. They provide a reason to examine the lexical alternatives, without making EVS-versus-WVS response analysis part of this first snack.

For corpus comparison, the initial alternative set would include the responsibility and obligation words in each language even when only one appears in a particular item. The hard-work group would compare the virtue nouns with expressions such as Czech `tvrdá práce`, Slovak `tvrdá práca` and Polish `ciężka praca`. The latter two expressions are agent-proposed comparison candidates, not claims about their occurrence in these questionnaires. Alternative selection needs linguistic judgement before the queries are fixed.

## Corpora for the first check

**Use monolingual web corpora as the main evidence and InterCorp as supporting evidence.** The monolingual comparison addresses ordinary written usage directly. The parallel comparison helps examine how expressions are translated in context, while retaining source-language and genre limitations.

| Role | Proposed corpus | Evidence and limitation |
|---|---|---|
| Main Czech usage | [Czech Web 2023, csTenTen23](https://www.sketchengine.eu/cstenten-czech-corpus/), `preloaded/cstenten23_mj2` | The provider describes a 2023 crawl and partial genre annotation. The exact corpus metadata call succeeded in this scoping pass. Prefer this to the older Czech 2012 candidate in the initial inventory. |
| Main Slovak usage | [Slovak Web 2023, skTenTen23](https://www.sketchengine.eu/sktenten-slovak-corpus/), `preloaded/sktenten23_rft1` | Provider documentation and the exact metadata call were accessible. Genre annotation covers a subset. |
| Main Polish usage | [Polish Web 2019, plTenTen19](https://www.sketchengine.eu/pltenten-polish-corpus/), `preloaded/pltenten19_rft3` | The provider records the 2019/2020 crawl and the later tagging-pipeline revision. Exact metadata retrieval succeeded. Its text period differs from the two 2023 corpora. |
| Parallel support | [InterCorp](https://wiki.korpus.cz/doku.php/en:cnk:intercorp), using shared Czech/Slovak/Polish texts where available | The overview distinguishes manually checked fiction alignment from automated collections and a Czech pivot. Pin the release and shared document intersection before use. Authentication and selected-language queries remain untested. |
| Optional independent sensitivity check | [SYN2020](https://wiki.korpus.cz/doku.php/en:cnk:syn2020) for Czech; [Slovak National Corpus prim](https://korpus.sk/korpusy-a-databazy/korpusy-snk/) for Slovak | Different collections could test dependence on web usage. SYN2020 is a designed reference corpus of printed Czech, not a sample of every kind of everyday language. The Slovak provider describes registered research access. Neither query route was tested here; neither is required to open the first pilot. |

The three successful metadata calls establish that these corpus identifiers resolve through the connector. They do not establish that every linguistic query, export or word-sketch operation will succeed. No linguistic queries have been run. Corpus terms and rights for selected concordance examples still need recording before a public package.

The same platform and related corpus family do not make the corpora equivalent samples. Crawl years, domains, genre coverage, taggers and word-sketch relations differ. The first check should compare readings within each language and then judge the relationship between those readings. Raw counts or association scores must not become an automatic cross-language equivalence score. Where matching genre subsets exist, use them as a sensitivity check and state that they cover only annotated material.

## How judgement and corpus evidence would work together

Start with a short linguistic account of each candidate: plausible senses and associations, the question context in which it was chosen, and what would count against that account. Then inspect word sketches, collocations and a reproducible concordance sample for both the chosen word and plausible alternatives. For multiword expressions, inspect the expression itself as well as its component lemmas. Keep the sampling rule and query settings with the evidence; expand the sample where competing senses make a short reading inconclusive.

The judgement asks which associations the examples support: for instance personal virtue, effort, physically demanding work, legal requirement, moral obligation, accountability or taking care of someone. These are provisional interpretation prompts, not a keyword classifier or a predetermined coding result. A statement such as “hard work means physical toil” must remain a hypothesis until examples support it. Record overlapping senses, contrary examples and unresolved cases. A model judgement should not be presented as a native-speaker consensus; the author's role in reviewing borderline readings remains to be agreed.

The snack could show that selected questionnaire equivalents have similar or different usage profiles in the chosen written corpora. It could not establish their meaning for all speakers, spoken-language associations, survey respondents' actual interpretation, or the cause of response differences. Similar-looking cognates are candidates for checking, not a guarantee of equivalence.

## The next choice

**Which first sample should be scoped in detail?**

- **Three languages and the three word groups above is the recommendation.** It uses questionnaires already available and gives related lexical contrasts without adding a retrieval step.
- **Czech and Slovak with the same word groups would make a smaller pilot.** It gives less geographical breadth but lets us develop and inspect the judgement method sooner.
- **Add German to Czech, Slovak and Polish for a broader first comparison.** It would test a more different language, while adding questionnaire retrieval, exact-word checking and another set of linguistic judgements.

The groups refer to lexical questions, not a claim that whole survey items or response percentages are comparable. TIMSS, official EU translations, distant-language extensions and wave consistency stay on the series list.

This proposal is based on source selection and metadata checks only. The lexical focus is agreed; the language/word sample, annotation method, author contribution and final brief are not yet confirmed. Nothing goes live before the author has looked at its preview.

## Scoping work and recorded usage

The [follow-up usage snapshot](usage-lexical-scope.json) selects this thread's single Codex instance from 08:08 UTC on 24 November 2026. Recorded calls span 08:09:04–08:14:12 UK time / UTC, five minutes and eight seconds of elapsed transcript time. It excludes final checks, commit and coordinator handoff. The original [initial-scoping snapshot](usage.json) remains unchanged. No subagents or independent reviewers were used. Human time for the to-do answer has not been estimated.

| Agent | Harness | Model | Calls | Input, uncached | Cached read | Cache write | Reasoning, within output | Output | Total |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| Scoping agent | Codex | gpt-6.1-sol | 10 | 47,456 | 2,559,744 | 0 | 3,167 | 11,896 | 2,619,096 |

Four EVS page renders remain in ignored `.generated/translation-consistency-scoping/pdf-checks/`: `evs-czech-pdf-page-10.png`, `evs-slovak-pdf-page-17.png`, `evs-polish-pdf-page-13.png` and `evs-polish-pdf-page-7.png`. The earlier raw catalogue cache and scout lock are also retained. None is included in the public scoping commit. No delete commands were run. The scout evidence capture saved a file/manifest receipt and reported no corpus indexing.
