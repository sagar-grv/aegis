# InsightLoop

> **Track 04 — AI-Powered Personalized Learning Ecosystem**

InsightLoop is a misconception-first learning workspace. Rather than recording whether an answer is right or wrong, it analyses a learner’s **own reasoning**, identifies a likely conceptual gap, creates one targeted next question, and stores the evolving topic path.

No learner data is fabricated or seeded. The workspace starts empty and becomes useful when an authenticated learner submits real educational work.

## What Works in Production

| Track requirement | Operational implementation |
|---|---|
| Student knowledge modelling | Persistent learner-topic paths store a target skill, misconception, mastery estimate, and status. |
| Adaptive difficulty | Each validated response creates a next diagnostic probe designed for that learner’s reasoning. |
| Personalised paths | Each learner has a separate current path for every topic. |
| Automatic question generation | `gpt-5-mini` generates structured next probes server-side. |
| Weak-topic detection | Teacher Lens groups real submissions by topic. |
| Teacher analytics | Authorised teachers see aggregate real-submission counts and path states. |

## Data Flow

1. A learner signs in through the built-in OAuth flow.
2. They submit a topic, original task, reasoning, and self-confidence.
3. The protected backend requests a strict JSON diagnosis from `gpt-5-mini`.
4. The response is schema-validated before an attempt and adaptive path are saved in MySQL.
5. The learner sees the next probe; a role-gated teacher sees aggregate signals only.

InsightLoop does not automatically grade, diagnose a learner, or claim to measure identity, intelligence, or future potential. AI feedback remains visible, reviewable educational guidance.

## Running Locally

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
```

## Key Files

| File | Purpose |
|---|---|
| `client/src/pages/Home.tsx` | Learner and Teacher Lens workspace. |
| `server/learning.ts` | Structured AI diagnosis and safeguard logic. |
| `server/db.ts` | Attempts, paths, and aggregate analytics. |
| `server/routers.ts` | Protected learner and teacher procedures. |
| `docs/ACTIVATION_GUIDE.md` | First-use steps for learners and teachers. |
| `docs/VALIDATION.md` | Build, test, and live model-contract record. |

## Privacy Notice

Learners should submit only educational work. Do not include personal identifiers, medical information, financial details, or other sensitive content in the free-text response.

## Hosting Boundary

The repository can be previewed on Vercel as a browser-interface build. The **full operational workspace**—OAuth, protected server routes, database persistence, and server-side AI credentials—runs in the managed project runtime, where these secrets are provisioned. Do not represent a static external preview as a production learner-record system unless its equivalent server environment and secrets have been configured.
