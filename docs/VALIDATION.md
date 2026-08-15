# InsightLoop — Validation Record

| Check | Result |
|---|---|
| TypeScript after InsightLoop rewrite | Passed with zero reported errors. |
| Production build | Passed with `pnpm build`. |
| Unit tests | Passed: logout, diagnosis schema validation, bounded-score rejection, path-status mapping, unauthenticated/forbidden rejection, malformed input rejection, plus mocked authenticated learner workspace, submission persistence, and authorised teacher success paths. |
| Live model catalogue | Queried before selecting the production model. |
| Live structured AI contract | Passed. A non-persistent `gpt-5-mini` probe returned all eight required diagnosis fields with bounded scores. |
| Full-stack integration probe | Passed. A temporary account invoked the live diagnosis path, persisted one attempt and adaptive path, appeared in teacher aggregates, and was then deleted; a database query confirmed zero temporary probe users remained. |
| Diagnosis failure safety | Passed. A simulated provider failure is returned to the protected mutation and does not call the persistence layer; the learner interface displays the resulting error message. |
| Browser failure and retry state | Passed. A development-only non-persistent probe displayed the learner-facing error banner while leaving the form available for retry; the probe was removed after verification. |
| Learner data seeding | None. Empty states remain empty until an authenticated user submits work. |

## Independent Validation Boundary

The first user-owned submission requires an authenticated learner account. InsightLoop includes a documented activation sequence for that moment, but does not impersonate an owner or leave fabricated learner data in the workspace. The system itself has been tested with an automatically cleaned temporary integration probe, isolated positive and negative protected-route tests, and a live structured-model contract probe.

| Evaluation criterion | Evidence |
|---|---|
| Innovation | Misconception-linked learning thread and next diagnostic probe. |
| Technical implementation | Authenticated full-stack flow, strict AI schema, MySQL persistence, role-gated analytics. |
| Problem solving | Distinguishes reasoning patterns, not only answer correctness. |
| User experience | Calm learner flow, visible confidence, explainable feedback, no fabricated activity. |
| Scalability | Structured data model and role boundary support institutional extensions. |
| Presentation | Live app, documentation, activation guide, and recording script. |
