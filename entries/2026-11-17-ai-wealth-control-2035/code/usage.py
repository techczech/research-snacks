#!/usr/bin/env python3
"""Export content-free Codex usage events for the site's Claude usage reporter.
Codex input_tokens includes cached_input_tokens: never add the latter again.
"""
import argparse, json
from pathlib import Path
p=argparse.ArgumentParser()
p.add_argument('transcript',type=Path)
p.add_argument('--output',type=Path,required=True)
a=p.parse_args(); a.output.mkdir(parents=True,exist_ok=True)
model='unknown'; previous={'input_tokens':0,'output_tokens':0}; rows=[]; snapshot=None; start=None
for line in a.transcript.open():
 d=json.loads(line); payload=d.get('payload',{})
 if d.get('type')=='session_meta':start=d.get('timestamp')
 if d.get('type')=='turn_context':model=payload.get('model',model)
 if d.get('type')!='event_msg' or payload.get('type')!='token_count':continue
 info=payload.get('info') or {}; total=info.get('total_token_usage')
 if not total:continue
 if all(total.get(k,0)==previous.get(k,0) for k in previous):continue
 delta={k:total.get(k,0)-previous[k] for k in previous}
 if any(v<0 for v in delta.values()):raise ValueError('Usage counter reset; manual reconciliation needed')
 previous={k:total.get(k,0) for k in previous}
 rows.append({'type':'assistant','timestamp':d.get('timestamp'),'message':{'id':f'usage-{len(rows)+1}','model':model,'usage':delta}})
 snapshot={'model':model,'calls':len(rows),'tokens_read':total['input_tokens'],'tokens_written':total['output_tokens'],'cached_input_tokens_subset':total.get('cached_input_tokens'),'started_at':start,'through':d.get('timestamp'),'scope':'Current Codex research run through this snapshot; cached input is included, not added again; output includes reasoning; later publication work excluded.'}
(a.output/'usage-events.jsonl').write_text(''.join(json.dumps(r)+'\n' for r in rows))
(a.output/'usage-snapshot.json').write_text(json.dumps(snapshot,indent=2)+'\n')
print(json.dumps(snapshot,indent=2))
