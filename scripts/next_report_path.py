#!/usr/bin/env python3
"""Allocate the next non-existing k6 HTML report path."""

from __future__ import annotations

import argparse
from pathlib import Path


def next_report_path(project_root: Path, docs_dir: str) -> Path:
    docs = project_root / docs_dir
    docs.mkdir(parents=True, exist_ok=True)

    candidate = docs / "load-test.html"
    if not candidate.exists():
        return candidate

    number = 2
    while True:
        candidate = docs / f"load-test-{number}.html"
        if not candidate.exists():
            return candidate
        number += 1


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--project-root", type=Path, default=Path.cwd())
    parser.add_argument("--docs-dir", default="docs")
    parser.add_argument(
        "--absolute",
        action="store_true",
        help="Print an absolute path instead of a project-relative path.",
    )
    args = parser.parse_args()

    root = args.project_root.expanduser().resolve()
    path = next_report_path(root, args.docs_dir)
    print(path if args.absolute else path.relative_to(root))


if __name__ == "__main__":
    main()
