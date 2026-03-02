# Engineering Review Charter

This repository follows a strict review order for every code change:

1. Correctness
2. Reliability
3. Security
4. Performance
5. Maintainability
6. Style

## Blocker vs Non-blocker

### Blocker
- Data loss or data corruption risk
- Security hole (auth/authz, injection, traversal, secrets exposure)
- Unhandled failure path that can crash flows
- Race condition or non-idempotent retry behavior
- Undefined behavior in core logic
- Migration/deploy rollback risk without mitigation

### Non-blocker
- Naming and stylistic preferences
- Refactors without measurable risk reduction
- Micro-optimizations without evidence

## Required Review Output

Every substantial change should include:

1. Bug and edge cases
   - Include concrete input examples and expected behavior
2. Threat model
   - What can go wrong and how it can be abused
3. Concurrency and state
   - Race risks, idempotency, retries, stale state
4. Complexity and performance
   - Big-O and real bottleneck candidates
5. Tests
   - What to add, why it protects high-cost failures
6. Observability and rollout
   - Logs/metrics/flags/rollback hooks

## Prove-It Rules

- Performance claim -> benchmark evidence
- Correctness claim -> invariant + test evidence
- New dependency -> reason, license, attack surface, alternatives
