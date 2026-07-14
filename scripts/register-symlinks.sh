#!/usr/bin/env bash
set -euo pipefail

dry_run=false
if [[ "${1:-}" == "--dry-run" ]]; then
  dry_run=true
elif [[ $# -ne 0 ]]; then
  echo "Usage: $0 [--dry-run]" >&2
  exit 2
fi

source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"

link_skill() {
  local target="$1"
  local parent
  parent="$(dirname "$target")"

  if [[ -L "$target" ]]; then
    if [[ "$(readlink "$target")" == "$source_dir" ]]; then
      echo "Already linked: $target"
      return
    fi
    echo "Refusing to replace existing symlink: $target" >&2
    exit 1
  fi

  if [[ -e "$target" ]]; then
    echo "Refusing to replace existing path: $target" >&2
    exit 1
  fi

  if [[ "$dry_run" == true ]]; then
    echo "Would link: $target -> $source_dir"
    return
  fi

  mkdir -p "$parent"
  ln -s "$source_dir" "$target"
  echo "Linked: $target -> $source_dir"
}

link_skill "$HOME/.codex/skills/load-testing"
link_skill "$HOME/.claude/skills/load-testing"
link_skill "$HOME/.config/opencode/skills/load-testing"
link_skill "$HOME/.copilot/skills/load-testing"
link_skill "$HOME/.gemini/skills/load-testing"
link_skill "$HOME/.gemini/config/skills/load-testing"
link_skill "$HOME/.qwen/skills/load-testing"
link_skill "$HOME/.kiro/skills/load-testing"
link_skill "$HOME/.cline/skills/load-testing"
link_skill "$HOME/.roo/skills/load-testing"
link_skill "$HOME/.kilo/skills/load-testing"
link_skill "$HOME/.warp/skills/load-testing"
link_skill "$HOME/.openclaw/skills/load-testing"
link_skill "$HOME/.agents/skills/load-testing"
