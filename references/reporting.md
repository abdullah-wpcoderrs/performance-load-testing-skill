# Reporting contract

Store every load-test document under the project-root `load-test/` directory. Always create or update `load-test/Report.md`. Do not scatter generated reports through `docs/` or the project root.

## Artifact allocation

Use `scripts/next_report_path.py` before every run. Never reuse a filename, even after a failed or aborted test if an HTML file was created.

Use this command form with actual paths:

```bash
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=load-test/load-test-N.html k6 run tests/load/<type>-test.js
```

For the first run, omit `-N`. The built-in web dashboard is available while k6 runs; the export is the durable artifact.

## Cumulative human-readable report

Keep one document title:

````markdown
# Load Test Report
````

Prepend each newest run immediately below it. Use this structure, adapting metric rows to the actual test:

````markdown
## 2026-07-14T16:30:00+01:00 — Stress test

### Outcome

- Status: passed | failed | aborted for safety | generator-limited | not run
- One-sentence plain-English verdict

### Results at a glance

| Figure | Observed | Target | Result |
|---|---:|---:|---|
| p95 response time | ... | ... | pass/fail |
| HTTP errors | ... | ... | pass/fail |
| Functional checks | ... | ... | pass/fail |

### What happened in plain English

- Explain the traffic shape as simulated people or requests.
- Explain whether the app stayed available, became slow, lost correctness, or recovered.
- State the most important result without jargon.

### What the figures mean

- Explain only metrics that appear in this run, such as VUs, p95, maximum latency, throughput, error rate, checks, response size, recovery, interrupted iterations, and dropped iterations.
- Clarify that a maximum above a p95 target does not itself fail a p95 threshold.
- Distinguish intended load from achieved throughput.

### Errors and warnings explained

- Explain every failed threshold, non-zero error, failed check, interruption, dropped iteration, safety abort, missing HTML export, or incomplete measurement.
- If there were no application errors, say so explicitly.
- Separate slowness from broken responses and script/generator problems.

### Recommended next steps

1. Give the highest-value project improvement supported by evidence.
2. Explain what telemetry or query evidence is needed before asserting a root cause.
3. Recommend the next test and why.

### Documents

- Report: `load-test/Report.md`
- HTML dashboard: `load-test/load-test-2.html`
- Test script: `tests/load/stress-test.js`

### Technical record

- Target: sanitized environment and base URL
- Scope: tested journey or endpoints
- Script: `tests/load/stress-test.js`
- HTML report: `load-test/load-test-2.html`
- Load model, stages, duration, pacing, thresholds, assumptions, exclusions, achieved throughput, iterations, checks, dropped/interrupted iterations, and relevant custom/browser metrics

```bash
<exact sanitized command>
```
````

Add the breakpoint-specific sections from `breakpoint-testing.md` for capacity tests.

## Plain-language requirements

- Define figures in the context of the observed result, not as a generic glossary dump.
- Translate VUs into simulated users or workers and p95 into “95 out of 100 requests.”
- Explain whether users saw errors, correct-but-slow pages, or incorrect content.
- Explain recovery as how quickly the application returned to normal after load fell.
- Treat interrupted iterations at planned stage boundaries as test-runner bookkeeping unless evidence shows application failure.
- Explain dropped iterations only for arrival-rate workloads and correlate them with generator/target telemetry.
- Treat response size as an efficiency signal even when it passes a generous safety limit.
- When a run passes, still recommend evidence-based improvements and the next confidence-building test.
- When a run fails, prioritize fixes but do not claim a root cause from thresholds alone.
- When comparable runs disagree, explain warm-up, caching, network, data, environment, and telemetry limitations without choosing one cause without evidence.

## Reporting rules

- Use an ISO 8601 timestamp with the local UTC offset.
- Sanitize credentials, tokens, cookies, query secrets, and personal test data.
- Do not call a threshold-only result proof of root cause.
- Do not call intended VUs or rate achieved load; use observed k6 metrics.
- Include achieved throughput, iterations, checks, dropped/interrupted iterations, and relevant browser/custom metrics. Use `not available` rather than inventing values.
- Explain aborted and incomplete runs and preserve any partial evidence.
- Compare with an earlier run only when environment, script, workload, and data are sufficiently equivalent.
- Link or name the exact script and numbered HTML artifact.
- Ensure the final user response mirrors the report: outcome first, results, plain-English meaning, next steps, then artifact links.
