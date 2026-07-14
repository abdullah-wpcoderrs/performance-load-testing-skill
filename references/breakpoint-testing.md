# Breakpoint capacity-discovery workflow

Treat breakpoint testing as an intentionally disruptive, supervised experiment. Prefer an isolated environment that represents production capacity. Never run it against production or a shared environment without explicit, current authorization for the exact plan.

## Ask the expanded preflight

Ask these eight numbered questions. Consolidate related details and explain defaults briefly.

1. What target, environment, owner, approved test window, and written authorization cover this capacity test? Which third parties and shared dependencies are out of scope?
2. Which endpoint, component, or end-to-end journey defines capacity, and what request mix or business transaction represents one unit of demand?
3. Should capacity be measured in requests/iterations per second or concurrent VUs? What are the starting load, expected limit, absolute ceiling, and available load-generator capacity?
4. What increment, ramp duration, plateau duration, cooldown, and maximum total runtime should each discovery step use?
5. What exact stop conditions apply for latency, errors, failed checks, dropped iterations, target saturation, data integrity, infrastructure health, and operator abort?
6. Which target and generator telemetry will be observed—CPU, memory, connections, queues, database pools, autoscaling, network, and logs—and who will watch it?
7. What rollback, recovery validation, cleanup, cooldown, and incident contact plan applies if the target does not recover?
8. How should capacity be reported: comparison baseline, required confidence, capacity unit, safety margin, and whether a confirmation run near the boundary is allowed?

Resolve missing safety-critical answers before generating executable high-load stages. It is acceptable to create a draft plan and script marked `NOT AUTHORIZED TO RUN`.

## Design the experiment

1. Validate the journey with a smoke run.
2. Establish an average-load baseline.
3. Increase load through simple monotonic plateaus.
4. Hold each plateau long enough to distinguish transient scaling from sustained stability.
5. Stop at the first agreed limit, the absolute ceiling, generator saturation, or operator abort.
6. Observe recovery during a zero- or low-load cooldown.
7. Optionally confirm just below the suspected boundary only when pre-authorized.

Avoid rollercoaster profiles. Change one primary load variable at a time. Keep the generated traffic definition stable across plateaus.

## Require launch confirmation

After showing the target, ceiling, stages, stop conditions, observers, recovery plan, and full command, ask the user to respond with the exact phrase:

`RUN BREAKPOINT TEST`

Do not infer this confirmation from the initial skill invocation or preflight answers. If the plan changes materially after confirmation, require it again.

## Interpret the boundary

Classify the run before claiming capacity:

- `target-limited`: target telemetry and service metrics identify a system constraint.
- `generator-limited`: generator CPU/network/VU allocation or dropped iterations prevent the intended load.
- `safety-aborted`: an agreed guardrail ended the test before a boundary was established.
- `ceiling-reached`: the authorized maximum was reached while the target remained healthy.
- `inconclusive`: evidence cannot isolate the constraint or stability was not established.

Only a target-limited run supports a measured capacity interval. Report capacity as a range between the last healthy plateau and first unhealthy plateau, not as false precision.

## Breakpoint report additions

Add these sections to the standard report:

- Authorization, test window, observers, and environment isolation.
- Capacity unit and traffic definition.
- Plateau table with intended load, achieved load, latency, errors, dropped iterations, and target telemetry.
- Last healthy and first unhealthy plateaus.
- Limiting resource or symptom with evidence.
- Generator headroom and classification.
- Recovery timeline and residual impact.
- Capacity interval, confidence, recommended operating limit, and safety margin.
- Conditions required before rerunning or testing production.

Official source: https://grafana.com/docs/k6/latest/testing-guides/test-types/breakpoint-testing/
