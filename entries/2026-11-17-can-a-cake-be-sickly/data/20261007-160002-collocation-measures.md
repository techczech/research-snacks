---
title: Counts and association scores describe different aspects of sickly
date: '2026-10-07'
category: linguistics
tags:
- sickly
- corpus-linguistics
---

# Collocation measures

The exact-form window query uses five tokens on either side, lemma collocates, corpus frequency at least five, pair count at least two and a logDice-ranked cap of 100. BNC returns 100 candidates, including the node itself; the display excludes that self-collocate. OANC writing returns thirteen candidates. No extra sentence boundary was configured.

Every returned MI, T-score and logDice value was checked against its raw counts and corpus token total. BNC stench has three window co-occurrences but higher logDice than sweet, which has fifteen. Raw occurrence and association strength are distinct. Window co-occurrences are not modified-noun counts or independent documents.

Sources: `sources/corpus-bnc-window-collocations.json`, `sources/corpus-oanc-window-collocations.json`, [official formula specification](https://www.sketchengine.eu/wp-content/uploads/ske-statistics.pdf). Word sketches use relation-specific marginals and have a different denominator.
