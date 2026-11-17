#!/usr/bin/env python3
"""Export a public usage snapshot from this implementation's Codex JSONL transcript.
Usage: python3 session-usage-codex.py TRANSCRIPT.jsonl > repackaging-usage-sickly.json
The transcript itself is never copied. Input totals already include cached input.
Repeated token-count events with identical totals are counted once.
"""
from datetime import datetime
import json
import sys

first = cutoff = token_time = None
model = None
last = None
calls = 0
for line in open(sys.argv[1], encoding="utf-8"):
    d = json.loads(line)
    first = first or d.get("timestamp")
    cutoff = d.get("timestamp") or cutoff
    p = d.get("payload") or {}
    if d.get("type") == "turn_context":
        model = p.get("model") or model
    if d.get("type") == "event_msg" and p.get("type") == "token_count" and p.get("info"):
        current = p["info"].get("total_token_usage")
        if current and current != last:
            calls += 1
            last = current
            token_time = d.get("timestamp")
if not last or not model:
    raise SystemExit("No model and token usage events found; no estimate substituted")
parse = lambda s: datetime.fromisoformat(s.replace("Z", "+00:00"))
print(json.dumps({"model": model, "role": "Research Snack repackaging",
                  "session_started_utc": first, "snapshot_utc": cutoff,
                  "last_usage_event_utc": token_time,
                  "elapsed_seconds_to_snapshot": round((parse(cutoff) - parse(first)).total_seconds()),
                  "calls_with_recorded_usage": calls,
                  "tokens_read": last["input_tokens"],
                  "cached_input_tokens_included": last.get("cached_input_tokens", 0),
                  "tokens_written": last["output_tokens"],
                  "reasoning_output_tokens_included": last.get("reasoning_output_tokens", 0),
                  "scope": "Implementation session through this snapshot, including loaded instructions and cached history; excludes subsequent publication and live checks.",
                  "original_study": {"date": "2026-10-07", "tool_recorded": "Codex",
                                     "model_version": None, "calls": None, "tokens": None}}, indent=2))
