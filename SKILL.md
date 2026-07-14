---
name: load-testing
description: Create, run, and report safe Grafana k6 performance tests for web applications and APIs. Use when the user invokes load-testing or asks for a smoke, average-load/load, stress, soak/endurance, spike, or breakpoint/capacity test; needs a k6 script, workload model, thresholds, live web dashboard, numbered HTML result, or docs/load-test.md report; or wants to interpret and compare k6 results.
---

# k6 Load Testing

Create a project-aware k6 test, run it only when authorized, and preserve reviewable evidence.

## Interpret the request

Treat text following the skill invocation as the requested type. Normalize these aliases:

- `smoke` -> smoke
- `load`, `average`, `average load` -> average-load
- `stress` -> stress
- `soak`, `endurance` -> soak
- `spike` -> spike
- `breakpoint`, `capacity`, `limit` -> breakpoint

If the type is absent or ambiguous, ask only which of the six types to use before continuing. Do not silently substitute stress for breakpoint or average-load for stress.

## Inspect before asking

Inspect the repository for its stack, existing tests, documented user journeys, environment examples, authentication helpers, k6 conventions, and `docs/` contents. Use `rg` and `rg --files`. Check `k6 version`. Do not open secret files or print credential values.

Read [references/test-types.md](references/test-types.md) for the selected workload. Read [references/k6-authoring.md](references/k6-authoring.md) before writing a script. For breakpoint tests, also read [references/breakpoint-testing.md](references/breakpoint-testing.md). Read [references/reporting.md](references/reporting.md) before running or reporting.

## Ask the intake questions

For smoke, average-load, stress, soak, and spike tests, ask one compact set of at most five numbered questions. Always ask for VU/load values even if the repository suggests defaults. Consolidate subparts under these five questions:

1. Confirm the base URL, environment, ownership/authorization, and whether third-party services must be excluded.
2. Confirm the critical journey or endpoints, request mix, and protocol, browser, or hybrid scope.
3. Confirm the VU count or arrival rate, duration, ramp stages, and expected normal and peak traffic. Offer test-type defaults when values are unknown.
4. Confirm pass/fail criteria: latency percentiles, error rate, throughput, and relevant browser or business thresholds.
5. Confirm authentication mechanism, safe test-data source, required headers, cleanup needs, and any execution constraints.

Do not split these into follow-up questions unless an answer makes safe execution impossible. Infer non-risky implementation details from the repository and state the assumptions.

For breakpoint tests, use the expanded preflight in [references/breakpoint-testing.md](references/breakpoint-testing.md). Breakpoint testing is intentionally allowed more than five questions.

## Build the test

Create or update a focused script under the repository's established performance-test directory. If none exists, use `tests/load/<type>-test.js`. Preserve unrelated user changes and reuse shared journey modules when available.

Implement all applicable requirements:

- Read target URLs and non-public configuration from environment variables.
- Keep secrets and unique credentials out of source, commands, reports, and HTML filenames.
- Separate iteration logic from workload configuration.
- Add functional `check()` calls and test-specific thresholds.
- Use tags and groups for important journeys and endpoints.
- Model realistic pacing and varied test data where appropriate.
- Exclude third-party requests unless the user proves authorization.
- Add graceful ramp-down and cleanup behavior when the workload permits it.
- Keep browser VUs small in hybrid tests and generate most load at protocol level.
- Add comments explaining assumptions that materially affect the traffic model.

Run a syntax/smoke validation before any larger workload. If k6 is unavailable, do not install it without permission; still create the script and record the blocked run state in the report.

## Allocate report artifacts

From the project root, run:

```bash
python3 <skill-dir>/scripts/next_report_path.py --project-root .
```

Use the returned relative path exactly. The sequence must be:

- `docs/load-test.html`
- `docs/load-test-2.html`
- `docs/load-test-3.html`
- and so on

Never overwrite an existing HTML report.

## Present and run the command

Build the full command with the live dashboard and allocated HTML export:

```bash
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=docs/load-test.html k6 run tests/load/stress-test.js
```

Replace both paths with the actual allocated report path and script path. Add safe `-e` values only when needed; pass secrets through the environment without echoing them.

Show the workload summary, target environment, stop conditions, and exact command before execution. Treat the answered authorization question as approval for routine tests when its scope clearly covers the proposed workload. Ask again if the final workload exceeds that scope or targets production. For breakpoint tests, always require the explicit launch confirmation defined in the breakpoint reference.

Monitor the run. Stop when an agreed safety condition is reached, the target becomes unhealthy, or the load generator—not the target—saturates. Do not claim application capacity from a generator-limited run.

## Write the report

Create a temporary Markdown section following [references/reporting.md](references/reporting.md), then prepend it beneath the document title with:

```bash
python3 <skill-dir>/scripts/prepend_report.py \
  --report docs/load-test.md \
  --section <temporary-section.md>
```

Use an ISO 8601 timestamp with timezone in every section heading. Preserve every previous section. Report observed values only; label estimates and incomplete runs clearly. Include the exact sanitized command and links/paths to the script and numbered HTML report.

## Finish

Summarize the test type, outcome, most important bottleneck or result, created artifacts, and the next recommended test. Distinguish among `passed`, `failed`, `aborted for safety`, `generator-limited`, and `not run`.
