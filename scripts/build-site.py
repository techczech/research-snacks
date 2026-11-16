#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml", "markdown"]
# ///
"""Build site/ from entries/<id>/index.md. Run: uv run scripts/build-site.py"""
import re
import shutil
from urllib.parse import urlencode
import sys
from datetime import date
from html import escape
from pathlib import Path

import markdown
import yaml

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


def render_md(text):
    # raw HTML in Markdown is escaped, as on the sister site
    text = text.replace("&", "&amp;").replace("<", "&lt;")
    # every bare URL becomes a link (skips URLs already inside [text](url))
    text = BARE_URL.sub(lambda m: f"[{m.group(1)}]({m.group(1)}){m.group(2)}", text)
    html = markdown.markdown(text, extensions=["tables", "fenced_code"])
    # right-align cells that hold numbers (counts, years, percentages, dashes)
    html = re.sub(r"<(td|th)>([−\-–+]?[\d,.]+%?(?: \(\d{4}\))?|–|0)</\1>", r'<\1 class="num">\2</\1>', html)
    # make every image open the full-size file on click
    html = re.sub(r'<img ([^>]*?)src="([^"]+)"([^>]*?)/?>',
                  r'<a class="imglink" href="\2"><img \1src="\2"\3 loading="lazy"></a>', html)
    html = re.sub(r"<p>(<a class=\"imglink\".*?</a>)</p>", r"\1", html, flags=re.S)
    return html


def page(title, body, desc, nav_on="", extra_head=""):
    def a(key, href, label):
        return f'<a{" class=on" if nav_on == key else ""} href="{href}">{label}</a>'
    nav = a("entries", "/", "Entries") + a("about", "/about/", "About") + f'<a href="{SISTER}">Model Data Points</a>'
    return f"""<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>{e(title)}</title><meta name="description" content="{e(desc)}">{extra_head}<link rel="stylesheet" href="/style.css"></head><body><header class="site"><div class="wrap"><a class="logo" href="/"><b>RS</b><span>{NAME}</span></a>
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


# ---- citations: COinS spans (Zotero and other reference managers) + formatted text ----
def names(v):
    return [v] if isinstance(v, str) else list(v or [])


def surname_first(n):
    n = n.strip()
    if "," in n or " " not in n:
        return n
    first, last = n.rsplit(" ", 1)
    return f"{last}, {first}"


def coins(ref):
    """ref keys: type (article|report|dataset|webpage|video|post), authors, title, year/date,
    container, volume, issue, pages, publisher, place, url, doi."""
    t = ref.get("type", "webpage")
    date_ = str(ref.get("date") or ref.get("year") or "")
    kv = [("ctx_ver", "Z39.88-2004")]
    aus = names(ref.get("authors"))
    if not ref.get("corporate"):
        aus = [surname_first(a) for a in aus]
    if t == "article":
        kv += [("rft_val_fmt", "info:ofi/fmt:kev:mtx:journal"), ("rft.genre", "article"),
               ("rft.atitle", ref["title"]), ("rft.jtitle", ref.get("container", ""))]
        for k in ("volume", "issue"):
            if ref.get(k):
                kv.append((f"rft.{k}", str(ref[k])))
        if ref.get("pages"):
            kv.append(("rft.pages", str(ref["pages"])))
        kv += [("rft.au", a) for a in aus]
    elif t in ("report", "dataset"):
        kv += [("rft_val_fmt", "info:ofi/fmt:kev:mtx:book"), ("rft.genre", "report" if t == "report" else "document"),
               ("rft.btitle", ref["title"])]
        for k, f in (("publisher", "rft.pub"), ("place", "rft.place"), ("container", "rft.series")):
            if ref.get(k):
                kv.append((f, str(ref[k])))
        kv += [("rft.au", a) for a in aus]
    else:  # webpage, video, post: Dublin Core, which Zotero imports as a web page
        kv += [("rft_val_fmt", "info:ofi/fmt:kev:mtx:dc"), ("rft.type", ref.get("dctype", "webpage")),
               ("rft.title", ref["title"])]
        if ref.get("publisher") or ref.get("container"):
            kv.append(("rft.publisher", str(ref.get("publisher") or ref.get("container"))))
        if ref.get("description"):
            kv.append(("rft.description", ref["description"]))
        kv += [("rft.creator", a) for a in aus]
        if ref.get("url"):
            kv.append(("rft.identifier", ref["url"]))
    if date_:
        kv.append(("rft.date", date_))
    if ref.get("doi"):
        kv.append(("rft_id", f"info:doi/{ref['doi']}"))
    if ref.get("url"):
        kv.append(("rft_id", ref["url"]))
    return f'<span class="Z3988" title="{e(urlencode(kv))}"></span>'


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
            "date": x["date"].isoformat(), "publisher": NAME,
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
            assets += f'<h3>{label}</h3><ul class="assets">' + "".join(
                f'<li><a href="{sub}/{e(f)}" download>{sub}/{e(f)}</a></li>' for f in files) + "</ul>"
    me = self_ref(x)
    authors = ", ".join(names(x.get("author") or AUTHOR))
    cite = (f'<section class="cite"><h2>Cite this page</h2>{coins(me)}<p>{cite_text(me)}</p>'
            '<p class="hint">Reference managers such as Zotero pick this page and every reference below up '
            'from the browser (the citation is embedded as COinS and citation metadata).</p></section>')
    refs = x.get("references") or []
    refs_html = ("<h2>References</h2><ol class=\"refs\">" + "".join(
        f"<li>{coins(r)}{cite_text(r)}</li>" for r in refs) + "</ol>") if refs else ""
    body = f"""<main class="wrap entry" style="padding-top:40px">
