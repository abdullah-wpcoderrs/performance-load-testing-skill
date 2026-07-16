#!/usr/bin/env python3
"""Allocate the next non-existing k6 HTML report path."""

from __future__ import annotations

import argparse
from pathlib import Path


def next_report_path(project_root: Path, report_dir: str) -> Path:
    reports = project_root / report_dir
    reports.mkdir(parents=True, exist_ok=True)

    candidate = reports / "load-test.html"
    if not candidate.exists():
        return candidate

    number = 2
    while True:
        candidate = reports / f"load-test-{number}.html"
        if not candidate.exists():
            return candidate
        number += 1


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--project-root", type=Path, default=Path.cwd())
    parser.add_argument(
        "--report-dir",
        "--docs-dir",
        dest="report_dir",
        default="load-test",
        help="Project-relative report directory (default: load-test).",
    )
    parser.add_argument(
        "--absolute",
        action="store_true",
        help="Print an absolute path instead of a project-relative path.",
    )
    args = parser.parse_args()

    root = args.project_root.expanduser().resolve()
    path = next_report_path(root, args.report_dir)
    print(path if args.absolute else path.relative_to(root))


if __name__ == "__main__":
    main()
