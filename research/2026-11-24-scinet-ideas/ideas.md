---
title: "SciNet: four ways to use it for snacks"
date: 2026-11-24
register: FOR DOMINIK
source: https://www.anatomyofscience.com/ ; https://github.com/lukasalthoff/scinet (v1.10.0, CC BY 4.0)
---

# SciNet: four ways to use it for snacks

**What it is.** SciNet ("The Anatomy of Science", Cristian Alamos and Lukas Althoff, Stanford, 2026) does for research work what O\*NET does for jobs. It lists 7,262 research tasks across 6 domains, 34 fields and 318 subfields. Each task has steps, hours, how often and how widely it is done, how important and complex it is, and a rating of how likely a frontier Claude model is to complete it. It also counts researchers for 2020 by country and field, from OpenAlex. The data is free under CC BY 4.0 as CSV files on GitHub. It is now in the datasets catalogue.

**The main caveat.** Most of it was written by a language model: the task lists, the hours, the importance scores and the ability ratings. These were checked against papers, protocols and O\*NET, but each rating is still one model's answer, not a survey of researchers. That makes it good for checking claims about the shape of research work, and weak as evidence about what AI can do, because the ratings are a model judging models. The project acknowledges funding from Anthropic.

**What a first look at linguistics shows.** Languages & Linguistics has 152 tasks in eight subfields: sociolinguistics, syntax, historical linguistics, psycholinguistics, translation studies, applied linguistics, semantics and pragmatics, and computational linguistics. Corpus work appears in 19 tasks. There is no cognitive linguistics subfield and no task that mentions metaphor.

## The four ideas

**1. Do the snacks' own runs match SciNet's ratings? (recommended)**
We have run records and token tables for every snack: which steps the agents did, where they failed and where you corrected them. Map those steps onto SciNet tasks (corpus compilation, source checking, annotation, interpretation) and compare SciNet's rating of whether a model can do each task with what actually happened. This uses our own primary data, nobody else has it, and it tests the one part of SciNet that is hardest to check. Linguistics is where you can judge the task descriptions best.

**2. Does China have more researchers than the United States?**
SciNet counts about 1.76 million researchers in the United States and 1.58 million in China in 2020 (Czechia about 50,000; United Kingdom about 444,000), counting authors with at least five papers. UNESCO and OECD count research and development staff differently, and their figure for China is higher. A snack would set the three counts side by side and show what each one counts. This is a clean primary-data check, and it does not depend on the model ratings.

**3. How much of research is 'within reach' of AI?**
Claims about AI automating science often give one percentage. SciNet allows the calculation: weight each task by the hours researchers spend on it and add up the tasks the model is rated able to do. The snack would show the number and then how far it moves when the ratings or the hours change, because both come from a model. It is topical, but it mostly tests SciNet's assumptions, not the world.

**4. What does SciNet leave out of your field?**
There is no metaphor and no cognitive linguistics. A short snack could list what is missing from linguistics, from your own practice, and compare it with the topics of recent linguistics papers in OpenAlex. The site accepts suggestions for missing tasks, but suggesting them in your name is your call.

## Not yet done
- METHODOLOGY.md in the repository, which describes the validation, has not been read.
- SciNet goes live on the public Data sources page with the next site deployment.
