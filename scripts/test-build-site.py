#!/usr/bin/env python3
"""Compatibility launcher for the ported citation, RIS, privacy, link and feed checks."""
import subprocess
from pathlib import Path
if __name__ == '__main__':
    raise SystemExit(subprocess.call(['bun', 'run', 'check'], cwd=Path(__file__).resolve().parent.parent))
