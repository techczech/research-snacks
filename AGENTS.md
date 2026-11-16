# AGENTS.md (research-snacks)

- Register: FOR AGENTS. Public repo: nothing private, ever.
- What: one folder per experiment in `entries/` -> static site in `site/` via `uv run scripts/build-site.py`. Live: researchsnacks.semanticmachines.fyi. Sister site: model-data-points (datapoints.semanticmachines.fyi).

## Add an entry

1. Folder `entries/YYYY-MM-DD-short-slug/` with `index.md` (frontmatter fields in README.md; `id` = folder name) and `charts/`, `data/`, `code/`. Copy the shape of an existing entry.
2. Facts only from the run's own records; every number traceable to `data/` or `code/`. Time taken is measured; human time is an estimate and says so.
3. Privacy check before commit: no personal names, machine nicknames/hostnames, file paths, email addresses, account or plan details, private document titles or content. The build rejects local paths, emails and hostnames in every text file under `entries/`; it cannot catch the rest, so read the entry.
4. Prose: short and literal, British spelling; `dominik-writer` for longer write-ups.
5. `uv run scripts/build-site.py`, open the entry page, check charts render and data/code links resolve. Commit, push, `scripts/deploy.sh` (needs `CLOUDFLARE_ACCOUNT_ID=b6ae5bced06492ee6f0c8f92776804da` if several accounts). Check the entry URL (https://researchsnacks.semanticmachines.fyi/<id>/) returns 200.

## Notes

- Id (with its date) is the URL; keep it stable.
- `site/` git-ignored. Licence: content CC BY 4.0, code MIT.
- One-off setup (Pages project, custom domain, DNS) is not scripted.
