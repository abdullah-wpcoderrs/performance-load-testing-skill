# k6 authoring requirements

## Choose the load model

Use a closed model when concurrency itself represents demand. Use an open arrival-rate model when production demand arrives independently of response time. Record the choice and rationale in the report.

For an arrival-rate scenario, allocate enough VUs and inspect `dropped_iterations`. Dropped iterations can indicate insufficient VU allocation or an overloaded system; correlate them with generator and target telemetry before concluding.

## Structure the script

Keep these concerns separate:

1. Configuration and environment validation.
2. Reusable requests or user-journey functions.
3. Scenario workload configuration.
4. Checks, thresholds, tags, and custom metrics.
5. Setup and teardown only when they are safe and necessary.

Fail early with a clear message when a required non-secret environment variable is missing. Never print tokens, cookies, passwords, API keys, or full authenticated URLs.

## Validate correctness

Add checks for meaningful responses, not only status `200`. Validate redirects, expected payload fields, and business outcomes where applicable. Guard JSON parsing and dependent requests so overloaded responses do not crash the script and hide system behavior.

Checks collect correctness rates. Thresholds define pass/fail criteria. Include at least:

- an error or failed-check threshold;
- a latency percentile threshold;
- a journey- or endpoint-specific threshold when the test has multiple behaviors.

Use `abortOnFail` and an appropriate delay only for an agreed safety boundary. Do not use a threshold intended as an SLO as an accidental emergency stop without explaining that choice.

## Model web applications

- Use protocol-level HTTP tests for scalable backend load.
- Use browser tests for frontend/user-experience metrics.
- Use hybrid scenarios when both are needed, with fewer browser VUs.
- Exclude third-party services unless load-test authorization covers them.
- Reproduce realistic caching, cookies, request mixes, think time, and test-data diversity.

## Verify before the planned run

1. Run `k6 version`.
2. Review the generated script and diff.
3. Run a tiny validation or smoke workload against the authorized target.
4. Confirm checks, thresholds, and HTML path.
5. Confirm target and load-generator observability for risky tests.

## Official sources

- https://grafana.com/docs/k6/latest/using-k6/checks/
- https://grafana.com/docs/k6/latest/using-k6/thresholds/
- https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/
- https://grafana.com/docs/k6/latest/results-output/web-dashboard/
