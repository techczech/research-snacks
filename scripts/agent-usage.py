#!/usr/bin/env python3
"""Token usage per agent instance for a Research Snack run, across Claude Code and Codex.

Usage (run as `python3 -I` from outside the data folders):
  python3 -I scripts/agent-usage.py [PATH ...] [--t3-thread TITLE_OR_ID ...]
      [--since ISO] [--until ISO] [--label ID_OR_PATH=TEXT ...] [--no-children]
      [--json [--selection "how the instances were found"]]

PATH is a Claude Code session transcript (its <session-id>/subagents/*.jsonl are added), a
single Claude subagent transcript, or a Codex rollout (rollout-*.jsonl). Codex child rollouts
(session_meta parent_thread_id or forked_from_id) are added unless --no-children.
--t3-thread resolves a T3 Code thread (exact id or title substring) through T3's state
database, opened read-only, to its provider sessions and its subagent and delegated threads.

Prints one Markdown table row per agent instance and model, per-model subtotals and a total.
--json prints the same rows for a data package. Nothing private is printed: no prompts,
content, file paths, account or user ids. Standard library only."""
import argparse, datetime as dt, glob, json, os, sqlite3, sys, urllib.parse

HOME = os.path.expanduser("~")
CODEX_ROOTS = [os.path.join(HOME, ".codex-t3", "sessions"), os.path.join(HOME, ".codex", "sessions")]
CLAUDE_ROOTS = [os.path.join(HOME, ".claude_personal", "projects"), os.path.join(HOME, ".claude", "projects")]
T3_DB = os.path.join(HOME, ".t3", "userdata", "statev2.sqlite")
FIELDS = ["calls", "input_uncached", "cached_read", "cache_write", "reasoning", "output", "total"]
HEAD = ["Agent", "Harness", "Model", "Calls", "Input (uncached)", "Cached read", "Cache write",
        "Reasoning", "Output", "Total"]
NR_REASONS = {
    "claude-reasoning": "Claude Code folds thinking into Output; this transcript has no separate thinking count.",
    "codex-calls": "this Codex rollout has only cumulative totals (no per-response records), so calls are not counted.",
    "no-record": "this harness keeps no token record that can be read here.",
}


def parse_time(s):
    if not s:
        return None
    t = dt.datetime.fromisoformat(s.replace("Z", "+00:00"))
    return t if t.tzinfo else t.replace(tzinfo=dt.timezone.utc)


def in_window(ts, since, until):
    t = parse_time(ts) if ts else None
    if t is None:
        return not (since or until)
    return (not since or t >= since) and (not until or t <= until)


def forbidden(path):
    p = os.path.realpath(path)
    return "/.codex-enterprise" in p or "/.claude_enterprise" in p


def read_jsonl(path):
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            try:
                yield json.loads(line)
            except ValueError:
                continue


def first_line(path):
    with open(path, encoding="utf-8") as fh:
        try:
            return json.loads(fh.readline() or "{}")
        except ValueError:
            return {}


def is_codex(path):
    return first_line(path).get("type") == "session_meta"


# ---------- Claude Code ----------

def claude_label(path):
    meta = path[:-6] + ".meta.json"
    if os.path.exists(meta):
        with open(meta, encoding="utf-8") as fh:
            m = json.load(fh)
        return m.get("description") or m.get("agentType") or "Claude subagent"
    title = cwd = None
    for d in read_jsonl(path):
        if d.get("type") == "custom-title" and d.get("customTitle"):
            title = d["customTitle"]
        cwd = cwd or d.get("cwd")
    return title or (os.path.basename(cwd) if cwd else "Claude Code session")


