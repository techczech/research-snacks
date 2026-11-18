#!/usr/bin/env python3
"""Compatibility launcher. The canonical build command is now `bun run build`."""
import subprocess
from pathlib import Path
if __name__ == '__main__':
    raise SystemExit(subprocess.call(['bun', 'run', 'build'], cwd=Path(__file__).resolve().parent.parent))
