#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml", "markdown"]
# ///
"""Build site/ from entries/<id>/index.md. Run: uv run scripts/build-site.py"""
import re
import shutil
import sys
from datetime import date
from html import escape
from pathlib import Path

import markdown
import yaml

from kit.citation import citation_head, cite_block, surname_first

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://researchsnacks.semanticmachines.fyi"
SISTER = "https://datapoints.semanticmachines.fyi"
SM_HOME = "https://semanticmachines.fyi"
NAME = "Research Snacks"
TAGLINE = "Small research experiments with AI agents: how fast can a claim be checked?"
AUTHOR = "Dominik Lukeš"  # default; an entry may set author: (one name or a list)

REQUIRED = ["id", "title", "date", "claim", "claim_source", "verdict", "time_taken",
            "human_time", "tools", "data_sources", "summary"]
LISTS = ("tools", "data_sources")
# Private material must never ship: checked on every text file inside entries and on content/.
PRIVATE_PATH = re.compile(r"/Users/|~/|/home/|[A-Za-z]:\\\\")
EMAIL = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+")
HOSTNAME = re.compile(r"\b[\w-]+\.(local|lan|internal|home|localdomain)\b|\bmacbook[\w-]*\b|\bmac-?studio[\w-]*\b", re.I)
SCRIPT_URL = re.compile(r"(?i)javascript:|data:text/html")
TEXT_EXT = {".md", ".csv", ".py", ".txt", ".json", ".yaml", ".yml", ".tsv", ".html", ".sh"}
ENTRIES = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT / "entries"
CONTENT = ROOT / "content"
ID_RE = re.compile(r"^\d{4}-\d{2}-\d{2}-.+$")


def privacy_errors(path, label):
    errs = []
    try:
        text = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return errs
    for n, line in enumerate(text.splitlines(), 1):
        for rx, what in ((PRIVATE_PATH, "an absolute or home path"), (EMAIL, "an email address"),
                         (HOSTNAME, "a hostname"), (SCRIPT_URL, "a script URL")):
            m = rx.search(line)
            if m:
                errs.append(f"{label}:{n}: contains {what} ({m.group(0)!r}); private material cannot ship")
    return errs


def parse(folder):
    name = folder.name
    idx = folder / "index.md"
    if not idx.exists():
        return None, [f"{name}: no index.md"]
    text = idx.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n?(.*)$", text, re.S)
    if not m:
        return None, [f"{name}/index.md: no YAML frontmatter"]
    try:
        fm = yaml.safe_load(m.group(1))
    except yaml.YAMLError as err:
        return None, [f"{name}/index.md: invalid YAML ({err})"]
    if not isinstance(fm, dict):
        return None, [f"{name}/index.md: frontmatter is not a mapping"]
    errors = [f"{name}/index.md: missing required field '{k}'"
              for k in REQUIRED if k not in fm or fm[k] in (None, "", [])]
    if errors:
        return None, errors
    if fm["id"] != name:
        errors.append(f"{name}/index.md: id '{fm['id']}' does not match folder name '{name}'")
    if not ID_RE.match(str(fm["id"])):
        errors.append(f"{name}/index.md: id must look like YYYY-MM-DD-slug")
    if not isinstance(fm["date"], date):
        errors.append(f"{name}/index.md: date must be YYYY-MM-DD")
    for k in LISTS:
        if not isinstance(fm[k], list):
            errors.append(f"{name}/index.md: {k} must be a list")
    refs = fm.get("references") or []
    if not isinstance(refs, list) or any(not isinstance(r, dict) or not r.get("title") for r in refs):
        errors.append(f"{name}/index.md: references must be a list of mappings, each with a title")
    if not str(fm["claim_source"]).startswith("http"):
        errors.append(f"{name}/index.md: claim_source must be a URL starting with http")
    for f in sorted(folder.rglob("*")):
        if f.is_file() and f.suffix.lower() in TEXT_EXT:
            errors += privacy_errors(f, f"{name}/{f.relative_to(folder)}")
    fm["_body"] = m.group(2).strip()
    fm["_folder"] = folder
    return fm, errors


def e(x):
    return escape(str(x), quote=True)


def long_date(d):
    return f"{d.day} {d.strftime('%B %Y')}"


def nice_date(d):
    return f"{d.day} {d.strftime('%b %Y')}"


def first_paragraph(md_text):
    for para in re.split(r"\n\s*\n", md_text.strip()):
        p = para.strip()
        if p and not p.startswith("#"):
            return p
    return ""


BARE_URL = re.compile(r"(?<!\]\()(?<![\w/\[])(https?://[^\s)\]]+?)([.,;:]?)(?=\s|$|\))")