def claude_rows(path, since, until):
    """One row per model; dedupe on message.id (one message can span several lines)."""
    seen, by_model, start, end, sid = set(), {}, None, None, None
    for d in read_jsonl(path):
        m = d.get("message")
        if d.get("type") != "assistant" or not isinstance(m, dict) or not m.get("usage"):
            continue
        if m.get("model") in (None, "<synthetic>") or m.get("id") in seen:
            continue
        if not in_window(d.get("timestamp"), since, until):
            continue
        seen.add(m.get("id"))
        sid = sid or d.get("agentId") or d.get("sessionId")
        u = m["usage"]
        r = by_model.setdefault(m["model"], dict.fromkeys(FIELDS, 0) | {"_think_missing": 0})
        r["calls"] += 1
        r["input_uncached"] += u.get("input_tokens") or 0
        r["cached_read"] += u.get("cache_read_input_tokens") or 0
        r["cache_write"] += u.get("cache_creation_input_tokens") or 0
        r["output"] += u.get("output_tokens") or 0
        think = (u.get("output_tokens_details") or {}).get("thinking_tokens")
        if think is None:
            r["_think_missing"] += 1
        else:
            r["reasoning"] += think
        ts = d.get("timestamp")
        start = min(start or ts, ts) if ts else start
        end = max(end or ts, ts) if ts else end
    rows = []
    for model, r in by_model.items():
        r["total"] = r["input_uncached"] + r["cached_read"] + r["cache_write"] + r["output"]
        nr = []
        if r.pop("_think_missing"):
            r["reasoning"], nr = None, ["claude-reasoning"]
        rows.append(dict(harness="Claude Code", model=model, start=start, end=end,
                         instance_id=sid or os.path.basename(path)[:-6], nr=nr, **r))
    return rows


def claude_files(path):
    """A main session plus its subagents; a subagent file on its own."""
    if os.path.basename(os.path.dirname(path)) == "subagents":
        return [path]
    return [path] + sorted(glob.glob(os.path.join(path[:-6], "subagents", "*.jsonl")))


# ---------- Codex ----------

def codex_meta(path):
    d = first_line(path)
    return d.get("payload") or {} if d.get("type") == "session_meta" else {}


def codex_label(meta):
    if meta.get("agent_path"):
        base = meta["agent_path"].rstrip("/").rsplit("/", 1)[-1].replace("_", " ").capitalize()
        return f"{base} ({meta['agent_nickname']})" if meta.get("agent_nickname") else base
    if meta.get("thread_source") == "guardian_review":
        return "Codex auto-review"
    return os.path.basename(meta.get("cwd") or "") or "Codex session"


def codex_rows(path, since, until):
    meta = codex_meta(path)
    own = meta.get("id")
    turn_model, model_now = {}, None
    recs, counts = {}, []
    for d in read_jsonl(path):
        t, p = d.get("type"), d.get("payload") or {}
        if t == "turn_context":
            model_now = p.get("model") or model_now
            if p.get("turn_id"):
                turn_model[p["turn_id"]] = model_now
        elif t == "event_msg" and p.get("type") == "thread_settings_applied":
            model_now = model_now or (p.get("thread_settings") or {}).get("model")
        elif t == "token_usage_record" and p.get("thread_id") == own and p.get("usage"):
            # per-response usage (includes compaction calls, which token_count omits)
            recs[p.get("response_id")] = (d.get("timestamp"), p.get("turn_id"), p["usage"], model_now)
        elif t == "event_msg" and p.get("type") == "token_count" and (p.get("info") or {}).get("total_token_usage"):
            counts.append((d.get("timestamp"), p["info"]["total_token_usage"], model_now))

    def add(r, u, sign=1):
        cached, write = u.get("cached_input_tokens") or 0, u.get("cache_write_input_tokens") or 0
        r["input_uncached"] += sign * ((u.get("input_tokens") or 0) - cached - write)
        r["cached_read"] += sign * cached
        r["cache_write"] += sign * write
        r["reasoning"] += sign * (u.get("reasoning_output_tokens") or 0)
        r["output"] += sign * (u.get("output_tokens") or 0)

    by_model, nr, stamps = {}, [], []
    if recs:
        for ts, turn, u, m in recs.values():
            if not in_window(ts, since, until):
                continue
            model = turn_model.get(turn) or m or "?"
            r = by_model.setdefault(model, dict.fromkeys(FIELDS, 0))
            r["calls"] += 1
            add(r, u)
            stamps.append(ts)
    elif counts:
        # cumulative totals: the last count in the window minus the last count before it
        before = [c for c in counts if since and parse_time(c[0]) < since]
        inside = [c for c in counts if in_window(c[0], since, until)]
        if inside:
            model = inside[-1][2] or "?"
            r = by_model.setdefault(model, dict.fromkeys(FIELDS, 0))
            add(r, inside[-1][1])
            if before:
                add(r, before[-1][1], -1)
            r["calls"] = None
            nr = ["codex-calls"]
            stamps = [inside[0][0], inside[-1][0]]
    rows = []
    for model, r in by_model.items():
        r["total"] = r["input_uncached"] + r["cached_read"] + r["cache_write"] + r["output"]
        rows.append(dict(harness="Codex", model=model, start=min(stamps) if stamps else None,
                         end=max(stamps) if stamps else None, instance_id=own, nr=list(nr), **r))
    return rows


