---
title: Medicine comparison views — revision contract
date: 2026-11-22
register: FOR AGENTS
status: implementing author-requested changes; preview only
provenance: Author feedback on preview 1d145437, coordinator specification and supplied dataviz principles
---

# Purpose and reader

An interested reader must compare six selected medical routes on the same scale and identify what each bar or milestone means without reading six separate link lists. No prior knowledge of registration categories is assumed. The scientific interpretation and all 55 source-coded records remain unchanged. Data, public wording and rendering stay separate. No claim about causal competence or automatic GP credential award is added.

# Predecessor inventory

Keep: all three clocks; six routes; source passages/dates; exports; later-training control; full record access without JavaScript; dark/light/system themes; EU, GP-report and WHO context. Replace: repeated row axes, detached marker explanations, per-row link lists and the bottom-only evidence panel. Hidden family-training bars must hide their associated endpoint marker in both views. Optional manager/examination/embedded requirements remain in the full stage table rather than adding competing main tracks.

# Two views and direct labels

Training stages: six rows aligned to one header scale; desktop labels at left, phone labels above tracks. Bars label the stage and duration where space permits, with a numeric duration always visible. Registration markers share aligned thin lanes directly below the bars and use short direct labels. One legend covers four education/training colours and three marker shapes. No repeated per-row axes or long link lists.

Milestones: one row per jurisdiction on the same clock, using the identical first-registration, general-licence and family-training symbols. Coincident first/general registrations remain at exactly the same x value in separate thin lanes. The last point means training completion with local credential conditions, not automatic award. An additional alignment mode is deliberately omitted: the two requested views answer distinct comparison questions without another clock definition.

The year scale stays visible in the chart's scrolling region. The host relays the visible iframe bounds so the header and popovers also remain within the parent page's visible area; no access to the parent DOM is granted to the opaque-origin tool.

# Detail journey

Mouse: hover a bar/marker to see stage, clock interval, permission/meaning, short primary-source links; moving onto the popover keeps it open. Keyboard focus provides the same information; Enter/Space pins it and focuses Close; Escape/Close returns to the trigger. Touch: tap pins the popover with an explicit Close control, usable source links and a full-record link. Outside tap closes it. No hover-only value: bars/markers retain visible years and all values/meaning/source passages remain in one collapsed All stages and sources table.

All record/permission labels are explicit display annotations keyed by stage ID, not inferred from natural-language notes. Popover source links open separately. Native popovers are enhanced with a small inline fixed-panel fallback; no dependency is added.

# Acceptance checks

- All six routes, three clocks and both views preserve the exact numeric positions; same year means same x coordinate across every country.
- One axis; no timeline/document sideways overflow at 390, 728, 1024 and 1400 px; header remains visible on chart and parent scrolling.
- Mouse, keyboard and touch can open, inspect and close details, follow sources and reach a full record. View/clock/toggle changes close stale details.
- Later-training off removes its bars and endpoint markers in both views. No orphan family endpoint.
- All 55 original stages and 32 source records remain reachable without JavaScript. Data exports unchanged; EU context unchanged.
- Four chart colours plus neutral school encoding; shapes and direct labels carry meaning independently of colour. Check light/dark contrast, forced colours and 200% text.
- Fresh-clone deterministic data checks and tool reproduction; site check, full release check and targeted deployed-preview checks. Independent reviewer inspects actual current phone/desktop captures before handoff. No production deployment.
