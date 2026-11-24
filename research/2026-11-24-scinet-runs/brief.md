---
title: "Do the Research Snacks’ own runs match SciNet’s ratings?"
date: 2026-11-24
status: for-approval
register: FOR DOMINIK
---

# Do the Research Snacks’ own runs match SciNet’s ratings?

**Decision required.** Approve a small comparison of SciNet’s task rankings with the records of past Research Snacks. The proposed cap is **60 agent minutes**, with a stop after **25 minutes** if too few comparable cases survive. You can spend **up to 10 minutes** checking linguistics matches, or leave that to a second reader.

## What the first look found

The run records yielded **24 candidate steps across 11 of the 12 tracked snacks**. Of ten examples tried, **four** looked like whole SciNet tasks, **five** covered only part of a task and **one** had no clear match. The four close matches still need outcome checks. Most of the corpus examples covered a search or a round of annotation. SciNet’s corresponding tasks can include designing a corpus, checking its coverage or having independent readers check the labels. [Run inventory and ten trial matches](evidence-scinet-runs.md)

The medicine preview contains a documented author intervention. You asked for a shared family or general practice endpoint where possible. The record does not establish how clearly the first brief required that endpoint. The corpus and Roman numeral records are clearer about mistakes agents found and fixed themselves or for one another. That distinction matters when judging how much the first agent completed. [Medicine timeline](https://researchsnacks.semanticmachines.fyi/2026-11-22-medicine-training-routes/#timeline) · [Roman numerals timeline](https://researchsnacks.semanticmachines.fyi/2026-11-21-roman-numerals-across-periods/#timeline)

## What would be compared

SciNet lists **7,262 tasks**, including **152** in Languages & Linguistics across eight subfields and the field itself. Claude Haiku 5.5 compared pairs of task descriptions to judge which task Claude Opus 5 was more likely to complete. The resulting Elo scores give an order. SciNet did not run Opus 5 on those tasks, and its checks against occupation surveys, protocols and papers assessed other parts of the dataset. The Elo criterion is completion to a competent researcher’s standard with supplied data or access and without someone fixing the digital work. [SciNet methodology](data/METHODOLOGY.md) · [Elo documentation](data/TASK_DIMENSIONS.md#elo-ratings-for-claude-opus-5)

Begin with the saved reports, queries, tables and revisions from the tracked snacks. Use the run records to recover what the agent was trying to deliver, what survived, and who intervened. Count a query error and its retry as one attempt sequence, while keeping the first failure visible. Group dependent steps from the same output. Compare the task descriptions and substeps with the observed work before looking up the scores. A second reader checks close and borderline matches with the scores hidden. Partial and unmatched steps stay visible in the inventory.

Record whether the result was independently supported, delivered but unverified, corrected by another agent, corrected by a human, or left incomplete. Record same-agent retries, access problems and new instructions separately. A human supplying an account or a source is compatible with SciNet’s assumptions. A human repairing a bad judgement changes the outcome. Silence in a timeline leaves the intervention status unknown.

## What would count as agreement

Compare distinct whole tasks from different runs with clear outcomes and similar access. Prefer pairs with the same model and tools where available. Agreement means the higher-rated task reached a checked standard without a material fix, while the lower-rated one required a fix or remained incomplete. Disagreement reverses that order. Treat equal outcomes, unclear corrections and score ranges that overlap within two reported standard errors as inconclusive. Show counts and examples. Check whether the conclusion changes when universal ratings, which average across 34 fields, are left out.

One result against the expected pattern would be a lower-rated task completed to a checked standard while a higher-rated task needed someone to repair a substantive error, with comparable scope and tools. If most examples cover substeps or only show delivery, the result is about the limits of comparing the records. The small, selected sample and the different models and tools limit any inference about Opus 5 or research capability more broadly.

## Time and decision

| Work | Agent minutes |
|---|---:|
| Recover before-and-after evidence and screen task matches. Stop here unless at least five distinct whole-task cases from three runs survive and at least one pair has comparable, clearly different outcomes and separable ratings. | 25 |
| Have a second reader check the matches and the outcome evidence. | 20 |
| Write the comparison or the evidence-limit finding for review. | 15 |
| **Maximum** | **60** |

If you choose to help, check up to five short linguistics cards for whether the observed output really covers the task. The reader will see the action and the task description before seeing the Elo or the outcome. Allow up to 10 minutes.

**Choose one.** Approve the comparison with a second reader. Approve and check up to five linguistics matches yourself as well. Or park the comparison.