def codex_roots():
    return [r for r in (os.environ.get("AGENT_USAGE_CODEX_ROOTS", "").split(os.pathsep) if
                        os.environ.get("AGENT_USAGE_CODEX_ROOTS") else CODEX_ROOTS) if os.path.isdir(r)]


def all_rollouts():
    out = []
    for root in codex_roots():
        out += glob.glob(os.path.join(root, "*", "*", "*", "rollout-*.jsonl"))
    return [p for p in out if not forbidden(p)]


def codex_children(path, pool):
    """Rollouts whose session_meta names this rollout's id as parent_thread_id or forked_from_id."""
    own = codex_meta(path).get("id")
    if not own:
        return []
    kids = [(m.get("timestamp") or "", p) for p, m in pool
            if own in (m.get("parent_thread_id"), m.get("forked_from_id")) and m.get("id") != own]
    return [p for _, p in sorted(kids)]


def find_codex(native_id):
    for root in codex_roots():
        hits = glob.glob(os.path.join(root, "*", "*", "*", f"rollout-*{native_id}.jsonl"))
        if hits:
            return hits[0]
    return None


def find_claude(native_id):
    roots = os.environ.get("AGENT_USAGE_CLAUDE_ROOTS")
    for root in (roots.split(os.pathsep) if roots else CLAUDE_ROOTS):
        hits = glob.glob(os.path.join(root, "*", f"{native_id}.jsonl"))
        if hits:
            return hits[0]
    return None


# ---------- T3 ----------

def t3_instances(query, db_path):
    """[(label, harness, path or None)] for a T3 thread, its subagents and delegated threads."""
    con = sqlite3.connect(f"file:{urllib.parse.quote(db_path)}?mode=ro", uri=True)
    rows = con.execute("select thread_id, title from orchestration_v2_projection_threads "
                       "where thread_id = ? or lower(title) like ?", (query, f"%{query.lower()}%")).fetchall()
    exact = [r for r in rows if r[0] == query or (r[1] or "").lower() == query.lower()]
    rows = exact or rows
    if len(rows) != 1:
        sys.exit(f"--t3-thread {query!r} matched {len(rows)} threads: "
                 + "; ".join((r[1] or "?") for r in rows[:10]))
    out, todo, done = [], [rows[0]], set()
    while todo:
        tid, title = todo.pop(0)
        if tid in done:
            continue
        done.add(tid)
        label = title or tid
        if label.startswith("/root/"):
            label = label.rsplit("/", 1)[-1].replace("_", " ").capitalize()
        refs = []
        for (payload,) in con.execute("select payload_json from orchestration_v2_projection_provider_threads "
                                      "where thread_id = ?", (tid,)):
            p = json.loads(payload or "{}")
            ref = p.get("nativeThreadRef") or {}
            if "enterprise" in (p.get("providerInstanceId") or ""):
                continue
            if ref.get("nativeId"):
                refs.append((p.get("driver") or ref.get("driver"), ref["nativeId"]))
        for driver, nid in refs:
            if driver == "codex":
                out.append((label, "Codex", find_codex(nid)))
            elif driver == "claudeAgent":
                out.append((label, "Claude Code", find_claude(nid)))
            else:
                out.append((label, driver or "unknown", None))
        for child, in con.execute("select child_thread_id from orchestration_v2_projection_subagents "
                                  "where thread_id = ? order by started_at", (tid,)):
            if child and child not in done:
                t = con.execute("select thread_id, title from orchestration_v2_projection_threads "
                                "where thread_id = ?", (child,)).fetchone()
                todo.append(t or (child, None))
    con.close()
    return out


# ---------- assemble ----------