def render_md(text, folder=None):
    # raw HTML in Markdown is escaped, as on the sister site
    text = text.replace("&", "&amp;").replace("<", "&lt;")
    # every bare URL becomes a link (skips URLs already inside [text](url))
    text = BARE_URL.sub(lambda m: f"[{m.group(1)}]({m.group(1)}){m.group(2)}", text)
    html = markdown.markdown(text, extensions=["tables", "fenced_code", "toc"])
    # right-align cells that hold numbers (counts, years, percentages, dashes)
    html = re.sub(r"<(td|th)>([−\-–+]?[\d,.]+%?(?: \(\d{4}\))?|–|0)</\1>", r'<\1 class="num">\2</\1>', html)
    # make every image open the full-size file on click
    html = re.sub(r'<img ([^>]*?)src="([^"]+)"([^>]*?)/?>',
                  r'<a class="imglink" href="\2"><img \1src="\2"\3 loading="lazy"></a>', html)
    html = re.sub(r"<p>(<a class=\"imglink\".*?</a>)</p>", r"\1", html, flags=re.S)
    if folder is not None:
        html = re.sub(r'<a class="imglink" href="(charts/([^"/]+))\.png"><img [^>]*?alt="([^"]*)"[^>]*></a>',
                      lambda m: interactive_figure(folder, m) or m.group(0), html)
    return html


VEGA = ('<script src="https://cdn.jsdelivr.net/npm/vega@5.30.0"></script>'
        '<script src="https://cdn.jsdelivr.net/npm/vega-lite@5.21.0"></script>'
        '<script src="https://cdn.jsdelivr.net/npm/vega-embed@6.26.0"></script>'
        """<script>document.querySelectorAll('.vl[data-spec]').forEach(function(el){fetch(el.dataset.spec).then(function(r){return r.json()})
.then(function(spec){return vegaEmbed(el,spec,{renderer:'svg',actions:{export:true,source:false,compiled:false,editor:true},
downloadFileName:el.dataset.name})}).then(function(){el.closest('figure').classList.add('live')}).catch(function(){})});</script>""")


def interactive_figure(folder, m):
    """charts/NAME.png with charts/NAME.vl.json beside it: an interactive Vega-Lite chart, its data as CSV,
    and the PNG as the fallback (no JavaScript) and as the static download."""
    path, name, alt = m.group(1), m.group(2), m.group(3)
    html_card = folder / "charts" / f"{name}.html"
    if html_card.exists():  # an HTML infographic written for the entry; the PNG stays for sharing
        return (f'<figure class="infographic" aria-label="{alt}">{html_card.read_text(encoding="utf-8")}'
                f'<figcaption><a href="{path}.png">Image (PNG)</a></figcaption></figure>')
    if not (folder / "charts" / f"{name}.vl.json").exists():
        return None
    links = [f'<a href="charts/{name}.csv" download>Data (CSV)</a>'] if (folder / "charts" / f"{name}.csv").exists() else []
    links += [f'<a href="{path}.png">Image (PNG)</a>', f'<a href="charts/{name}.vl.json">Chart spec (Vega-Lite)</a>']
    return (f'<figure class="ichart"><div class="vl" data-spec="charts/{name}.vl.json" data-name="{name}" role="img" aria-label="{alt}"></div>'
            f'<img class="fallback" src="{path}.png" alt="{alt}" loading="lazy">'
            f'<figcaption>Interactive: hover for numbers; click the legend to pick a group; ⋯ menu saves SVG or PNG. '
            f'{" · ".join(links)}</figcaption></figure>')


def slug(t):
    return re.sub(r"[^a-z0-9]+", "-", re.sub(r"<[^>]+>", "", t).lower()).strip("-") or "section"


