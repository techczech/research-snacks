#!/usr/bin/env python3
"""Token usage by model for one Claude Code session, including its subagents.
Usage: python3 scripts/session-usage.py <session.jsonl> [--since 2026-11-17T00:12]
Reads the session transcript and <session-id>/subagents/*.jsonl beside it. Prints a Markdown
table body (calls | tokens read | tokens written) per model. Tokens read = input + cache read
+ cache write. Prints nothing private; the path stays on the command line."""
import collections, glob, json, os, sys

path = sys.argv[1]
SINCE = sys.argv[3] if len(sys.argv) > 3 and sys.argv[2] == "--since" else ""  # ISO time, e.g. 2026-11-17T00:12
files = [path] + sorted(glob.glob(os.path.join(path[:-6], "subagents", "*.jsonl")))
tot = collections.defaultdict(collections.Counter)
for f in files:
    seen = set()
    for line in open(f, encoding="utf-8"):
        try:
            d = json.loads(line)
        except ValueError:
            continue
        if SINCE and (d.get("timestamp") or "") < SINCE:
            continue
        m = d.get("message") or {}
        if d.get("type") != "assistant" or not isinstance(m, dict) or not m.get("usage") or m.get("id") in seen:
            continue
        seen.add(m.get("id"))
        u, c = m["usage"], tot[m.get("model", "?")]
        c["calls"] += 1
        c["read"] += sum(u.get(k, 0) or 0 for k in ("input_tokens", "cache_read_input_tokens", "cache_creation_input_tokens"))
        c["written"] += u.get("output_tokens", 0) or 0
for model, c in sorted(tot.items(), key=lambda kv: -kv[1]["read"]):
    print(f"{model} | {c['calls']} | {c['read']:,} | {c['written']:,}")