def collect(args):
    since, until = parse_time(args.since), parse_time(args.until)
    labels = dict(x.split("=", 1) for x in args.label)
    order, seen = [], set()

    def push(path, label=None, harness=None):
        if path is None:
            order.append((label, harness, None))
            return
        rp = os.path.realpath(path)
        if rp in seen or forbidden(rp):
            return
        seen.add(rp)
        order.append((label, "Codex" if is_codex(rp) else "Claude Code", rp))

    for q in args.t3_thread:
        for label, harness, path in t3_instances(q, args.t3_db):
            if path and harness == "Claude Code":
                for i, f in enumerate(claude_files(path)):
                    push(f, label if i == 0 else None)
            else:
                push(path, label, harness)
    for p in args.paths:
        if is_codex(p):
            push(p)
        else:
            for f in claude_files(p):
                push(f)
    if not args.no_children:
        pool = [(p, codex_meta(p)) for p in all_rollouts()]
        i = 0
        while i < len(order):
            label, harness, path = order[i]
            if path and harness == "Codex":
                new = [os.path.realpath(k) for k in codex_children(path, pool)]
                new = [k for k in new if k not in seen]
                seen.update(new)
                order[i + 1:i + 1] = [(None, "Codex", k) for k in new]
            i += 1

    rows = []
    for label, harness, path in order:
        if path is None:
            rows.append(dict(agent=label, harness=harness, model="n/r", instance_id=None, start=None, end=None,
                             nr=["no-record"], **dict.fromkeys(FIELDS)))
            continue
        if harness == "Codex":
            got = codex_rows(path, since, until)
            name = label or codex_label(codex_meta(path))
        else:
            got = claude_rows(path, since, until)
            name = label or claude_label(path)
        for r in got:
            r["agent"] = labels.get(r["instance_id"]) or labels.get(path) or name
            rows.append(r)
    return rows


def fmt(v):
    return "n/r" if v is None else f"{v:,}"


def summarise(rows):
    def sumrows(rs, agent, model):
        out = dict(agent=agent, harness="", model=model)
        for f in FIELDS:
            vals = [r[f] for r in rs if r[f] is not None]
            out[f] = sum(vals) if vals else None
        return out
    models = {}
    for r in rows:
        if r["model"] != "n/r":
            models.setdefault(r["model"], []).append(r)
    subs = [sumrows(rs, f"Subtotal {m}", m) for m, rs in models.items() if len(rs) > 1]
    return subs, sumrows(rows, "Total", "")


def notes(rows):
    out = ["Input (uncached) excludes cached reads and cache writes. Total = input (uncached) + cached read + "
           "cache write + output. Reasoning is part of Output and is not added again. Totals add recorded values only."]
    if any(r["harness"] == "Codex" for r in rows):
        out.append("Codex reports input including cached tokens; uncached = input - cached read - cache write. "
                   "Codex calls are model responses, including context-compaction calls.")
    used = sorted({k for r in rows for k in r["nr"]})
    if used:
        out.append("n/r = not recorded: " + " ".join(NR_REASONS[k] for k in used))
    return out


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("paths", nargs="*")
    ap.add_argument("--t3-thread", action="append", default=[])
    ap.add_argument("--t3-db", default=T3_DB)
    ap.add_argument("--since")
    ap.add_argument("--until")
    ap.add_argument("--label", action="append", default=[], help="INSTANCE_ID_OR_PATH=TEXT")
    ap.add_argument("--no-children", action="store_true")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--selection", help="one sentence on how the instances were found (stored in --json)")
    args = ap.parse_args(argv)
    if not args.paths and not args.t3_thread:
        ap.error("give at least one transcript or rollout path, or --t3-thread")
    rows = collect(args)
    subs, total = summarise(rows)
    if args.json:
        keep = ["agent", "harness", "model", "instance_id", "start", "end"] + FIELDS
        print(json.dumps({"selection": args.selection, "since": args.since, "until": args.until,
                          "rows": [{k: r[k] for k in keep} | {"not_recorded": r["nr"]} for r in rows],
                          "subtotals": subs, "total": total, "notes": notes(rows)}, indent=2))
        return
    print("| " + " | ".join(HEAD) + " |")
    print("|" + "---|" * 3 + "---:|" * 7)
    for i, r in enumerate(rows + subs + [total]):
        bold = "**" if i >= len(rows) else ""
        cells = [r["agent"], r["harness"], r["model"]] + [fmt(r[f]) for f in FIELDS]
        print("| " + " | ".join(f"{bold}{c}{bold}" if c else "" for c in cells) + " |")
    print()
    for n in notes(rows):
        print(n)
        print()


if __name__ == "__main__":
    main()
