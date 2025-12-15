## Mandatory Test-First Rule

- Every feature, refactor, or behavior change MUST include tests.
- Tests MUST be written or updated BEFORE implementation patches.
- If no test is possible, Gemini MUST explicitly justify why.

## Enforcement
- Any patch without corresponding tests is INVALID.
- Execution engines (Claude or others) MUST refuse to apply such patches.
- Reports MUST be written explaining the refusal.

## Allowed Test Types
- Unit tests (preferred)
- Component tests
- Integration tests (only if justified)

## Forbidden
- "We'll add tests later"
- Silent behavior changes
- Manual-only verification

