import { test, expect } from 'bun:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const script = resolve(import.meta.dir, '../scripts/agent-usage.py');
const jsonl = (rows: object[]) => rows.map(r => JSON.stringify(r)).join('\n') + '\n';

function run(args: string[], codexRoot: string) {
  const out = Bun.spawnSync(['python3', '-I', script, ...args, '--json'], {
    env: { ...process.env, AGENT_USAGE_CODEX_ROOTS: codexRoot },
  });
  expect(out.stderr.toString()).toBe('');
  return JSON.parse(out.stdout.toString());
}

test('Claude session: dedupes on message id, adds subagents with their description', () => {
  const dir = mkdtempSync(join(tmpdir(), 'agent-usage-'));
  try {
    const usage = { input_tokens: 2, cache_read_input_tokens: 100, cache_creation_input_tokens: 10, output_tokens: 5 };
    const msg = (id: string, ts: string, extra = {}) => ({ type: 'assistant', timestamp: ts, sessionId: 'S1',
      message: { id, model: 'claude-sonnet-5-5', usage: { ...usage, ...extra } } });
    writeFileSync(join(dir, 'S1.jsonl'), jsonl([
      { type: 'custom-title', customTitle: 'Main review' },
      msg('m1', '2026-11-22T10:00:00Z'), msg('m1', '2026-11-22T10:00:01Z'), msg('m2', '2026-11-22T11:00:00Z'),
      { type: 'assistant', timestamp: '2026-11-22T11:00:02Z', message: { id: 'x', model: '<synthetic>', usage } },
    ]));
    mkdirSync(join(dir, 'S1', 'subagents'), { recursive: true });
    writeFileSync(join(dir, 'S1', 'subagents', 'agent-a1.jsonl'), jsonl([
      msg('s1', '2026-11-22T10:30:00Z', { output_tokens_details: { thinking_tokens: 3 } }),
    ]));
    writeFileSync(join(dir, 'S1', 'subagents', 'agent-a1.meta.json'), JSON.stringify({ description: 'Check sources' }));

    const res = run([join(dir, 'S1.jsonl')], dir);
    expect(res.rows.map((r: any) => [r.agent, r.calls, r.cached_read, r.reasoning])).toEqual([
      ['Main review', 2, 200, null], ['Check sources', 1, 100, 3]]);
    expect(res.rows[0].not_recorded).toEqual(['claude-reasoning']);
    expect(res.total.total).toBe(3 * 117);
    expect(res.subtotals[0].agent).toBe('Subtotal claude-sonnet-5-5');
    expect(run([join(dir, 'S1.jsonl'), '--since', '2026-11-22T10:15'], dir).total.calls).toBe(2);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('Codex rollouts: per-response records, cumulative fallback and child link', () => {
  const root = mkdtempSync(join(tmpdir(), 'agent-usage-'));
  try {
    const day = join(root, '2026', '11', '22');
    mkdirSync(day, { recursive: true });
    const meta = (id: string, extra = {}) => ({ type: 'session_meta', timestamp: '2026-11-22T08:00:00Z',
      payload: { id, cwd: '/x/research-snacks', creator_account_id: 'acct-secret', ...extra } });
    const u = (input: number, cached: number, out: number, reasoning: number) => ({ input_tokens: input,
      cached_input_tokens: cached, cache_write_input_tokens: 0, output_tokens: out, reasoning_output_tokens: reasoning });
    const rec = (thread: string, resp: string, ts: string, usage: object) => ({ type: 'token_usage_record',
      timestamp: ts, payload: { thread_id: thread, turn_id: 't1', response_id: resp, usage } });
    const count = (ts: string, total: object) => ({ type: 'event_msg', timestamp: ts,
      payload: { type: 'token_count', info: { total_token_usage: total } } });
    const turn = { type: 'turn_context', timestamp: '2026-11-22T08:00:01Z', payload: { turn_id: 't1', model: 'gpt-6.1-sol' } };

    const parent = join(day, 'rollout-2026-11-22T08-00-00-P.jsonl');
    writeFileSync(parent, jsonl([meta('P'), turn,
      rec('P', 'r1', '2026-11-22T08:01:00Z', u(100, 60, 10, 4)),
      rec('P', 'r1', '2026-11-22T08:01:00Z', u(100, 60, 10, 4)),
      rec('P', 'r2', '2026-11-22T08:02:00Z', u(200, 150, 20, 5)),
      count('2026-11-22T08:02:01Z', u(300, 210, 30, 9))]));
    writeFileSync(join(day, 'rollout-2026-11-22T08-05-00-C.jsonl'), jsonl([
      meta('C', { parent_thread_id: 'P', forked_from_id: 'P', agent_path: '/root/source_check', agent_nickname: 'Avicenna' }),
      meta('P'), turn, rec('C', 'r3', '2026-11-22T08:06:00Z', u(50, 40, 5, 1)),
      rec('P', 'r1', '2026-11-22T08:01:00Z', u(100, 60, 10, 4))]));
    const old = join(day, 'rollout-2026-11-22T09-00-00-O.jsonl');
    writeFileSync(old, jsonl([meta('O'), turn, count('2026-11-22T09:01:00Z', u(100, 50, 10, 2)),
      count('2026-11-22T09:02:00Z', u(250, 150, 30, 6))]));

    const res = run([parent], root);
    expect(res.rows.map((r: any) => [r.agent, r.calls, r.input_uncached, r.cached_read, r.reasoning, r.output, r.total]))
      .toEqual([['research-snacks', 2, 90, 210, 9, 30, 330], ['Source check (Avicenna)', 1, 10, 40, 1, 5, 55]]);
    expect(JSON.stringify(res)).not.toContain('acct-secret');

    const cum = run([old, '--no-children'], root).rows[0];
    expect([cum.calls, cum.input_uncached, cum.cached_read, cum.output, cum.total]).toEqual([null, 100, 150, 30, 280]);
    const later = run([old, '--since', '2026-11-22T09:01:30Z'], root).rows[0];
    expect([later.input_uncached, later.cached_read, later.output]).toEqual([50, 100, 20]);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
