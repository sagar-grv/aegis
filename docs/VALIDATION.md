# Aegis — Validation Record

## Verified Checks

| Check | Result | Evidence |
| --- | --- | --- |
| Production build | Pass | `pnpm build` completed after the public assessment clarification and the field-photo feature. |
| Automated tests | Pass | `pnpm test` completed with 18 passing tests across six suites. |
| Live public evidence | Pass | The browser resolved current Bengaluru weather, gust, precipitation probability, air-quality, timezone, provenance, and a public recommendation. |
| Hard-mode evidence loss | Pass | Hiding `Wind & weather` produced 50% coverage, 40% confidence, explicit refusal, and a fresh on-site wind-gust request. |
| Persistence probe | Pass | The self-cleaning full-stack integration probe retrieved live evidence, saved a temporary field report and review receipt, then verified cleanup. |
| Field-photo input safety | Pass | A dedicated unit suite accepts bounded JPEG input and rejects unsupported MIME types and oversized data. |
| Visual-observation authority boundary | Pass | Aegis policy regression test proves that a visual observation alone leaves field evidence absent and cannot change coverage or the decision. |
| Public-contribution authority boundary | Pass | Aegis policy regression test proves an unattributed public safety concern remains visible while leaving risk score and recommendation unchanged. |
| Live model catalog | Pass | The current catalog was checked before selecting the multimodal `gemini-3-flash-preview` visual-observation model. |

## Independent Validation Boundary

The field-report and human-response procedures are intentionally public. A self-cleaning public API probe saved an unattributed field contribution and receipt through the actual public procedures, verified the null operator identifier and `unattributed` marker in persistence, then deleted both temporary rows. No user account was impersonated and no fabricated operational record remains in the database.

The optional photo path validates the file boundary locally and applies strict server-side schema validation to the model output. Its first real photo submission must use a presenter’s privacy-safe, genuine scene image and is documented in the [activation guide](ACTIVATION_GUIDE.md) and [demo script](DEMO_SCRIPT.md).

| Evaluation criterion | Aegis evidence |
| --- | --- |
| Innovation and creativity | Refusal is a first-class result; the system makes missing evidence operationally visible. |
| Technical implementation | Live APIs, deterministic policy, anonymous public reporting with explicit attribution state, persistence, object storage, and constrained visual extraction. |
| Problem solving | The smallest-missing-fact prompt turns an unsafe unknown into a bounded human task. |
| User experience | Provenance, coverage, exposure, anomaly scan, and human actions share one responsive decision desk. |
| Scalability | Source adapters, typed procedures, structured records, and explicit decision policy separate concerns. |
| Presentation | The live hard-mode demonstration is directly recordable through the documented walkthrough. |