<div class="legend">{long_date(x["date"])} · {e(authors)}</div>
<h1>{e(x["title"])}</h1>
{facts}
<div class="body-md">{render_md(x["_body"])}</div>
{refs_html}
{"<h2>Files</h2>" + assets if assets else ""}
{cite}
</main>"""
    ch = first_chart(x)
    url = f'{BASE}/{x["id"]}/'
    head = (f'<link rel="canonical" href="{e(url)}"><meta property="og:type" content="article">'
            f'<meta property="og:site_name" content="{NAME}"><meta property="og:title" content="{e(x["title"])}">'
            f'<meta property="og:description" content="{e(x["summary"])}"><meta property="og:url" content="{e(url)}">'
            f'<meta name="twitter:title" content="{e(x["title"])}"><meta name="twitter:description" content="{e(x["summary"])}">'
            f'<meta name="citation_title" content="{e(x["title"])}">'
            + "".join(f'<meta name="citation_author" content="{e(surname_first(a))}">' for a in names(x.get("author") or AUTHOR))
            + f'<meta name="citation_publication_date" content="{x["date"].strftime("%Y/%m/%d")}">'
            f'<meta name="citation_public_url" content="{e(url)}">'
            f'<meta name="DC.title" content="{e(x["title"])}"><meta name="DC.date" content="{x["date"].isoformat()}">'
            f'<meta name="DC.publisher" content="{NAME}"><meta name="DC.type" content="Text">'
            + "".join(f'<meta name="DC.creator" content="{e(surname_first(a))}">' for a in names(x.get("author") or AUTHOR)))
    if ch:
        img = f'{BASE}/{x["id"]}/charts/{ch}'
        head += (f'<meta property="og:image" content="{e(img)}"><meta name="twitter:card" content="summary_large_image">'
                 f'<meta name="twitter:image" content="{e(img)}">')
    else:
        head += '<meta name="twitter:card" content="summary">'
    return page(f'{x["title"]} · {NAME}', body, x["summary"], extra_head=head)


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
    shutil.copy(ROOT / "scripts/assets/style.css", out / "style.css")
    (out / "index.html").write_text(index_page(entries, first_paragraph(about_md)), encoding="utf-8")
    (out / "about").mkdir()
    (out / "about/index.html").write_text(
        page(f"About · {NAME}", f'<main class="wrap entry" style="padding-top:40px"><div class="body-md">{render_md(about_md)}</div></main>',
             f"About {NAME}", "about"), encoding="utf-8")
    for x in entries:
        dest = out / x["id"]
        shutil.copytree(x["_folder"], dest, ignore=shutil.ignore_patterns("index.md", "__pycache__", ".DS_Store"))
        (dest / "index.html").write_text(entry_page(x), encoding="utf-8")
    print(f"Built {len(entries)} entries into {out}")


if __name__ == "__main__":
    main()
