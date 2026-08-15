# InsightLoop — Project Documentation

## Problem and Solution

Track 04 asks for a learning ecosystem that understands misconceptions, adapts the next step, and gives teachers usable analytics. InsightLoop responds to that challenge by treating a learner’s **method** as the primary signal. Two learners can give the same wrong answer for different reasons; InsightLoop bases its next question on the reasoning they submitted, not a simplistic correct/incorrect flag.

## Architecture

| Layer | Responsibility |
|---|---|
| React client | Authenticated learner input, private learning paths, and role-aware Teacher Lens. |
| tRPC / Express server | Protected procedures, input validation, AI calls, and persistence boundary. |
| Structured AI | `gpt-5-mini` produces a constrained misconception diagnosis and next probe. |
| MySQL / Drizzle | Stores attempts and one current adaptive path per learner-topic pair. |
| OAuth and roles | Keeps learner records private and permits Teacher Lens to `analyst` and `admin` roles. |

## Explainable Diagnosis Contract

Every accepted diagnosis contains the following fields: misconception label, misconception explanation, mastery estimate, confidence, feedback, target skill, next prompt, and rationale for the next prompt. The server rejects malformed or out-of-range responses before any learner record is saved.

## Novelty

The project’s signature mechanism is the **learning thread**: one response becomes one explainable hypothesis and one next probe. It avoids a generic course recommendation because the next question is explicitly tied to the learner’s submitted method. It also avoids false precision by showing model confidence and describing the output as a likely misconception, not a fixed learner trait.

## Safeguards

The app does not use seed data, public rankings, or hidden student profiles. Teacher analytics aggregate only genuine workspace data. The product is learning support, not automatic grading or health assessment. Institutions should establish consent, retention, and access policies before classroom use.
