# Reporting contract

Store every HTML export and the cumulative Markdown report under `docs/` unless the repository has an explicit equivalent convention approved by the user.

## Artifact allocation

Use `scripts/next_report_path.py` before every run. Never reuse a filename, even after a failed or aborted test if an HTML file was created.

Use this command form with actual paths:

```bash
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=docs/load-test-N.html k6 run tests/load/<type>-test.js
```

For the first run, omit `-N`. The built-in web dashboard is available while k6 runs; the export is the durable artifact.

## Cumulative Markdown layout

Keep one document title:

```markdown
# k6 Load Test Report
```

Prepend each newest run immediately below it using this structure:

```markdown
## 2026-07-14T16:30:00+01:00 — Stress test

### Outcome

- Status: passed | failed | aborted for safety | generator-limited | not run
- Target: sanitized environment and base URL
- Scope: tested journey or endpoints
- Script: `tests/load/stress-test.js`
- HTML report: `docs/load-test-2.html`

### Workload and criteria

- Load model and rationale
- Stages, VUs/arrival rate, duration, and pacing
- Checks and thresholds
- Assumptions and exclusions

### Execution

```bash
<exact sanitized command>
```

### Results

| Metric | Observed | Criterion | Result |
|---|---:|---:|---|
| `http_req_duration p(95)` | ... | ... | pass/fail |
| `http_req_failed` | ... | ... | pass/fail |

Include achieved throughput, iterations, checks, dropped iterations, and relevant browser/custom metrics. Use `not available` rather than inventing values.

### Findings

- Describe when degradation began and correlate it with workload stages.
- Separate application failures from script, network, test-data, and generator failures.
- State whether the application recovered after load fell.

### Recommendations

1. Give evidence-linked remediation or the next test.
2. State limitations that prevent stronger conclusions.
```

Add the breakpoint-specific sections from `breakpoint-testing.md` for capacity tests.

## Reporting rules

- Use an ISO 8601 timestamp with the local UTC offset.
- Sanitize credentials, tokens, cookies, query secrets, and personal test data.
- Do not call a threshold-only result proof of root cause.
- Do not call intended VUs or rate achieved load; use observed k6 metrics.
- Explain aborted and incomplete runs and preserve any partial evidence.
- Compare with an earlier run only when environment, script, workload, and data are sufficiently equivalent.
- Link or name the exact script and numbered HTML artifact.
