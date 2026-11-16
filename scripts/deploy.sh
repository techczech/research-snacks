#!/usr/bin/env bash
# Build and deploy site/ to the Cloudflare Pages project research-snacks.
# If several Cloudflare accounts are logged in, set CLOUDFLARE_ACCOUNT_ID=b6ae5bced06492ee6f0c8f92776804da first.
# One-off setup (project, custom domain, DNS) is not done here; this only deploys.
set -euo pipefail
cd "$(dirname "$0")/.."
uv run scripts/build-site.py
npx wrangler pages deploy site --project-name research-snacks --branch main \
  --commit-hash "$(git rev-parse HEAD)" --commit-message "$(git log -1 --format=%s)"
