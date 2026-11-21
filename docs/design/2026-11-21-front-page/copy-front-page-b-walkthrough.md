---
{
  "title": "Research Snacks: chronological All, subjects, topics and search",
  "date": "2026-11-21",
  "register": "FOR DOMINIK",
  "contracts": {
    "title": "Research Snacks: chronological All, subjects, topics and search",
    "status": "Chosen B revision built for feature-preview review",
    "purpose": "Choose a relevant public claim check from its question and finding.",
    "user": "A field expert arriving from a shared link, returning from RSS, or looking for linguistics or economic history. No AI background or previous author posts assumed.",
    "drawing": {
      "w": 900,
      "h": 610
    },
    "today": {
      "heading": "Chosen revision",
      "text": "The owner chose B with a chronological All list, a tag cloud and a more prominent search box. The complete All list replaces the repeated latest-three strip. Topic counts match the existing linked tag pages. A phone expands Topics on demand. Production remains unchanged."
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
        "step": "Choose from all checks, newest first",
        "screens": [
          "b-home",
          "entry"
        ]
      },
      {
        "n": 2,
        "step": "Narrow by subject, use a tag and return",
        "screens": [
          "b-topic",
          "b-topics",
          "b-home"
        ]
      },
      {
        "n": 3,
        "step": "Search with a phrase and read a result",
        "screens": [
          "b-search",
          "entry"
        ]
      },
      {
        "n": 4,
        "step": "Return for new work or subscribe",
        "screens": [
          "b-home",
          "subscribe"
        ]
      }
    ],
    "screens": [
      {
        "id": "b-home",
        "name": "All checks, newest first",
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
            "text": "Search all checks, All 10, subject counts 4/5/1, the complete chronological card grid and Topics (19 tags)."
          },
          {
            "part": "next",
            "text": "Choose a subject, an entry or the latest/subscription route."
          }
        ],
        "know": [
          "All is the complete newest-first list, read left to right then down.",
          "Research minutes are not presented as reading time."
        ],
        "steps": [
          {
            "do": "Choose Economic history",
            "goto": "b-topic"
          },
          {
            "do": "Explore Topics",
            "goto": "b-topics"
          },
          {
            "do": "Search a phrase",
            "goto": "b-search"
          },
          {
            "do": "Read a full check",
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
        "name": "Five economic history checks",
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
            "text": "Economic history, five checks in newest-first order, the selected subject and the same card layout."
          },
          {
            "part": "next",
            "text": "Choose a subject, an entry or the latest/subscription route."
          }
        ],
        "know": [
          "The URL keeps the chosen subject through reload and browser Back.",
          "All returns to the complete chronological collection."
        ],
        "steps": [
          {
            "do": "All checks",
            "goto": "b-home"
          },
          {
            "do": "Read a full check",
            "goto": "entry"
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
        "id": "b-topics",
        "name": "Explore the tag cloud",
        "viewer": "An outside field expert choosing a check to read.",
        "arrives_knowing": "The visitor jumped to Economic history.",
        "expects": [
          "Real questions and findings, dates, subject counts and the full evidence behind each entry."
        ],
        "purpose": "Choose a topic from the existing tag collection.",
        "why_here": "The visitor expands Topics on a phone or sees its desktop sidebar.",
        "achieve": "Choose one check within this subject.",
        "sees": [
          {
            "part": "header",
            "text": "One compact site header (64px); existing Search, About and sister-site routes."
          },
          {
            "part": "content",
            "text": "The 19 existing tag/category labels, weighted by frequency, with counts and links to the matching tag pages."
          },
          {
            "part": "next",
            "text": "Choose a subject, an entry or the latest/subscription route."
          }
        ],
        "know": [
          "Counts match the linked tag collection, including a matching authored category.",
          "Topics are expanded on desktop and expandable on phone."
        ],
        "steps": [
          {
            "do": "Read a full check",
            "goto": "entry"
          },
          {
            "do": "All checks",
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
        "id": "b-search",
        "name": "Search the existing collection",
        "viewer": "An outside field expert choosing a check to read.",
        "arrives_knowing": "The visitor jumped to Economic history.",
        "expects": [
          "Real questions and findings, dates, subject counts and the full evidence behind each entry."
        ],
        "purpose": "Find a check from a topic, claim or phrase.",
        "why_here": "The visitor types cake into the prominent home query field and submits.",
        "achieve": "Choose one check within this subject.",
        "sees": [
          {
            "part": "header",
            "text": "One compact site header (64px); existing Search, About and sister-site routes."
          },
          {
            "part": "content",
            "text": "The existing shared search dialog, prefilled with cake, its one matching check and keyboard controls."
          },
          {
            "part": "next",
            "text": "Choose a subject, an entry or the latest/subscription route."
          }
        ],
        "know": [
          "The box uses the same search engine as the header and keyboard shortcut.",
          "Esc returns focus to the home field or button used to open it.",
          "Without JavaScript, the GET form opens the existing search page and entry index."
        ],
        "steps": [
          {
            "do": "Open the matching cake check",
            "goto": "entry"
          },
          {
            "do": "Close search and return",
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
            "do": "Return to All checks",
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
            "do": "Return to All checks",
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
    "b-home": "<section class=\"frame\"><header data-part=\"header\">Research Snacks</header><div data-part=\"content\"><img src=\"IMAGE:preview-home-950.png\" alt=\"All checks, newest first\"></div><nav data-part=\"next\"><button data-goto=\"b-topic\">Choose Economic history</button><button data-goto=\"b-topics\">Explore Topics</button><button data-goto=\"b-search\">Search a phrase</button><button data-goto=\"entry\">Read a full check</button><button data-goto=\"subscribe\">Subscribe via RSS</button></nav></section>",
    "b-topic": "<section class=\"frame\"><header data-part=\"header\">Research Snacks</header><div data-part=\"content\"><img src=\"IMAGE:preview-economic-history-950.png\" alt=\"Five economic history checks\"></div><nav data-part=\"next\"><button data-goto=\"b-home\">All checks</button><button data-goto=\"entry\">Read a full check</button></nav></section>",
    "b-topics": "<section class=\"frame\"><header data-part=\"header\">Research Snacks</header><div data-part=\"content\"><img src=\"IMAGE:preview-topics-390.png\" alt=\"Explore the tag cloud\"></div><nav data-part=\"next\"><button data-goto=\"entry\">Read a full check</button><button data-goto=\"b-home\">All checks</button></nav></section>",
    "b-search": "<section class=\"frame\"><header data-part=\"header\">Research Snacks</header><div data-part=\"content\"><img src=\"IMAGE:preview-search-950.png\" alt=\"Search the existing collection\"></div><nav data-part=\"next\"><button data-goto=\"entry\">Open the matching cake check</button><button data-goto=\"b-home\">Close search and return</button></nav></section>",
    "entry": "<section class=\"frame\"><header data-part=\"header\">Research Snacks <span>Entries · About · Search</span></header><div data-part=\"content\"><h1>Full check</h1><div class=\"split\"><aside>Contents<br>Claim<br>Evidence<br>Sources<br>How this was made</aside><div><h2>Original question and full verdict</h2><p>The existing entry page is outside this redesign. The canonical link leads to its complete evidence, figures and methods.</p></div></div></div><nav data-part=\"next\"><button data-goto=\"b-home\">Back to A latest checks</button><button data-goto=\"b-home\">Back to B subject sections</button></nav></section>",
    "subscribe": "<section class=\"frame\"><header data-part=\"header\">Research Snacks <span>Entries · About · Search</span></header><div data-part=\"content\"><h1>Subscribe via RSS</h1><p>Existing feed: /rss.xml</p><p>New published snacks appear in this feed. The front-page design does not change the subscription address.</p></div><nav data-part=\"next\"><button data-goto=\"b-home\">Back to A latest checks</button><button data-goto=\"b-home\">Back to B subject sections</button></nav></section>"
  },
  "css": ".frame{background:#fbfaf7;color:#1d2433;padding:0 20px 20px;font:18px/1.4 system-ui;min-height:570px}.frame header{border-bottom:1px solid #bbb;padding:18px 0;font-weight:700}.frame header span{float:right;font-weight:400}.frame h1{font:700 30px Georgia;margin:16px 0 8px}.frame h2{font:700 23px Georgia;margin:14px 0 6px}.frame p{margin:8px 0}.band{background:#eee6db;padding:10px}.frame nav{display:flex;gap:10px;flex-wrap:wrap;border-top:1px solid #bbb;padding-top:12px;margin-top:20px}.frame button{padding:8px 12px;background:#eee6db;border:1px solid #626e83;border-radius:3px;color:#202f61}.split{display:grid;grid-template-columns:170px 1fr;gap:24px}.split aside{border-right:1px solid #bbb;padding:12px 0;line-height:2}.frame img{display:block;max-width:100%;max-height:460px;object-fit:contain;object-position:top left}"
}
---

Canonical contract and drawing text for the chosen B revision. Image tokens are resolved from the DTC screenshots when building.
