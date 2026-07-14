# Test type selection

Use production observations and SLOs to set values. Treat the profiles below as starting shapes, not universal load numbers.

## Smoke

- Goal: validate script correctness, basic system health, and a minimal-load baseline.
- Shape: very low constant load for seconds to a few minutes or a small fixed iteration count.
- Prefer: `shared-iterations`, `per-vu-iterations`, or low `constant-vus`.
- Report: script/check failures, baseline latency, error rate, and whether larger testing is safe.
- Do not proceed to a larger test if the smoke run fails.

## Average-load

- Goal: validate SLOs under representative normal traffic.
- Shape: ramp to normal traffic, hold long enough to stabilize, then ramp down.
- Prefer: `ramping-vus` for concurrency-based journeys or `ramping-arrival-rate` for throughput targets.
- Report: steady-state latency percentiles, error rate, throughput, dropped iterations, resource stability, and threshold outcome.

## Stress

- Goal: assess behavior above normal traffic and around the expected peak.
- Shape: several increasing plateaus above average, a peak hold, then controlled ramp-down.
- Prefer: `ramping-vus` or `ramping-arrival-rate` based on the production traffic model.
- Report: first degradation point, peak sustainable stage, saturation signals, scaling behavior, failures, and recovery.
- Set a maximum planned load; a stress test is not an unbounded breakpoint test.

## Soak

- Goal: find degradation caused by prolonged operation.
- Shape: ramp to representative load, hold for hours, then ramp down.
- Prefer: `constant-vus`, `constant-arrival-rate`, or a simple ramp/hold/ramp scenario.
- Report: latency and error trends over time, memory/connection/queue growth, resource leaks, data accumulation, and post-run recovery.
- Use data rotation and cleanup so repeated writes do not invalidate the application.

## Spike

- Goal: validate survival and recovery during a sudden, short traffic surge.
- Shape: baseline, abrupt jump, short peak, abrupt or controlled return, recovery observation.
- Prefer: sharp `ramping-vus` or `ramping-arrival-rate` stages.
- Report: time to degradation, errors during the jump, autoscaling lag, queue/backlog behavior, data loss, and time to recovery.
- Define both spike height and recovery success before running.

## Breakpoint

- Goal: estimate the system's capacity boundary by increasing load until a defined limit is reached.
- Shape: progressively increasing plateaus with enough time at each step to observe stable behavior.
- Prefer: `ramping-arrival-rate` when capacity is expressed as throughput; use concurrency only when that matches the system's demand model.
- Report: last healthy load, first unhealthy load, limiting signal, confidence, generator headroom, and recovery.
- Follow [breakpoint-testing.md](breakpoint-testing.md); do not treat this as a routine automated test.

## Official sources

- https://grafana.com/docs/k6/latest/testing-guides/test-types/
- https://grafana.com/docs/k6/latest/testing-guides/load-testing-websites/
- https://grafana.com/docs/k6/latest/using-k6/scenarios/