def with_toc(main_html, title):
    """Give every h2/h3 an id and lay the page out with a sticky contents sidebar
    (a collapsible list above the text on narrow screens)."""
    items, used = [], set()

    def add_id(m):
        tag, attrs, inner = m.group(1), m.group(2) or "", m.group(3)
        idm = re.search(r'id="([^"]+)"', attrs)
        hid = idm.group(1) if idm else slug(inner)
        while hid in used:
            hid += "-2"
        used.add(hid)
        if not idm:
            attrs += f' id="{hid}"'
        items.append((tag, hid, re.sub(r"<[^>]+>", "", inner)))
        return f"<{tag}{attrs}>{inner}</{tag}>"
    main_html = re.sub(r"<(h2|h3)((?:\s[^>]*)?)>(.*?)</\1>", add_id, main_html, flags=re.S)
    if len(items) < 3:
        return f'<main class="wrap entry" style="padding-top:40px">{main_html}</main>'
    groups = []
    for t, h, text in items:
        if t == "h2" or not groups:
            groups.append([(h, text, "making" if text == "How this was made" else ""), []])
        else:
            groups[-1][1].append((h, text))
    lis = "".join(
        f'<li class="h2 {cls}"><a href="#{h}">{text}</a>'
        + ("<ol>" + "".join(f'<li class="h3"><a href="#{sh}">{st}</a></li>' for sh, st in subs) + "</ol>" if subs else "")
        + "</li>" for (h, text, cls), subs in groups)
    nav = f'<li class="h2 top"><a href="#top">{e(title)}</a></li>{lis}'
    return f"""<div class="wrap withtoc" id="top">
<aside class="toc"><nav aria-label="Contents"><div class="toc-h">Contents</div><ol>{nav}</ol></nav></aside>
<details class="toc-m"><summary>Contents</summary><ol>{nav}</ol></details>
<main class="entry">{main_html}</main></div>
<script>(function(){{var l=[].slice.call(document.querySelectorAll('.toc a[href^="#"]'));var m={{}};l.forEach(function(a){{m[a.getAttribute('href').slice(1)]=a}});
var hs=[].slice.call(document.querySelectorAll('main.entry h2[id],main.entry h3[id]'));function on(){{var cur=null;hs.forEach(function(h){{if(h.getBoundingClientRect().top<120)cur=h.id}});
l.forEach(function(a){{a.classList.remove('on')}});document.querySelectorAll('.toc li.h2').forEach(function(li){{li.classList.remove('open')}});
if(cur&&m[cur]){{m[cur].classList.add('on');var g=m[cur].closest('li.h2');if(g)g.classList.add('open');}}}}addEventListener('scroll',on,{{passive:true}});on();
document.querySelectorAll('.toc-m a').forEach(function(a){{a.addEventListener('click',function(){{a.closest('details').open=false}})}});}})();</script>"""


import hashlib
# version stamp so browsers fetch the new stylesheet after every change
CSS_V = hashlib.sha1((ROOT / "scripts/assets/style.css").read_bytes()).hexdigest()[:8]


def page(title, body, desc, nav_on="", extra_head="", citation=None):
    citation = citation or {"title": title, "url": BASE + ("/about/" if nav_on == "about" else "/"),
                            "site": NAME, "authors": [AUTHOR]}
    def a(key, href, label):
        return f'<a{" class=on" if nav_on == key else ""} href="{href}">{label}</a>'
    nav = a("entries", "/", "Entries") + a("about", "/about/", "About") + f'<a href="{SISTER}">Model Data Points</a>'
    return f"""<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>{e(title)}</title><meta name="description" content="{e(desc)}"><link rel="canonical" href="{e(citation["url"])}">{citation_head(citation)}{extra_head}<link rel="stylesheet" href="/style.css?v={CSS_V}"></head><body><header class="site"><div class="wrap"><a class="logo" href="/"><b>RS</b><span>{NAME}</span></a>
<nav class="main">{nav}</nav></div></header>
{body}
<footer><div class="wrap"><p>{NAME} · researchsnacks.semanticmachines.fyi · Sister site: <a href="{SISTER}">Model Data Points</a> (datapoints.semanticmachines.fyi) · <a href="{SM_HOME}">Semantic Machines</a></p>
<p>Content CC BY 4.0, code MIT. Data citations are in each entry.</p></div></footer></body></html>
"""


def index_page(entries, intro):
    cards = []
    for x in entries:
        cards.append(
            f'<a class="card" href="/{e(x["id"])}/"><div class="meta"><span>{nice_date(x["date"])}</span></div>'
            f'<h3>{e(x["title"])}</h3><p class="claim">&ldquo;{e(x["claim"])}&rdquo;</p>'
            f'<p class="verdict"><b>Verdict:</b> {e(x["verdict"])}</p>'
            f'<div class="tt"><b>Time taken:</b> {e(x["time_taken"])}</div>'
            f'<p>{e(x["summary"])}</p></a>')
    body = f"""<section class="hero"><div class="wrap"><h1>{NAME}</h1>
<p class="tagline">{e(TAGLINE)}</p>
<div class="intro">{render_md(intro) if intro else ""}</div></div></section>
<main class="wrap"><h2 class="sec">Entries</h2><div class="list">{"".join(cards)}</div></main>"""
    return page(NAME, body, TAGLINE, "entries")


def linkify(s):
    s = str(s)
    return f'<a href="{e(s)}">{e(s)}</a>' if s.startswith("http") else e(s)


