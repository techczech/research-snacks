#!/usr/bin/env bash
# Copy only the browser runtime of a committed Roman Numeral Reader revision.
set -euo pipefail
if [[ $# -lt 1 || $# -gt 2 ]]; then
  printf 'Usage: %s TOOL-REPOSITORY [REVISION]\n' "$0" >&2
  exit 2
fi
source_status="$(git -C "$1" rev-parse --verify "${2:-HEAD}^{commit}")"
site_root="$(cd "$(dirname "$0")/.." && pwd)"
target="$site_root/scripts/assets/tools/roman-numeral-reader"
files=(index.html roman.js reader.js reader.css data/research.js)
for file in "${files[@]}"; do
  git -C "$1" cat-file -e "$source_status:$file"
done
mkdir -p "$target"
git -C "$1" archive "$source_status" "${files[@]}" | tar -xf - -C "$target"
printf '%s\n' "$source_status" > "$target/source-commit.txt"
printf 'Copied Roman Numeral Reader at %s\n' "$source_status"
