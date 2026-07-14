# load-testing

A portable [Agent Skills](https://agentskills.io) package for creating, safely running, and reporting Grafana k6 performance tests for web applications and APIs.

The skill supports the full k6 load-testing cycle:

- Smoke
- Average-load
- Stress
- Soak
- Spike
- Breakpoint (capacity discovery)

It inspects the project first, asks a compact intake, creates a focused k6 script, runs an authorized test with a live dashboard, exports a numbered HTML result, and prepends the result to `docs/load-test.md`.

## Requirements

- A compatible AI coding agent with Agent Skills support.
- Python 3 for the report artifact helpers.
- Grafana k6 to run tests.
- Authorization to generate traffic against the target environment.

## Install k6

### macOS

Install k6 with Homebrew:

```bash
brew install k6
k6 version
```

### Windows

Install the official winget package in PowerShell:

```powershell
winget install k6 --source winget
k6 version
```

If you use Chocolatey, its k6 package is also available:

```powershell
choco install k6
k6 version
```

The [Grafana k6 installation guide](https://grafana.com/docs/k6/latest/set-up/install-k6/) also covers standalone binaries, Docker, extensions, and upgrades.

## Install the skill

Keep this directory as the source of truth. Symlinks let compatible agents use the same copy, so changes are immediately shared.

### Node.js installer (recommended)

With Node.js 18 or newer, install directly from GitHub:

```bash
npx github:abdullah-wpcoderrs/performance-load-testing-skill
```

The command copies the skill into `~/.agent-skills/load-testing`, then creates the documented agent symlinks. The durable copy matters: it prevents links from pointing into the temporary `npx` cache. It never replaces an unrelated directory or link.

Preview an installation without making changes:

```bash
npx github:abdullah-wpcoderrs/performance-load-testing-skill -- --dry-run
```

To update a copy previously installed by this command, run:

```bash
npx github:abdullah-wpcoderrs/performance-load-testing-skill -- --force
```

After publishing this package to npm, users can use the shorter equivalent command:

```bash
npx performance-load-testing-skill
```

### macOS and Linux

From the `load-testing` directory, run:

```bash
./scripts/register-symlinks.sh
```

This registers the documented user-level locations below. Every link points to this one checked-out directory; it does not duplicate the skill or overwrite a pre-existing path.

| Discovery location | Agents covered |
|---|---|
| `~/.codex/skills/load-testing` | Codex; Warp also scans it |
| `~/.claude/skills/load-testing` | Claude Code; OpenCode, Warp, and GitHub Copilot also recognize it |
| `~/.config/opencode/skills/load-testing` | OpenCode |
| `~/.copilot/skills/load-testing` | GitHub Copilot CLI and compatible Copilot surfaces; Warp also scans it |
| `~/.gemini/skills/load-testing` | Gemini CLI; Warp also scans it |
| `~/.qwen/skills/load-testing` | Qwen Code |
| `~/.kiro/skills/load-testing` | Kiro |
| `~/.cline/skills/load-testing` | Cline |
| `~/.roo/skills/load-testing` | Roo Code |
| `~/.kilo/skills/load-testing` | Kilo Code |
| `~/.warp/skills/load-testing` | Warp |
| `~/.openclaw/skills/load-testing` | OpenClaw |
| `~/.agents/skills/load-testing` | Gemini CLI, GitHub Copilot, OpenHands, Roo Code, Zed, OpenClaw, and other Agent Skills-compatible tools |

The script never replaces an existing nonmatching directory or link. Preview changes first with:

```bash
./scripts/register-symlinks.sh --dry-run
```

### Windows

Run PowerShell from the `load-testing` directory:

```powershell
.\scripts\register-symlinks.ps1
```

Windows must allow symbolic links (Developer Mode or an elevated PowerShell session). Preview changes first:

```powershell
.\scripts\register-symlinks.ps1 -DryRun
```

## Compatibility: 24 major AI agents

This is a researched, explicit list of 24 major agent products and surfaces as of July 2026—not a claim that every AI tool in existence supports local skills. “Registered” means the supplied scripts create a documented symlink. “Project” means commit a symlink or copy under the project’s documented skills root. “Import” means use the product UI; a filesystem symlink is not its documented mechanism.

| # | Agent | Support | Installation / invocation |
|---:|---|---|---|
| 1 | Codex | Registered | Select `load-testing`, then provide `stress test` (or `$load-testing stress test`). |
| 2 | Claude Code | Registered | `/load-testing stress test`. |
| 3 | OpenCode | Registered | Use the discovered `load-testing` skill and provide the test type. |
| 4 | GitHub Copilot CLI | Registered | Invoke `/load-testing stress test`; use `/skills reload` in an open session. |
| 5 | GitHub Copilot cloud agent / code review / app | Project | Link or copy to `.github/skills/load-testing`; Copilot supports the same Agent Skills format across these surfaces. |
| 6 | VS Code agent mode | Project | Use `.github/skills/load-testing` or `.agents/skills/load-testing` in the repository. |
| 7 | Cursor | Project | Use Cursor’s documented project skill/command workflow; no unverified global link is created. |
| 8 | Gemini CLI | Registered | Run `/skills reload`, then ask it to activate `load-testing stress test`. |
| 9 | Qwen Code | Registered | Invoke `/load-testing stress test`. |
| 10 | Kiro | Registered | The global skill is discovered from `~/.kiro/skills`; supply the test type in the chat. |
| 11 | Cline | Registered | Enable Skills in **Settings → Features** first, then use the skill. |
| 12 | Roo Code | Registered | The global skill is discovered from `~/.roo/skills` (and shared `.agents`). |
| 13 | Kilo Code | Registered | The global skill is discovered from `~/.kilo/skills`. |
| 14 | OpenHands | Registered via shared root | Uses `~/.agents/skills`; for teams use project `.agents/skills/load-testing`. |
| 15 | Replit Agent | Project | Add the folder under `/.agents/skills/load-testing` in the Replit project. |
| 16 | Devin | Project | Add it to `.agents/skills/load-testing`; invoke `@skills:load-testing` with the test type. |
| 17 | TRAE | Import | In **Settings → Rule & Skills → Skills → Create**, import this folder or `SKILL.md`. |
| 18 | Warp | Registered | Warp scans `~/.warp/skills` and the shared roots; call `/load-testing stress test`. |
| 19 | Zed | Registered via shared root | Place it in `~/.agents/skills` or project `.agents/skills`. |
| 20 | OpenClaw | Registered | It loads `~/.openclaw/skills` and `~/.agents/skills`; call `/load-testing stress test`. |
| 21 | Claude apps (Claude.ai/Desktop) | Import | Upload the skill folder/package from Claude’s Skills interface; local links are not synced to Claude. |
| 22 | Gemini apps | Import | Upload the skill folder/package from Gemini’s Skills interface; local links are not synced to Gemini. |
| 23 | Mistral Vibe Work | Import | In **Context → Skills**, create/import the skill; invoke `/load-testing stress test`. |
| 24 | Goose | Marketplace / manual setup | The package format is portable, but no documented local Agent Skills discovery root is assumed by the scripts. |

Amazon Q Developer is deliberately not counted in the 24: it does not document Agent Skills discovery at the time of this README. A symlink cannot add a capability an agent does not implement.

### Project-local symlink

For agents marked **Project**, link the entire directory into the project’s exact documented skill root, then commit it only when your team accepts symlinks in the repository:

```bash
mkdir -p .agents/skills
ln -s "$(pwd)/load-testing" .agents/skills/load-testing
```

Use `.github/skills` for GitHub Copilot-specific projects and the agent’s own project root where it requires one (for example `.gemini/skills`, `.kiro/skills`, or `.cline/skills`).

## Use the skill

The command presentation differs by agent:

- **Codex:** select `load-testing` in the skill picker, then provide the test type. Text form: `$load-testing stress test`.
- **Claude Code:** `/load-testing stress test`.
- **OpenCode:** ask the agent to use the `load-testing` skill, then provide the test type. OpenCode discovers the skill through its native skill tool.
- **TRAE:** tell TRAE to use the imported `load-testing` skill, then provide the test type.
- **GitHub Copilot CLI, Gemini CLI, Qwen Code, Warp, and OpenClaw:** `/load-testing stress test` after refreshing or restarting the session if needed.

For smoke, average-load, stress, soak, and spike tests, the skill asks one set of no more than five consolidated questions. It always asks for the VU/load model and gathers target authorization, scope, duration, thresholds, and safe test-data details.

Breakpoint tests use a separate, more rigorous capacity-discovery preflight. They require explicit target ownership, staged ceilings, stop conditions, observability, recovery planning, and a final `RUN BREAKPOINT TEST` confirmation.

## Examples: complete test cycle

Each example starts the same reusable workflow but chooses a different traffic profile.

### 1. Smoke test

```text
/load-testing smoke test for the login and dashboard journey in staging
```

Use this after changing the application or test script. Expect minimal VUs and a short duration; continue only if checks, baseline latency, and error rate are healthy.

### 2. Average-load test

```text
/load-testing average-load test for the search and checkout journeys using normal weekday traffic
```

Use this to validate normal-production SLOs. The skill models a controlled ramp-up, stable plateau, and ramp-down, then records steady-state results.

### 3. Stress test

```text
/load-testing stress test for the checkout API at the expected campaign peak
```

Use this to examine behavior above normal load. The skill defines an agreed maximum, stop conditions, controlled stages, and recovery observation.

### 4. Soak test

```text
/load-testing soak test for the authenticated reporting workflow over four hours
```

Use this to find long-running degradation such as memory, connection, queue, or data-growth issues. The report compares trends over time and records recovery.

### 5. Spike test

```text
/load-testing spike test for the product launch landing page and purchase API
```

Use this to assess survival and recovery under an abrupt surge. The skill focuses on the jump, peak, errors, autoscaling delay, and return to normal service.

### 6. Breakpoint test

```text
/load-testing breakpoint test for the order-submission API in the isolated performance environment
```

Use this only with a supervised, authorized capacity plan. After the expanded preflight and a displayed run plan, the skill requires the exact final confirmation:

```text
RUN BREAKPOINT TEST
```

It reports the last healthy and first unhealthy load stages, whether the target or load generator limited the test, recovery, confidence, and a recommended operating margin.

## Generated artifacts

For every run, the skill allocates a new HTML dashboard export and preserves a cumulative report:

```text
docs/load-test.html
docs/load-test-2.html
docs/load-test-3.html
docs/load-test.md
```

The execution command always enables the real-time dashboard and exports the allocated HTML file:

```bash
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=docs/load-test.html k6 run tests/load/stress-test.js
```

The skill substitutes the real script and the next available report filename. Every `docs/load-test.md` entry is timestamped, prepended without deleting previous evidence, and includes the sanitized command, workload, thresholds, outcome, metrics, findings, and recommendations.

## References

- [k6 load test types](https://grafana.com/docs/k6/latest/testing-guides/test-types/)
- [k6 web dashboard](https://grafana.com/docs/k6/latest/results-output/web-dashboard/)
- [Claude Code skills and slash commands](https://code.claude.com/docs/en/slash-commands)
- [OpenCode Agent Skills](https://opencode.ai/docs/skills/)
- [TRAE Agent Skills](https://www.trae.ai/blog/trae_tutorial_0115)
- [GitHub Copilot Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [Gemini CLI Agent Skills](https://geminicli.com/docs/cli/using-agent-skills/)
- [Warp Skills](https://docs.warp.dev/agent-platform/capabilities/skills)
- [OpenClaw Skills](https://docs.openclaw.ai/skills)
- [Mistral Vibe Work Skills](https://docs.mistral.ai/vibe/work/skills)