# ---- references: formatted text and a separate RIS download ----
def names(v):
    return [v] if isinstance(v, str) else list(v or [])


def references_ris(refs):
    """Export the reference dictionaries without competing with page metadata."""
    types = {"article": "JOUR", "report": "RPRT", "dataset": "DATA",
             "webpage": "ELEC", "post": "ELEC", "video": "VIDEO"}
    records = []
    for ref in refs:
        lines = []

        def add(tag, value):
            if value is not None and str(value).strip():
                # RIS fields occupy one line; YAML folded/literal values must not create records.
                lines.append(f"{tag}  - {' '.join(str(value).splitlines()).strip()}")

        add("TY", types.get(ref.get("type", "webpage"), "ELEC"))
        for author in names(ref.get("authors")):
            add("AU", author if ref.get("corporate") else surname_first(author))
        add("TI", ref["title"])
        add("T2", ref.get("container"))
        published = str(ref.get("date") or ref.get("year") or "")
        add("PY", published[:4])
        if ref.get("date"):
            add("DA", published.replace("-", "/"))
        for tag, key in (("VL", "volume"), ("IS", "issue"), ("PB", "publisher"),
                         ("CY", "place"), ("UR", "url"), ("DO", "doi"), ("N1", "note")):
            add(tag, ref.get(key))
        if ref.get("pages"):
            pages = re.split(r"[–—-]", str(ref["pages"]), maxsplit=1)
            add("SP", pages[0])
            if len(pages) == 2:
                add("EP", pages[1])
        lines.append("ER  - ")
        records.append("\n".join(lines))
    return "\n\n".join(records) + "\n"


def cite_text(ref):
    aus = names(ref.get("authors"))
    if ref.get("corporate") or not aus:
        who = ", ".join(aus) or ref.get("publisher", "")
    else:
        aus = [surname_first(aus[0])] + aus[1:]
        who = aus[0] if len(aus) == 1 else ", ".join(aus[:-1]) + " and " + aus[-1]
    yr = str(ref.get("year") or str(ref.get("date", ""))[:4])
    title = e(ref["title"])
    stop = "" if title[-1:] in "?!." else "."
    title = f"&ldquo;{title}{stop}&rdquo;" if ref.get("type") == "article" else f"<i>{title}</i>{stop}"
    bits = [f"{e(who)} ({e(yr)}).", title]
    if ref.get("container"):
        c = e(ref["container"])
        if ref.get("type") == "article":
            c = f"<i>{c}</i>"
            if ref.get("volume"):
                c += f" {e(ref['volume'])}" + (f"({e(ref['issue'])})" if ref.get("issue") else "")
            if ref.get("pages"):
                c += f": {e(ref['pages'])}"
        bits.append(c + ".")
    if ref.get("note"):
        bits.append(e(ref["note"]) + ".")
    if ref.get("publisher") and ref.get("type") != "article":
        bits.append((e(ref["place"]) + ": " if ref.get("place") else "") + e(ref["publisher"]) + ".")
    link = f"https://doi.org/{ref['doi']}" if ref.get("doi") else ref.get("url")
    if link:
        bits.append(f'<a href="{e(link)}">{e(link)}</a>')
    return " ".join(bits)


def self_ref(x):
    return {"type": "webpage", "authors": names(x.get("author") or AUTHOR), "title": x["title"],
            "date": x["date"].isoformat(), "site": NAME,
            "url": f'{BASE}/{x["id"]}/', "description": x["summary"]}


