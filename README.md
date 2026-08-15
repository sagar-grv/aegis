# Aegis — The Decision Refusal Engine

> **STAMPERS National Hackathon 2026 · Track 01 — Artificial Intelligence**

**Aegis is an evidence-aware decision layer for exposed outdoor operations in India.** It does not pretend that every set of signals supports an answer. Instead, it combines live weather and atmospheric evidence with explicitly unattributed public context, makes the quality of evidence visible, and explicitly **refuses** an autonomous recommendation when a decisive fact is missing.

The centrepiece is a browser-visible **hard mode**. Removing a live source forces Aegis to recompute coverage and confidence, issue a refusal where appropriate, and request the *smallest fact that can unblock a decision*. This makes safe non-action a product capability, rather than a generic disclaimer.

| Submission dimension | Aegis implementation |
| --- | --- |
| **Novelty** | Treats refusal as a primary AI outcome: evidence loss makes the system *less* decisive, not more performative. |
| **Real-world data** | Pulls live coordinate-based weather, precipitation probability, and air-quality signals from Open-Meteo; it does not seed environmental data. [1] [2] |
| **Hard-mode fit** | A one-click controlled evidence loss hides 25%–50% of the evidence graph and visibly triggers the abstention policy. |
| **Explainability** | Shows source provenance, confidence, evidence coverage, operational exposure, anomalies, and the smallest missing fact. |
| **Public accountability boundary** | Anyone may open a public field-contribution or response control without signing in, but every public record is labelled unattributed and cannot alter confidence, risk, or authorisation. |

## What Works

Aegis uses four India-based operating sites for a realistic, coordinate-driven desk: Bengaluru’s Cubbon Park, New Delhi’s India Gate, Mumbai’s Oval Maidan, and Hyderabad’s Tank Bund. A site selection calls the public live-evidence procedure; no client-side placeholder replaces a failed upstream response.

| Evidence stream | Retrieval or input | What Aegis uses |
| --- | --- | --- |
| **Wind & weather** | Open-Meteo Forecast API | Current temperature, apparent temperature, precipitation, sustained wind, gusts, and weather code. [1] |
| **Rain likelihood** | Open-Meteo Forecast API | Short-range hourly precipitation probability. [1] |
| **Air exposure** | Open-Meteo Air Quality API | PM2.5, PM10, nitrogen dioxide, ozone, and consolidated US AQI. [2] |
| **Field observation** | Public contributor | Human condition label, real note, optionally measured gusts, and an optional photo-derived *visual observation*; public context is not confidence-bearing. |

The optional photo workflow accepts a JPEG, PNG, or WebP image of up to 2.5 MB from a public contributor. Where storage and the server-side model are available, the original is associated with an explicitly unattributed report and `gemini-3-flash-preview` produces a constrained, schema-validated visual observation of scene conditions. It is context only. It cannot decide, approve, restrict, or execute an operation.

> **Safety boundary:** Aegis is a decision-support and evidence-refusal interface. It does not control people, vehicles, emergency services, or field equipment. A human operator remains responsible for every operational action.

## Decision Policy

The decision engine is deterministic and inspectable. Coverage counts available live or attributable evidence across weather, rain, air, and field sources. Public contributions may surface an attention item but never increase coverage, confidence, or risk. A missing decisive source reduces confidence. High gusts, poor air quality, high rain likelihood, unsafe field conditions, and a material disagreement between measured and forecast gusts contribute explainable anomalies and operational exposure.

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

The dedicated Vercel deployment at [aegis-ecru.vercel.app](https://aegis-ecru.vercel.app) has been verified for the public, live-data decision desk, hard mode, and sign-in-free contribution controls. It invokes deployed public tRPC procedures and returns real Open-Meteo evidence. Because no database, object-storage, or server-side model credentials are provisioned in that external Vercel project, public text context is retained only in the contributor’s current browser session there; the managed full-stack runtime persists public records and supports the optional photo path. No managed-runtime secret was copied to Vercel.

## Validation Snapshot

The current validation record confirms a live Bengaluru public assessment, a hard-mode weather-source omission that produced refusal and a smallest-missing-fact request, sign-in-free public field and response controls, and self-cleaning anonymous report/receipt persistence in the managed runtime. The automated suite contains **18 passing tests**, including policy checks proving public context and photo-derived observations cannot alter Aegis’s decision authority. See [Aegis validation](docs/AEGIS_VALIDATION.md).

## Project Map

| Path | Responsibility |
| --- | --- |
| `client/src/pages/Home.tsx` | Decision desk, source ledger, hard mode, field-evidence modal, and human-review receipt UI. |
| `server/aegis.ts` | Live Open-Meteo retrieval and deterministic confidence, refusal, and risk policy. |
| `server/aegisPhoto.ts` | Photo input guardrails and structured visual-observation extraction. |
| `server/routers.ts` | Public evidence, public contribution, and public response procedures with transparent persistence fallback. |
| `server/db.ts` | Field-report and immutable decision-receipt persistence helpers. |
| `docs/PROJECT_DOCUMENTATION.md` | Architecture, operating policy, privacy boundaries, and test plan. |
| `docs/DEMO_SCRIPT.md` | Feature-by-feature live demo script. |
| `docs/SUBMISSION_LINKS.md` | Repository, deployment, and video link register. |

## References

[1] [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs)

[2] [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)
