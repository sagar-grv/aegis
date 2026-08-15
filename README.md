# Aegis — The Decision Refusal Engine

> **STAMPERS National Hackathon 2026 · Track 01 — Artificial Intelligence**

**Aegis is an evidence-aware decision layer for exposed outdoor operations in India.** It does not pretend that every set of signals supports an answer. Instead, it combines live weather and atmospheric evidence with authenticated operator observations, makes the quality of evidence visible, and explicitly **refuses** an autonomous recommendation when a decisive fact is missing.

The centrepiece is a browser-visible **hard mode**. Removing a live source forces Aegis to recompute coverage and confidence, issue a refusal where appropriate, and request the *smallest fact that can unblock a decision*. This makes safe non-action a product capability, rather than a generic disclaimer.

| Submission dimension | Aegis implementation |
| --- | --- |
| **Novelty** | Treats refusal as a primary AI outcome: evidence loss makes the system *less* decisive, not more performative. |
| **Real-world data** | Pulls live coordinate-based weather, precipitation probability, and air-quality signals from Open-Meteo; it does not seed environmental data. [1] [2] |
| **Hard-mode fit** | A one-click controlled evidence loss hides 25%–50% of the evidence graph and visibly triggers the abstention policy. |
| **Explainability** | Shows source provenance, confidence, evidence coverage, operational exposure, anomalies, and the smallest missing fact. |
| **Human accountability** | Authenticated operators may supply attributable text, a measured gust value, and an optional field photo; a final human decision receipt is stored separately from the recommendation. |

## What Works

Aegis uses four India-based operating sites for a realistic, coordinate-driven desk: Bengaluru’s Cubbon Park, New Delhi’s India Gate, Mumbai’s Oval Maidan, and Hyderabad’s Tank Bund. A site selection calls the public live-evidence procedure; no client-side placeholder replaces a failed upstream response.

| Evidence stream | Retrieval or input | What Aegis uses |
| --- | --- | --- |
| **Wind & weather** | Open-Meteo Forecast API | Current temperature, apparent temperature, precipitation, sustained wind, gusts, and weather code. [1] |
| **Rain likelihood** | Open-Meteo Forecast API | Short-range hourly precipitation probability. [1] |
| **Air exposure** | Open-Meteo Air Quality API | PM2.5, PM10, nitrogen dioxide, ozone, and consolidated US AQI. [2] |
| **Field observation** | Authenticated operator | Human condition label, real note, optionally measured gusts, and an optional photo-derived *visual observation*. |

The optional photo workflow accepts a JPEG, PNG, or WebP image of up to 2.5 MB from the signed-in operator. The original image is stored against that operator’s report. Server-side `gemini-3-flash-preview` produces a constrained, schema-validated visual observation of scene conditions; it is attributed context only. It cannot decide, approve, restrict, or execute an operation.

> **Safety boundary:** Aegis is a decision-support and evidence-refusal interface. It does not control people, vehicles, emergency services, or field equipment. A human operator remains responsible for every operational action.

## Decision Policy

The decision engine is deterministic and inspectable. Coverage counts available live or operator evidence across weather, rain, air, and field sources. A missing decisive source reduces confidence. High gusts, poor air quality, high rain likelihood, unsafe field conditions, and a material disagreement between measured and forecast gusts contribute explainable anomalies and operational exposure.

| Result | Trigger | Interface response |
| --- | --- | --- |
| **Proceed** | Adequate evidence and no high-severity condition | Continue normal monitoring and refresh on material change. |
| **Restrict** | Adequate evidence with elevated exposure or a high-severity anomaly | Restrict exposed activity and require a human acknowledgement. |
| **Refuse** | Confidence below 60%, or weather and field evidence are both absent | Decline an autonomous operational recommendation and request the smallest missing fact. |

## Quick Start

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
```

The full stack uses React 19, TypeScript, Vite, Express, tRPC, Drizzle, MySQL, built-in OAuth, object storage, and server-side model calls. Environment credentials are supplied by the managed runtime; do **not** commit `.env` files or substitute browser-side secrets.

## Deployment Boundary

The dedicated Vercel deployment at [aegis-ecru.vercel.app](https://aegis-ecru.vercel.app) has been verified for the public, live-data decision desk and hard mode. It invokes the deployed public tRPC procedure and returns real Open-Meteo evidence. The protected operator features require OAuth, database, object-storage, and server-side model credentials in the Vercel project before they can be used on that external domain; those secrets are intentionally not copied from the managed runtime.

## Validation Snapshot

The current validation record confirms a live Bengaluru public assessment, a hard-mode weather-source omission that produced a refusal at 50% coverage and 40% confidence, persistence of an operator field report and human review receipt through a self-cleaning integration probe, and a clean database after that probe. The automated suite contains **16 passing tests**, including five Aegis-specific decision and field-photo input tests. See [Aegis validation](docs/AEGIS_VALIDATION.md).

## Project Map

| Path | Responsibility |
| --- | --- |
| `client/src/pages/Home.tsx` | Decision desk, source ledger, hard mode, field-evidence modal, and human-review receipt UI. |
| `server/aegis.ts` | Live Open-Meteo retrieval and deterministic confidence, refusal, and risk policy. |
| `server/aegisPhoto.ts` | Photo input guardrails and structured visual-observation extraction. |
| `server/routers.ts` | Public evidence and protected authenticated Aegis procedures. |
| `server/db.ts` | Field-report and immutable decision-receipt persistence helpers. |
| `docs/PROJECT_DOCUMENTATION.md` | Architecture, operating policy, privacy boundaries, and test plan. |
| `docs/DEMO_SCRIPT.md` | Feature-by-feature live demo script. |
| `docs/SUBMISSION_LINKS.md` | Repository, deployment, and video link register. |

## References

[1] [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs)

[2] [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)
