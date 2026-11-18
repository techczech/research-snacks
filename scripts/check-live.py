#!/usr/bin/env python3
"""Curl every public baseline path and the new feed/agent routes; reject soft-404 bodies."""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import subprocess
import sys
ROOT=Path(__file__).resolve().parent.parent
BASE=sys.argv[1].rstrip('/') if len(sys.argv)>1 else 'https://researchsnacks.semanticmachines.fyi'
manifest=(ROOT/'docs/urls-research-snacks-baseline.txt').read_text().splitlines()
# Pages consumes _headers as configuration; it has never been a served asset.
urls={('/'+p):p for p in manifest if p!='_headers'}
for p in (ROOT/'site').rglob('*'):
    if not p.is_file(): continue
    rel=str(p.relative_to(ROOT/'site'))
    if rel.endswith('index.html'):
        urls['/'+rel.removesuffix('index.html')]=rel
    elif rel.endswith('.md') or rel in ('rss.xml','llms.txt','search-index.json'):
        urls['/'+rel]=rel

def check(item):
    path,rel=item
    r=subprocess.run(['curl','--silent','--show-error','--location','--max-time','30','--retry','1','--user-agent','Mozilla/5.0 ResearchSnacksReleaseCheck','--write-out','\n__CHECK__%{http_code}|%{content_type}|%{url_effective}',BASE+path],capture_output=True)
    if r.returncode: return {'path':path,'ok':False,'error':r.stderr.decode(errors='replace')}
    body,meta=r.stdout.rsplit(b'\n__CHECK__',1)
    code,mime,effective=meta.decode().split('|',2)
    expected=(ROOT/'site'/rel).read_bytes()
    same=hashlib.sha256(body).digest()==hashlib.sha256(expected).digest()
    return {'path':path,'status':int(code),'mime':mime,'effective':effective,'matches_build':same,'ok':code=='200' and same}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool: results=list(pool.map(check,sorted(urls.items())))
failures=[r for r in results if not r['ok']]
report={'base':BASE,'count':len(results),'baseline_public_paths':len(manifest)-1,'failures':failures,'results':results}
out=ROOT/'.check';out.mkdir(exist_ok=True);(out/'live-check.json').write_text(json.dumps(report,indent=2)+'\n')
print(f'{"PASS" if not failures else "FAIL"}: {len(results)} URLs; {len(manifest)-1} baseline public paths; {len(failures)} failures. HTTP 200 and exact built bytes required.')
for r in failures: print(json.dumps(r))
raise SystemExit(bool(failures))
