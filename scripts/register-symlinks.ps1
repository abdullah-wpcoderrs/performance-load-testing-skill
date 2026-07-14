[CmdletBinding()]
param(
    [string]$Source = (Split-Path -Parent $PSScriptRoot),
    [switch]$DryRun
)

$Source = (Resolve-Path -LiteralPath $Source).Path
$targets = @(
    (Join-Path $HOME ".codex/skills/load-testing"),
    (Join-Path $HOME ".claude/skills/load-testing"),
    (Join-Path $HOME ".config/opencode/skills/load-testing"),
    (Join-Path $HOME ".copilot/skills/load-testing"),
    (Join-Path $HOME ".gemini/skills/load-testing"),
    (Join-Path $HOME ".gemini/config/skills/load-testing"),
    (Join-Path $HOME ".qwen/skills/load-testing"),
    (Join-Path $HOME ".kiro/skills/load-testing"),
    (Join-Path $HOME ".cline/skills/load-testing"),
    (Join-Path $HOME ".roo/skills/load-testing"),
    (Join-Path $HOME ".kilo/skills/load-testing"),
    (Join-Path $HOME ".warp/skills/load-testing"),
    (Join-Path $HOME ".openclaw/skills/load-testing"),
    (Join-Path $HOME ".agents/skills/load-testing")
)

foreach ($target in $targets) {
    if (Test-Path -LiteralPath $target) {
        $item = Get-Item -LiteralPath $target -Force
        if ($item.LinkType -eq "SymbolicLink" -and $item.Target -contains $Source) {
            Write-Output "Already linked: $target"
            continue
        }
        throw "Refusing to replace existing path: $target"
    }

    if ($DryRun) {
        Write-Output "Would link: $target -> $Source"
        continue
    }

    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $target) | Out-Null
    New-Item -ItemType SymbolicLink -Path $target -Target $Source | Out-Null
    Write-Output "Linked: $target -> $Source"
}
