Research Snacks are small, quick research experiments that AI agents have made possible. Each one starts from a claim or question I have seen in the wild. Where possible, I go to the primary data and check it there.

Each entry records how long the check took, what I did, what the AI did, the dead ends and the caveats. What the series shows is how quickly a claim can now be checked. It does not show that the AI is always right, and the entries say where the result is a judgement call.

## Inspiration: Breakfast Experiments™

The model is Mark Liberman's [Breakfast Experiments™](https://languagelog.ldc.upenn.edu/nll/index.php?s=breakfast) on Language Log. When a question about language comes up, Liberman, a phonetician, gathers the speech samples, segments them, runs a small analysis and posts the result. That is easy for him because he uses those tools every day. Most of us lack the tools in fields next to our own, and often the time even in our own, to test a hunch with a little experiment.

AI agents change that. A check that once needed a specialist's toolkit can now be run by anyone who can state the question clearly and judge the answer. These snacks are my attempt to show what that looks like in practice, including where the AI needed correcting.

## How the agents are instructed

There is no long prompt behind each snack. I say what I want checked in a chat with a coordinating agent. It hands the research to other agents. For some snacks, it also asks models from other companies to review the result. The standing instructions come from skills: instruction files that agents load when a task calls for them. These are the skills behind the research and the writing. Names with links are public.

- **[research-snack](https://github.com/techczech/dominiks-agent-skills/tree/main/research/research-snack)**: the house rules (split the claim, find the source, test the word "only", go to the primary data, make every number checkable, show me each snack before it goes live) and the page structure.
- **[research-reproducibility](https://github.com/techczech/dominiks-agent-skills/tree/main/research/research-reproducibility)**: keeps the sources, scripts and decisions so that the check can be rebuilt.
- **[archive-scout](https://github.com/techczech/dominiks-agent-skills/tree/main/research/archive-scout) (general version)**: searches an archive of my posts and notes when a snack checks something I wrote.
- **[model-council](https://github.com/techczech/dominiks-agent-skills/tree/main/dev/model-council)**: sends a draft to models from other companies for independent review.
- **[writing-modes](https://github.com/techczech/dominiks-agent-skills/tree/main/philosophy-for-agents/writing-modes)**: decides who a text is for and in whose name it speaks.
- **[expository-writing](https://github.com/techczech/dominiks-agent-skills/tree/main/philosophy-for-agents/expository-writing)**: keeps the prose literal and specific.
- **[unslop](https://github.com/techczech/dominiks-agent-skills/tree/main/writing/unslop)**: checks the prose for padding and empty phrases.
- **dominik-lukes-voice (private)**: my voice, for text written in my name.

The agents also use general skills for delegating work, building this site and keeping API keys out of the code; none of them is specific to the snacks. The whole public collection is at [techczech.github.io/dominiks-agent-skills](https://techczech.github.io/dominiks-agent-skills/). The "How this was made" section of each snack lists the models used, what each one did and how many tokens it used.

## Model councils

A model council is a small panel of other AI models asked to review the same work independently. It brings in another view so the model that did the research does not grade its own work.

Each member gets the same packet with the question, the work to review and the relevant evidence. Members come from different model families where possible. They work separately and cannot see each other’s answers. The packet asks them to spot-check important claims against the sources and explain their doubts.

The coordinator compares the answers, weighs the evidence on each point and records each decision and why it was made. The panel gives advice without a vote. Models can agree and still share the same error, so agreement alone leaves the claims unverified.

Each snack that uses a council names its members and links to their packet and answers. The public [model-council skill](https://github.com/techczech/dominiks-agent-skills/tree/main/dev/model-council) gives the full method.

## Sister site

This is the sister site to [datapoints.semanticmachines.fyi](https://datapoints.semanticmachines.fyi), which collects small experiments with AI models: what was tested, on which models, and what happened. Research Snacks use AI to check claims about the world; Model Data Points check the models themselves.

## Check it yourself

[The public checking repository](https://github.com/techczech/research-snacks-data) holds the shareable data, code, methods and expected tables for each snack. Clone it and run the checks with uv. Each entry links to its own folder. Where a source licence prevents redistribution, the folder explains how to obtain the source yourself and what can be checked from the included aggregates. Each release is archived on Zenodo, so the data and code can be cited: [doi:10.5281/zenodo.24370344](https://doi.org/10.5281/zenodo.24370344) always points to the latest version.
