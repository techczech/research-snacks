#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml", "markdown"]
# ///
"""Regression checks for page capture, reference downloads and privacy guards."""
import importlib.util
import unittest
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path

spec = importlib.util.spec_from_file_location("build_site", Path(__file__).with_name("build-site.py"))
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)


class Head(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.meta = defaultdict(list)
        self.canonical = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta":
            self.meta[attrs.get("name", attrs.get("property"))].append(attrs.get("content"))
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical.append(attrs["href"])


class CitationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.entry, errors = build.parse(next(build.ENTRIES.iterdir()))
        if errors:
            raise AssertionError(errors)

    def check_page(self, html, title, url, date=None):
        head = Head(html)
        expected = {"citation_title": title, "citation_author": "Lukeš, Dominik",
                    "citation_public_url": url, "citation_language": "en",
                    "DC.type": "webpage", "DC.title": title, "DC.creator": "Lukeš, Dominik",
                    "DC.publisher": "Research Snacks", "DC.language": "en-GB",
                    "og:site_name": "Research Snacks", "og:title": title, "og:url": url}
        for tag, value in expected.items():
            self.assertEqual(head.meta[tag], [value], tag)
        self.assertEqual(len(head.meta["description"]), 1)
        self.assertEqual(head.canonical, [url])
        self.assertEqual(head.meta["DC.date"], [date] if date else [])
        self.assertEqual(head.meta["citation_publication_date"], [date.replace("-", "/")] if date else [])
        self.assertNotIn("Z3988", html)
        self.assertNotIn("citation_journal_title", html)

    def test_entry_is_one_webpage_with_date_and_social_tags(self):
        x = self.entry
        html = build.entry_page(x)
        self.check_page(html, x["title"], f'{build.BASE}/{x["id"]}/', x["date"].isoformat())
        self.assertEqual(Head(html).meta["og:type"], ["article"])
        self.assertEqual(len(Head(html).meta["og:image"]), 1)
        self.assertIn('data-copy="#cite-text"', html)
        self.assertIn("Lukeš, Dominik (2026).", html)
        self.assertIn('href="references.ris"', html)
        self.assertIn("Add these references to your reference manager (RIS)", html)

    def test_home_is_undated_webpage(self):
        self.check_page(build.index_page([self.entry], "Intro"), build.NAME, build.BASE + "/")

    def test_about_is_undated_webpage(self):
        self.check_page(build.page("About · Research Snacks", "About", "About Research Snacks", "about"),
                        "About · Research Snacks", build.BASE + "/about/")

    def test_entry_without_references_has_no_download_link(self):
        self.assertNotIn('href="references.ris"', build.entry_page({**self.entry, "references": []}))

    def test_ris_preserves_fields_and_repeated_authors(self):
        self.assertTrue(hasattr(build, "references_ris"), "static RIS export is missing")
        text = build.references_ris([{"type": "article", "authors": ["Jane Smith", "Doe, John"],
            "title": "A study", "container": "Journal", "date": "2024-02-03", "volume": 2,
            "issue": 1, "pages": "10–20", "publisher": "Press", "url": "https://example.org/",
            "doi": "10.1234/example"}])
        for line in ("TY  - JOUR", "AU  - Smith, Jane", "AU  - Doe, John", "TI  - A study",
                     "T2  - Journal", "PY  - 2024", "VL  - 2", "IS  - 1", "SP  - 10", "EP  - 20",
                     "PB  - Press", "UR  - https://example.org/", "DO  - 10.1234/example", "ER  - "):
            self.assertIn(line, text.splitlines())

    def test_ris_types_and_organisation_names(self):
        self.assertTrue(hasattr(build, "references_ris"), "static RIS export is missing")
        for typ, ris_type in (("report", "RPRT"), ("dataset", "DATA"), ("webpage", "ELEC"),
                              ("post", "ELEC"), ("video", "VIDEO")):
            text = build.references_ris([{"type": typ, "title": "Title", "corporate": True,
                                         "authors": ["Example Research Group"], "year": 2025}])
            self.assertIn(f"TY  - {ris_type}\n", text)
            self.assertIn("AU  - Example Research Group\n", text)

    def test_ris_cannot_inject_records_via_multiline_values(self):
        self.assertTrue(hasattr(build, "references_ris"), "static RIS export is missing")
        text = build.references_ris([{"title": "Title\nER  - \nTY  - JOUR"}])
        self.assertEqual(text.count("\nTY  - "), 0)
        self.assertEqual(text.splitlines().count("ER  - "), 1)

    def test_privacy_patterns_still_reject_private_material(self):
        for pattern, value in ((build.PRIVATE_PATH, "/Users/example/private"),
                               (build.EMAIL, "private@example.org"),
                               (build.HOSTNAME, "example.local"),
                               (build.SCRIPT_URL, "javascript:example")):
            self.assertIsNotNone(pattern.search(value))


if __name__ == "__main__":
    unittest.main()
