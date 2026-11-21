---
title: Blind front-page options scoring packet
date: 2026-11-21
mode: score
register: FOR AGENTS
---

Purpose: choose an evidence check to read, as an outside field expert without knowledge of AI or earlier author posts. Three journeys: first shared link visit; returning RSS reader; subject seeker (linguistics or economic history).

Owner priorities: dense and scannable, sober cream publication, plain heading, no hero or slogan, one header bar, content on first screen, existing dlnet-style search unchanged. Primary width 950px; also 1440px and 390px. Entry pages and their left contents sidebar are outside this redesign. Bigger type and more empty space are not goals. Keep all ten entries and their canonical URLs. No production deployment is authorised at this stage.

Subjects are coded P, Q and R. Do not infer a preferred answer. Evaluate only visible evidence and the measured checks. Each file prefix has 950px, 1440px and 390px screenshots in the shared directory; -950-full.png has the whole page. Open the screenshots with view_image. Do not read implementer notes or production source.

- P: prefix live. Existing chronological feed, raw claims and verdicts, current categories 4 Linguistics / 1 History / 5 fallback Research.
- Q: prefix a-latest. Chronological Question/Finding rows with in-place subject filtering; 4 Linguistics / 5 Economic history / 1 Political change. On phone each row stacks. Planning cost half a day including checks. Gives up raw claim quotations and full tag lists on the front page; they stay in entries.
- R: prefix b-subjects. Three subject sections with Question/Finding cards and subject jump links; top strip links to latest three entries. Same groups. Planning cost half a day including checks. Gives up one chronological sequence and repeats the three recent links.

Screenshots directory: supplied at dispatch; research-snacks/2026-11-21-review-front-page-options.images in the review records folder.

Measured evidence: all three have no horizontal page overflow at 950/1440/390; visible minimum text 16px. Q and R retain all ten unique canonical entry links; no overflow at 200% text at 950 or 390. Q filters 4/5/1, All restores ten, Back restores prior subject, unknown subject shows all. R subject links reach the correct section. All ten entries remain with JavaScript off (Q uses grouped fallback, R retains its sections). Mockup Search links open the existing search page rather than reimplementing its dialog. The eventual build must reuse the original dialog and shell; these prototypes do not prove shell integration.

Rubric, 1–10, equal weight:
1. Purpose and outsider comprehension. 3 = unclear who this is for or what an item offers; 6 = understandable after reading several entries; 9 = purpose and offer clear from first screen, no prior context needed.
2. Scan and choose a relevant check. 3 = categories hide real content or repeated prose blocks comparison; 6 = usable routes, some scanning effort; 9 = topic and question/finding structure supports quick choice at 950 and phone, without reducing text size.
3. Return for new work while preserving access. 3 = newest work or reading routes disappear; 6 = latest route available with extra effort; 9 = dates, latest work, RSS and entry routes are obvious, and subject navigation has a clear way back.

Return JSON: seat, scores [{subject, criteria:[{id:1,score,reason},{id:2,...},{id:3,...}], overall, strongest_objection}], pairwise {winner,reason}, missing_evidence. Overall is the mean of the three criteria. Include a concrete screenshot location for any defect. Score every criterion for P/Q/R. Do not edit the options, give a production readiness verdict or ask the owner questions. These are two same-model independent seats, not user testing.
