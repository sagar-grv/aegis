# InsightLoop — Design Direction

## Product Thesis

InsightLoop is built for **Track 04: AI-Powered Personalized Learning Ecosystem**. Its premise is simple: a learner who gives a wrong answer does not necessarily need the correct answer—they need the next question that reveals *why* their method broke down.

The product avoids generic lesson feeds and performance theatrics. A learner submits their own question, reasoning, and self-confidence. The server-side diagnostic model returns an explainable misconception hypothesis, a bounded mastery estimate, concise feedback, and one targeted diagnostic probe. The next probe becomes the learner’s persistent topic path.

## Experience Principles

| Principle | Product expression |
|---|---|
| Reasoning before correctness | The primary input asks for method and partial work, not a multiple-choice score. |
| Private by default | No sample profiles, public rankings, or fabricated activity. An authenticated learner sees only their own history. |
| Explainable adaptation | Every path names the likely misconception, target skill, mastery estimate, and next question. |
| Human educational judgement | Teacher analytics aggregate actual workspace submissions; AI feedback is clearly framed as a learning prompt, not a grade or diagnosis. |
| Calm editorial focus | Warm paper, ink-blue thread lines, coral insight moments, readable text, and no gamified noise. |

## Real Operational Data Flow

1. An authenticated learner submits a topic, original task, reasoning, and self-confidence.
2. The server calls `gpt-5-mini` using a strict JSON schema and never exposes model credentials to the browser.
3. The app validates the structured diagnosis, then stores the learner attempt and upserts the topic’s adaptive path.
4. The learner receives their new next probe. An authorised teacher view surfaces aggregate, real-submission signals only.

No synthetic learner records are seeded. Empty states deliberately explain that the workspace starts useful only after a real learner response is submitted.