def first_chart(x):
    charts = sorted((x["_folder"] / "charts").glob("*")) if (x["_folder"] / "charts").is_dir() else []
    charts = [c for c in charts if c.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp", ".svg")]
    return charts[0].name if charts else None


def entry_page(x):
    ul = lambda items: "<ul>" + "".join(f"<li>{linkify(i)}</li>" for i in items) + "</ul>"
    facts = (f'<dl class="facts"><dt>Claim</dt><dd>&ldquo;{e(x["claim"])}&rdquo; '
             f'(<a href="{e(x["claim_source"])}">source</a>)</dd>'
             f'<dt>Verdict</dt><dd>{e(x["verdict"])}</dd>'
             f'<dt>Time taken</dt><dd>{e(x["time_taken"])}</dd>'
             f'<dt>Human time</dt><dd>{e(x["human_time"])}</dd>'
             f'<dt>Tools</dt><dd>{ul(x["tools"])}</dd>'
             f'<dt>Data sources</dt><dd>{ul(x["data_sources"])}</dd></dl>')
    assets = ""
    for sub, label in (("data", "Data"), ("code", "Code")):
        d = x["_folder"] / sub
        files = sorted(f.name for f in d.iterdir() if f.is_file()) if d.is_dir() else []
        if files:
            assets += f'<h4>{label}</h4><ul class="assets">' + "".join(
                f'<li><a href="{sub}/{e(f)}" download>{sub}/{e(f)}</a></li>' for f in files) + "</ul>"
    me = self_ref(x)
    authors = ", ".join(names(x.get("author") or AUTHOR))
    cite = cite_block(me)
    refs = x.get("references") or []
    refs_html = ("<h3>References</h3><ol class=\"refs\">" + "".join(
        f"<li>{cite_text(r)}</li>" for r in refs) + "</ol>"
        '<p><a href="references.ris">Add these references to your reference manager (RIS)</a></p>') if refs else ""
    # The argument comes first; everything about how the check was made (the entry's own
    # "How this was made" section, references, files and the citation) goes in a separate closing section.
    body_html = render_md(x["_body"], x["_folder"])
    parts = re.split(r'<h2[^>]*>How this was made</h2>', body_html, maxsplit=1)
    argument, making = parts[0], (parts[1] if len(parts) > 1 else "")
    cite = re.sub(r"<h2( [^>]*)?>Cite this page</h2>", r"<h3\1>Cite this page</h3>", cite)
    body = with_toc(f"""<div class="legend">{long_date(x["date"])} · {e(authors)}</div>
<h1>{e(x["title"])}</h1>
{facts}
<div class="body-md">{argument}</div>
<section class="making"><h2 class="making-h">How this was made</h2>
<p class="making-intro">How the check was done, what it cost, and the sources, data and code behind it.</p>
<div class="body-md">{making}</div>
{refs_html}
{"<h3>Files</h3>" + assets if assets else ""}
{cite}<p id="copy-status" role="status" aria-live="polite"></p></section>""", x["title"]) + (VEGA if 'class="vl"' in render_md(x["_body"], x["_folder"]) else "")
    ch = first_chart(x)
    head = ('<script src="/copy.js" defer></script><meta property="og:type" content="article">'
            f'<meta property="og:description" content="{e(x["summary"])}">'
            f'<meta name="twitter:title" content="{e(x["title"])}"><meta name="twitter:description" content="{e(x["summary"])}">')
    if ch:
        img = f'{BASE}/{x["id"]}/charts/{ch}'
        head += (f'<meta property="og:image" content="{e(img)}"><meta name="twitter:card" content="summary_large_image">'
                 f'<meta name="twitter:image" content="{e(img)}">')
    else:
        head += '<meta name="twitter:card" content="summary">'
    return page(f'{x["title"]} · {NAME}', body, x["summary"], extra_head=head, citation=me)


def main():
    errors = []
    about_md = ""
    if not (CONTENT / "about.md").exists():
        errors.append("content/about.md is missing")
    else:
        about_md = (CONTENT / "about.md").read_text(encoding="utf-8")
        errors += privacy_errors(CONTENT / "about.md", "content/about.md")
    entries = []
    for p in sorted(ENTRIES.iterdir()) if ENTRIES.is_dir() else []:
        if p.is_dir():
            fm, errs = parse(p)
            errors += errs
            if fm:
                entries.append(fm)
    for x in entries:
        if x["id"] in ("about", "style.css"):
            errors.append(f"{x['id']}: id is reserved")
    if errors:
        print("BUILD FAILED:\n  " + "\n  ".join(errors), file=sys.stderr)
        sys.exit(1)
    entries.sort(key=lambda x: (x["date"], x["id"]), reverse=True)
    out = ROOT / "site"
    if out.exists():
        shutil.rmtree(out)
    out.mkdir()
    for asset in ("style.css", "copy.js", "_headers"):
        shutil.copy(ROOT / "scripts/assets" / asset, out / asset)
    (out / "index.html").write_text(index_page(entries, first_paragraph(about_md)), encoding="utf-8")
    (out / "about").mkdir()
    (out / "about/index.html").write_text(
        page(f"About · {NAME}", with_toc(f'<div class="body-md">{render_md(about_md)}</div>', "About"),
             f"About {NAME}", "about"), encoding="utf-8")
    for x in entries:
        dest = out / x["id"]
        shutil.copytree(x["_folder"], dest, ignore=shutil.ignore_patterns("index.md", "__pycache__", ".DS_Store"))
        (dest / "index.html").write_text(entry_page(x), encoding="utf-8")
        if x.get("references"):
            (dest / "references.ris").write_text(references_ris(x["references"]), encoding="utf-8")
    print(f"Built {len(entries)} entries into {out}")


if __name__ == "__main__":
    main()
