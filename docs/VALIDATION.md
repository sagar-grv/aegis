# InsightLoop — Validation Record

| Check | Result |
|---|---|
| TypeScript after InsightLoop rewrite | Passed with zero reported errors. |
| Production build | Passed with `pnpm build`. |
| Unit tests | Passed: logout, diagnosis schema validation, bounded-score rejection, path-status mapping, unauthenticated/forbidden rejection, malformed input rejection, plus mocked authenticated learner workspace, submission persistence, and authorised teacher success paths. |
| Live model catalogue | Queried before selecting the production model. |
| Live structured AI contract | Passed. A non-persistent `gpt-5-mini` probe returned all eight required diagnosis fields with bounded scores. |
| Learner data seeding | None. Empty states remain empty until an authenticated user submits work. |

## Independent Validation Boundary

The final database write requires a real authenticated learner account. The app deliberately prevents artificial learner records, so the protected end-to-end mutation was not invoked with fabricated data. Its authentication gate and positive procedure contract were verified with isolated unit tests; its schema, persistence code, and structured model response were independently verified. Follow [`ACTIVATION_GUIDE.md`](ACTIVATION_GUIDE.md) to perform the final user-owned submission.

| Evaluation criterion | Evidence |
|---|---|
| Innovation | Misconception-linked learning thread and next diagnostic probe. |
| Technical implementation | Authenticated full-stack flow, strict AI schema, MySQL persistence, role-gated analytics. |
| Problem solving | Distinguishes reasoning patterns, not only answer correctness. |
| User experience | Calm learner flow, visible confidence, explainable feedback, no fabricated activity. |
| Scalability | Structured data model and role boundary support institutional extensions. |
| Presentation | Live app, documentation, activation guide, and recording script. |
