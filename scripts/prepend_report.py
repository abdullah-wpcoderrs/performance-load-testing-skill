#!/usr/bin/env python3
"""Prepend a run section below the H1 in load-test/Report.md."""

from __future__ import annotations

import argparse
import os
import tempfile
from pathlib import Path

TITLE = "# Load Test Report"
LEGACY_TITLES = {TITLE, "# k6 Load Test Report"}


def normalize_section(text: str) -> str:
    section = text.strip()
    if not section:
        raise ValueError("section file is empty")
    if not section.startswith("## "):
        raise ValueError("section must start with a level-two Markdown heading")
    return section


def merge(existing: str, section: str) -> str:
    old = existing.strip()
    if not old:
        return f"{TITLE}\n\n{section}\n"

    lines = old.splitlines()
    if lines[0].strip() in LEGACY_TITLES:
        remainder = "\n".join(lines[1:]).strip()
        suffix = f"\n\n{remainder}" if remainder else ""
        return f"{TITLE}\n\n{section}{suffix}\n"

    return f"{TITLE}\n\n{section}\n\n{old}\n"


def atomic_write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary_name = tempfile.mkstemp(
        dir=path.parent, prefix=f".{path.name}.", suffix=".tmp", text=True
    )
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8") as handle:
            handle.write(content)
        os.replace(temporary_name, path)
    except Exception:
        try:
            os.unlink(temporary_name)
        except FileNotFoundError:
            pass
        raise


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--report", type=Path, required=True)
    parser.add_argument("--section", type=Path, required=True)
    args = parser.parse_args()

    section = normalize_section(args.section.read_text(encoding="utf-8"))
    existing = args.report.read_text(encoding="utf-8") if args.report.exists() else ""
    atomic_write(args.report, merge(existing, section))
    print(args.report)


if __name__ == "__main__":
    main()
