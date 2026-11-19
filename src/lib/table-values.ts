// Presentation comparators: the displayed source string is never rewritten.
export function tableValue(value:string):number|null {
  const s=value.trim().replaceAll('−','-').replace(/\s+/g,' ');
  if(!s || /^[—–-]$/.test(s))return null;
  const iso=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if(iso)return Date.UTC(+iso[1],+iso[2]-1,+iso[3]);
  const months=['january','february','march','april','may','june','july','august','september','october','november','december'];
  const date=/^(\d{1,2})\s+([A-Za-z]+)(?:\s+(\d{4}))?$/.exec(s);
  if(date){const m=months.findIndex(x=>x===date[2].toLowerCase()||x.slice(0,3)===date[2].toLowerCase());if(m>=0)return Date.UTC(date[3]?+date[3]:2000,m,+date[1]);}
  const range=/^(\d{4})(?:\s*[–—-]\s*\d{2,4}|s)$/.exec(s);
  if(range)return +range[1];
  const n=/^(\()?\s*[£$€¥]?\s*([-+]?\d[\d,]*(?:\.\d+)?)\s*(%|billion|million|thousand|[kmb])?\s*\)?$/i.exec(s);
  if(n){const unit=(n[3]||'').toLowerCase();return Number(n[2].replaceAll(',',''))*(n[1]?-1:1)*(/^(b|billion)$/.test(unit)?1e9:/^(m|million)$/.test(unit)?1e6:/^(k|thousand)$/.test(unit)?1e3:1);}
  return null;
}
export const isNumericText=(s:string)=>/^\(?\s*[-+−£$€¥]?\s*\d[\d,.]*\s*(?:%|billion|million|thousand|[kmb])?\s*\)?$/i.test(s.trim());
export const isShortCode=(s:string)=>/^(?:\d{4}(?:\s*[–—-]\s*\d{2,4}|s)?|\d{1,2} [A-Za-z]+(?: \d{4})?|[A-Z][A-Z0-9_-]{1,7})$/.test(s.trim());
