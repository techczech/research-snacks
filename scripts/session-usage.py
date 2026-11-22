#!/usr/bin/env python3
"""Old name for agent-usage.py, kept so earlier notes still work. Use scripts/agent-usage.py."""
import os, subprocess, sys

script = os.path.join(os.path.dirname(os.path.abspath(__file__)), "agent-usage.py")
raise SystemExit(subprocess.call([sys.executable, "-I", script] + sys.argv[1:]))
