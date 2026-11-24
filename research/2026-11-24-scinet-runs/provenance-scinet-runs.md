---
title: "Source provenance and model usage for SciNet run scoping"
date: 2026-11-24
status: scoping
register: FOR AGENTS
---

# SciNet run scoping provenance

## Upstream data

SciNet, *The Anatomy of Science*, Cristian Alamos, Lukas Althoff and contributors, © 2026. The upstream repository identifies [commit `69973ad2cf21a34298b1f7f600f2c3820989113e`](https://github.com/lukasalthoff/scinet/tree/69973ad2cf21a34298b1f7f600f2c3820989113e) as **v1.10.0**. The version string is in the commit and README. Retrieval was pinned to the commit because the `v1.10.0` tag URL did not resolve. The archive was fetched on 24 November 2026 (UK time). [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) · [upstream licence](data/LICENSE).

| Local file | Upstream file and role | Changes |
|---|---|---|
| [tasks.csv](data/tasks.csv) | [data/tasks.csv](https://github.com/lukasalthoff/scinet/blob/69973ad2cf21a34298b1f7f600f2c3820989113e/data/tasks.csv) holds the taxonomy's 7,262 task records. | Byte copy. |
| [task_dimensions.csv](data/task_dimensions.csv) | [data/task_dimensions.csv](https://github.com/lukasalthoff/scinet/blob/69973ad2cf21a34298b1f7f600f2c3820989113e/data/task_dimensions.csv) holds `elo_opus5` and `elo_opus5_se`. One of 7,262 tasks has no Elo estimate. | Byte copy. |
| [task_ratings.csv](data/task_ratings.csv) | [data/task_ratings.csv](https://github.com/lukasalthoff/scinet/blob/69973ad2cf21a34298b1f7f600f2c3820989113e/data/task_ratings.csv) holds 26,803 importance, researcher relevance and frequency ratings at subfield placements. | Byte copy. |
| [METHODOLOGY.md](data/METHODOLOGY.md), [TASK_DIMENSIONS.md](data/TASK_DIMENSIONS.md), [DATA-README.md](data/DATA-README.md), [LICENSE](data/LICENSE) | Upstream methodology and dimensions at repo root, data notes at `data/README.md`, and the root licence. | Byte copies, with `data/README.md` renamed here. The copies retain upstream relative links. |
| [substeps-scoping-sample.csv](data/substeps-scoping-sample.csv) | [data/substeps.csv.gz](https://github.com/lukasalthoff/scinet/blob/69973ad2cf21a34298b1f7f600f2c3820989113e/data/substeps.csv.gz) supplies the cards considered in the trial. | Extracted 96 records for nine candidate cards. Universal cards use the Languages & Linguistics breakdown. Record values are unchanged and CSV formatting was reserialised. |

The complete substeps download was kept locally as `data/substeps.csv.gz` (SHA-256 `12a4974d4cdf48a76bda2900a260b92ab5f74602b222a4974014beb74a179bd2`). The branch carries the relevant extract. [SHA-256 list for the branch files](data/SHA256SUMS).

Join tasks and dimensions on `(task, level, domain, field, subfield)`. Both files have unique keys and their key sets match. The selected substeps can be recovered by matching task text, level, field and subfield for task records 3649, 3851, 3932, 3936, 3940 and 3955, and using the linguistics field card for universal records 5, 9 and 31. Selected substep records have an empty domain field. Ratings in `task_ratings.csv` describe how researchers use a task in their subfield. The AI ranking comes from `task_dimensions.csv`.

## Run evidence

The [inventory](evidence-scinet-runs.md) points to the published runs that support the examples. The scoping check also consulted the series coordination record, existing research folders for medicine and translation, and exploration records for the language, history and comparison snacks. These provided context for evidence availability. Raw private research records, corpus text, transcripts, session identifiers and account details stay out of this branch. Timing and tokens do not establish what happened in an individual step.

## Scoping usage

[Usage snapshot](usage.json) reports one Codex agent, selected by matching the active scoping request to its local rollout and running the repository's `scripts/agent-usage.py`. The public copy omits the harness instance identifier. The timestamps and totals cover recorded responses through the collection call. Subsequent verification, commit, push and handoff are outside that snapshot. Time is UK time (GMT). Reasoning is included in output. Research tools were shell and Python for local evidence and schema checks, web source retrieval and the Codex harness.


| Model | Calls | Uncached input | Cached read | Cache write | Reasoning | Output | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| gpt-6.2-sol | 19 | 102,412 | 1,843,072 | 0 | 3,819 | 17,936 | 1,963,420 |

Recorded window on Tuesday 24 November 2026 (GMT) was 22:55:34–23:02:37.
