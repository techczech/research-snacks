---
{
  "title": "Research Snacks journey walkthrough source",
  "date": "2026-11-21",
  "register": "FOR DOMINIK",
  "contracts": {
    "title": "Research Snacks: choose a check to read",
    "status": "Proposed journeys; awaiting visual choice",
    "purpose": "Choose a relevant public claim check from its question and finding.",
    "user": "A field expert arriving from a shared link, returning from RSS, or looking for linguistics or economic history. No AI background or previous author posts assumed.",
    "drawing": {
      "w": 900,
      "h": 610
    },
    "today": {
      "heading": "Current front-page audit",
      "text": "One page combines site explanation and selection. Chronology, claim/verdict blocks, RSS and Linguistics work. Five unclassified entries sit under Research. Research minutes can be mistaken for reading time; long repeated text and retrospective titles make choice harder. This is an expert walkthrough, not participant testing."
    },
    "commitments": [
      {
        "id": "C1",
        "text": "Keep the cream compact publication, one header and all entry URLs; change the front page only."
      },
      {
        "id": "C2",
        "text": "Offer questions, findings and subjects with counts; make newest work and RSS easy to find."
      },
      {
        "id": "C3",
        "text": "Existing search and entry contents remain; no production publication before a preview and approval."
      }
    ],
    "journey": [
      {
        "n": 1,
        "step": "First visit: recognise the purpose, choose a question, read the entry",
        "screens": [
          "current",
          "a-home",
          "entry"
        ]
      },
      {
        "n": 2,
        "step": "Return from RSS: see latest additions and subscribe",
        "screens": [
          "a-home",
          "b-home",
          "subscribe"
        ]
      },
      {
        "n": 3,
        "step": "Find a subject: narrow or jump, read a finding, open the check",
        "screens": [
          "a-topic",
          "b-topic",
          "entry"
        ]
      }
    ],
    "screens": [
      {
        "id": "current",
        "name": "Current: scan the feed",
        "viewer": "An outside field expert choosing a check to read.",
        "arrives_knowing": "A colleague shared the front page.",
        "expects": [
          "Real questions and findings, dates, subject counts and the full evidence behind each entry."
        ],
        "purpose": "Understand which check is worth opening.",
        "why_here": "A colleague shared the front page.",
        "achieve": "Understand which check is worth opening.",
        "sees": [
          {
            "part": "header",
            "text": "One compact site header (64px); existing Search, About and sister-site routes."
          },
          {
            "part": "content",
            "text": "Research Snacks; AI-agent experiments; Entries; All 10 / History 1 / Linguistics 4 / Research 5."
          },
          {
            "part": "next",
            "text": "Choose a subject, an entry or the latest/subscription route."
          }
        ],
        "know": [
          "The minutes describe research time, not reading time.",
          "Economic history has no named route; five entries lack categories."
        ],
        "steps": [
          {
            "do": "Try the latest-first option",
            "goto": "a-home"
          },
          {
            "do": "Try the subject sections",
            "goto": "b-home"
          }
        ],
        "extra": [
          {
            "item": "Research duration and complete tag lists",
            "fate": "Retained inside entries; omitted from discovery rows."
          }
        ],
        "states": [
          {
            "id": "ready",
            "label": "Visible content"
          }
        ],
        "evaluate": [
          "C1: one header, compact cream layout and no changed entry URLs.",
          "C2: a relevant question, a finding and a way to newest work are visible.",
          "C3: no mockup claims that search integration or publication is complete."
        ],
        "checks": [
          "C1",
          "C2",
          "C3"
        ],
        "replaces": "The existing front-page selection journey; entry and RSS screens are boundary context only."
      },
      {
        "id": "a-home",
        "name": "A: latest checks",
        "viewer": "An outside field expert choosing a check to read.",
        "arrives_knowing": "A first or returning visitor opens the front page.",
        "expects": [
          "Real questions and findings, dates, subject counts and the full evidence behind each entry."
        ],
        "purpose": "Choose a recent question from the newest-first list.",
        "why_here": "A first or returning visitor opens the front page.",
        "achieve": "Choose a recent question from the newest-first list.",
        "sees": [
          {
            "part": "header",
            "text": "One compact site header (64px); existing Search, About and sister-site routes."
          },
          {
            "part": "content",
            "text": "A plain purpose, three subject counts, Latest checks and question/finding rows."
          },
          {
            "part": "next",
            "text": "Choose a subject, an entry or the latest/subscription route."
          }
        ],
        "know": [
          "The newest date comes first. Research duration is not shown as reading time.",
          "Filter selection is preserved in the URL and browser Back."
        ],
        "steps": [
          {
            "do": "Economic history 5",
            "goto": "a-topic"
          },
          {
            "do": "Read the revolution check",
            "goto": "entry"
          },
          {
            "do": "Subscribe via RSS",
            "goto": "subscribe"
          }
        ],
        "extra": [
          {
            "item": "Research duration and complete tag lists",
            "fate": "Retained inside entries; omitted from discovery rows."
          }
        ],
        "states": [
          {
            "id": "ready",
            "label": "Visible content"
          }
        ],
        "evaluate": [
          "C1: one header, compact cream layout and no changed entry URLs.",
          "C2: a relevant question, a finding and a way to newest work are visible.",
          "C3: no mockup claims that search integration or publication is complete."
        ],
        "checks": [
          "C1",
          "C2",
          "C3"
        ],
        "replaces": "The existing front-page selection journey; entry and RSS screens are boundary context only."
      },
      {
        "id": "a-topic",
        "name": "A: narrowed to economic history",
        "viewer": "An outside field expert choosing a check to read.",
        "arrives_knowing": "The visitor chose Economic history.",
        "expects": [
          "Real questions and findings, dates, subject counts and the full evidence behind each entry."
        ],
        "purpose": "Choose one of the five economic checks.",
        "why_here": "The visitor chose Economic history.",
        "achieve": "Choose one of the five economic checks.",
        "sees": [
          {
            "part": "header",
            "text": "One compact site header (64px); existing Search, About and sister-site routes."
          },
          {
            "part": "content",
            "text": "The selected subject has five matching questions and findings."
          },
          {
            "part": "next",
            "text": "Choose a subject, an entry or the latest/subscription route."
          }
        ],
        "know": [
          "All returns to the ten-entry view.",
          "No results are silently removed; this is a subject scope."
        ],
        "steps": [
          {
            "do": "Read the investment check",
            "goto": "entry"
          },
          {
            "do": "All 10",
            "goto": "a-home"
          }
        ],
        "extra": [
          {
            "item": "Research duration and complete tag lists",
            "fate": "Retained inside entries; omitted from discovery rows."
          }
        ],
        "states": [
          {
            "id": "filtered",
            "label": "Five matching checks"
          },
          {
            "id": "unknown",
            "label": "Unknown subject returns to All"
          }
        ],
        "evaluate": [
          "C1: one header, compact cream layout and no changed entry URLs.",
          "C2: a relevant question, a finding and a way to newest work are visible.",
          "C3: no mockup claims that search integration or publication is complete."
        ],
        "checks": [
          "C1",
          "C2",
          "C3"
        ],
        "replaces": "The existing front-page selection journey; entry and RSS screens are boundary context only."
      },
      {
        "id": "b-home",
        "name": "B: browse by subject",
        "viewer": "An outside field expert choosing a check to read.",
        "arrives_knowing": "The visitor wants a subject rather than a date sequence.",
        "expects": [
          "Real questions and findings, dates, subject counts and the full evidence behind each entry."
        ],
        "purpose": "Choose a subject section or a latest addition.",
        "why_here": "The visitor wants a subject rather than a date sequence.",
        "achieve": "Choose a subject section or a latest addition.",
        "sees": [
          {
            "part": "header",
            "text": "One compact site header (64px); existing Search, About and sister-site routes."
          },
          {
            "part": "content",
            "text": "Latest additions precede Linguistics 4 / Economic history 5 / Political change 1 sections."
          },
          {
            "part": "next",
            "text": "Choose a subject, an entry or the latest/subscription route."
          }
        ],
        "know": [
          "The latest strip repeats three entry links; the full collection is grouped below.",
          "A subject link jumps within this page."
        ],
        "steps": [
          {
            "do": "Jump to Economic history 5",
            "goto": "b-topic"
          },
          {
            "do": "Read the latest revolution check",
            "goto": "entry"
          },
          {
            "do": "Subscribe via RSS",
            "goto": "subscribe"
          }
        ],
        "extra": [
          {
            "item": "Research duration and complete tag lists",
            "fate": "Retained inside entries; omitted from discovery rows."
          }
        ],
        "states": [
          {
            "id": "ready",
            "label": "Visible content"
          }
        ],
        "evaluate": [
          "C1: one header, compact cream layout and no changed entry URLs.",
          "C2: a relevant question, a finding and a way to newest work are visible.",
          "C3: no mockup claims that search integration or publication is complete."
        ],
        "checks": [
          "C1",
          "C2",
          "C3"
        ],
        "replaces": "The existing front-page selection journey; entry and RSS screens are boundary context only."
      },
      {
        "id": "b-topic",
        "name": "B: economic history section",
        "viewer": "An outside field expert choosing a check to read.",
        "arrives_knowing": "The visitor jumped to Economic history.",
        "expects": [
          "Real questions and findings, dates, subject counts and the full evidence behind each entry."
        ],
        "purpose": "Choose one check within this subject.",
        "why_here": "The visitor jumped to Economic history.",
        "achieve": "Choose one check within this subject.",
        "sees": [
          {
            "part": "header",
            "text": "One compact site header (64px); existing Search, About and sister-site routes."
          },
          {
            "part": "content",
            "text": "Economic history heading, its five questions, findings and dates."
          },
          {
            "part": "next",
            "text": "Choose a subject, an entry or the latest/subscription route."
          }
        ],
        "know": [
          "This is a position within the same page, not a separate category page."
        ],
        "steps": [
          {
            "do": "Read the investment check",
            "goto": "entry"
          },
          {
            "do": "Return to latest additions",
            "goto": "b-home"
          }
        ],
        "extra": [
          {
            "item": "Research duration and complete tag lists",
            "fate": "Retained inside entries; omitted from discovery rows."
          }
        ],
        "states": [
          {
            "id": "ready",
            "label": "Visible content"
          }
        ],
        "evaluate": [
          "C1: one header, compact cream layout and no changed entry URLs.",
          "C2: a relevant question, a finding and a way to newest work are visible.",
          "C3: no mockup claims that search integration or publication is complete."
        ],
        "checks": [
          "C1",
          "C2",
          "C3"
        ],
        "replaces": "The existing front-page selection journey; entry and RSS screens are boundary context only."
      },
      {
        "id": "entry",
        "name": "Read the full check (unchanged)",
        "viewer": "An outside field expert choosing a check to read.",
        "arrives_knowing": "A question link led to the existing entry.",
        "expects": [
          "Real questions and findings, dates, subject counts and the full evidence behind each entry."
        ],
        "purpose": "Read the evidence behind the finding.",
        "why_here": "A question link led to the existing entry.",
        "achieve": "Read the evidence behind the finding.",
        "sees": [
          {
            "part": "header",
            "text": "One compact site header (64px); existing Search, About and sister-site routes."
          },
          {
            "part": "content",
            "text": "The original entry title, claim, full verdict, sources and left Contents sidebar."
          },
          {
            "part": "next",
            "text": "Choose a subject, an entry or the latest/subscription route."
          }
        ],
        "know": [
          "This is boundary context, not a redesign of entry pages.",
          "The actual static mockups link to the unchanged canonical entries."
        ],
        "steps": [
          {
            "do": "Back to A latest checks",
            "goto": "a-home"
          },
          {
            "do": "Back to B subject sections",
            "goto": "b-home"
          }
        ],
        "extra": [
          {
            "item": "Research duration and complete tag lists",
            "fate": "Retained inside entries; omitted from discovery rows."
          }
        ],
        "states": [
          {
            "id": "ready",
            "label": "Visible content"
          }
        ],
        "evaluate": [
          "C1: one header, compact cream layout and no changed entry URLs.",
          "C2: a relevant question, a finding and a way to newest work are visible.",
          "C3: no mockup claims that search integration or publication is complete."
        ],
        "checks": [
          "C1",
          "C2",
          "C3"
        ],
        "replaces": "The existing front-page selection journey; entry and RSS screens are boundary context only."
      },
      {
        "id": "subscribe",
        "name": "Subscribe (existing RSS route)",
        "viewer": "An outside field expert choosing a check to read.",
        "arrives_knowing": "A returning reader chose Subscribe via RSS.",
        "expects": [
          "Real questions and findings, dates, subject counts and the full evidence behind each entry."
        ],
        "purpose": "Receive future snacks through the existing feed.",
        "why_here": "A returning reader chose Subscribe via RSS.",
        "achieve": "Receive future snacks through the existing feed.",
        "sees": [
          {
            "part": "header",
            "text": "One compact site header (64px); existing Search, About and sister-site routes."
          },
          {
            "part": "content",
            "text": "The existing /rss.xml feed, with dates, titles, summaries and links."
          },
          {
            "part": "next",
            "text": "Choose a subject, an entry or the latest/subscription route."
          }
        ],
        "know": [
          "RSS is a feed address for a reader app, not an email signup."
        ],
        "steps": [
          {
            "do": "Back to A latest checks",
            "goto": "a-home"
          },
          {
            "do": "Back to B subject sections",
            "goto": "b-home"
          }
        ],
        "extra": [
          {
            "item": "Research duration and complete tag lists",
            "fate": "Retained inside entries; omitted from discovery rows."
          }
        ],
        "states": [
          {
            "id": "ready",
            "label": "Visible content"
          }
        ],
        "evaluate": [
          "C1: one header, compact cream layout and no changed entry URLs.",
          "C2: a relevant question, a finding and a way to newest work are visible.",
          "C3: no mockup claims that search integration or publication is complete."
        ],
        "checks": [
          "C1",
          "C2",
          "C3"
        ],
        "replaces": "The existing front-page selection journey; entry and RSS screens are boundary context only."
      }
    ]
  },
  "drawings": {
    "current": "<section class=\"frame\"><header data-part=\"header\">Research Snacks <span>Entries · About · Search</span></header><div data-part=\"content\"><h1>Research Snacks</h1><p>Small research experiments with AI agents, checking claims against primary data.</p><p class=\"band\">All 10 · History 1 · Linguistics 4 · Research 5</p><h2>Revolution speed and a 2011 claim</h2><p>19 Nov 2026 · History · 17 min</p><p>Claim: Faster communication makes little difference to how quickly regimes fall.</p><p>Verdict: The warning holds up; the comparison cannot establish no technology effect.</p><h2>Literally: how close was I in 2011?</h2></div><nav data-part=\"next\"><button data-goto=\"a-home\">Try the latest-first option</button><button data-goto=\"b-home\">Try the subject sections</button></nav></section>",
    "a-home": "<section class=\"frame\"><header data-part=\"header\">Research Snacks <span>Entries · About · Search</span></header><div data-part=\"content\"><h1>Research Snacks</h1><p>Public claims checked against evidence, with AI assistance.</p><p class=\"band\">All 10 · Linguistics 4 · Economic history 5 · Political change 1</p><p>Latest checks · 19 November 2026</p><h2>Does faster communication make revolutions faster?</h2><p>The two cases were six days apart. They do not establish whether technology changes the speed of regime collapse.</p><h2>Is “literally” used mainly for emphasis?</h2><p>Emphatic usage is established. Earlier frequency comparisons remain unproved.</p></div><nav data-part=\"next\"><button data-goto=\"a-topic\">Economic history 5</button><button data-goto=\"entry\">Read the revolution check</button><button data-goto=\"subscribe\">Subscribe via RSS</button></nav></section>",
    "a-topic": "<section class=\"frame\"><header data-part=\"header\">Research Snacks <span>Entries · About · Search</span></header><div data-part=\"content\"><p data-state=\"unknown\">An unknown subject shows all ten checks in the prototype.</p><h1>Economic history · 5 checks</h1><h2>Is the AI investment boom unprecedented?</h2><p>US railways offer a close precedent. AI returns still depend on asset life, costs and future demand.</p><h2>Did work change more before 1970 than since?</h2><p>The answer depends on how jobs are counted.</p></div><nav data-part=\"next\"><button data-goto=\"entry\">Read the investment check</button><button data-goto=\"a-home\">All 10</button></nav></section>",
    "b-home": "<section class=\"frame\"><header data-part=\"header\">Research Snacks <span>Entries · About · Search</span></header><div data-part=\"content\"><h1>Research Snacks</h1><p>Public claims checked against evidence, with AI assistance.</p><p class=\"band\">All 10 · Linguistics 4 · Economic history 5 · Political change 1</p><h2>Latest additions · 19 Nov 2026</h2><p>Revolution speed · Literally · Hawks and doves</p><h2>Linguistics · 4</h2><p>English usage, metaphor and decipherment</p><h2>Is “literally” used mainly for emphasis?</h2><p>Emphatic usage is established; earlier frequency comparisons remain unproved.</p></div><nav data-part=\"next\"><button data-goto=\"b-topic\">Jump to Economic history 5</button><button data-goto=\"entry\">Read the latest revolution check</button><button data-goto=\"subscribe\">Subscribe via RSS</button></nav></section>",
    "b-topic": "<section class=\"frame\"><header data-part=\"header\">Research Snacks <span>Entries · About · Search</span></header><div data-part=\"content\"><h1>Economic history · 5 checks</h1><h2>Is the AI investment boom unprecedented?</h2><p>US railways offer a close precedent. AI returns still depend on asset life, costs and future demand.</p><h2>Did work change more before 1970 than since?</h2><p>The answer depends on how jobs are counted.</p></div><nav data-part=\"next\"><button data-goto=\"entry\">Read the investment check</button><button data-goto=\"b-home\">Return to latest additions</button></nav></section>",
    "entry": "<section class=\"frame\"><header data-part=\"header\">Research Snacks <span>Entries · About · Search</span></header><div data-part=\"content\"><h1>Full check</h1><div class=\"split\"><aside>Contents<br>Claim<br>Evidence<br>Sources<br>How this was made</aside><div><h2>Original question and full verdict</h2><p>The existing entry page is outside this redesign. The canonical link leads to its complete evidence, figures and methods.</p></div></div></div><nav data-part=\"next\"><button data-goto=\"a-home\">Back to A latest checks</button><button data-goto=\"b-home\">Back to B subject sections</button></nav></section>",
    "subscribe": "<section class=\"frame\"><header data-part=\"header\">Research Snacks <span>Entries · About · Search</span></header><div data-part=\"content\"><h1>Subscribe via RSS</h1><p>Existing feed: /rss.xml</p><p>New published snacks appear in this feed. The front-page design does not change the subscription address.</p></div><nav data-part=\"next\"><button data-goto=\"a-home\">Back to A latest checks</button><button data-goto=\"b-home\">Back to B subject sections</button></nav></section>"
  },
  "css": ".frame{background:#fbfaf7;color:#1d2433;padding:0 20px 20px;font:18px/1.4 system-ui;min-height:570px}.frame header{border-bottom:1px solid #bbb;padding:18px 0;font-weight:700}.frame header span{float:right;font-weight:400}.frame h1{font:700 30px Georgia;margin:16px 0 8px}.frame h2{font:700 23px Georgia;margin:14px 0 6px}.frame p{margin:8px 0}.band{background:#eee6db;padding:10px}.frame nav{display:flex;gap:10px;flex-wrap:wrap;border-top:1px solid #bbb;padding-top:12px;margin-top:20px}.frame button{padding:8px 12px;background:#eee6db;border:1px solid #626e83;border-radius:3px;color:#202f61}.split{display:grid;grid-template-columns:170px 1fr;gap:24px}.split aside{border-right:1px solid #bbb;padding:12px 0;line-height:2}"
}
---

Canonical editable text and drawing fragments for the interactive front-page walkthrough. Rebuild with the two commands in README-front-page-options.md.
