# Aegis — Feature-Tested Demo Script

## Recorded Submission Artifact

The attached submission artifact is a **36.6-second evidence-based recording**. It opens the deployed Vercel desk with real Open-Meteo evidence, triggers and restores the live Wind & weather fault, changes to New Delhi, and then shows the output of the just-run, self-cleaning protected-workflow probe. It does not impersonate an operator or present a fabricated photo upload as real.

| Approximate time | Visible evidence | Presenter narration |
| --- | --- | --- |
| 00:00–00:06 | Bengaluru public desk resolves live temperature, wind gust, rain probability, air quality, provenance, and 75% confidence. | “Aegis begins with real environmental evidence. The recommendation is visible together with coverage, source provenance, and the reason for it.” |
| 00:06–00:14 | Wind & weather is intentionally hidden. The desk refuses, confidence falls to 40%, and a fresh on-site wind-gust reading is requested. | “Hard mode removes a decisive stream. Aegis does not compensate with confidence theatre: it refuses and names the smallest missing fact.” |
| 00:14–00:18 | Wind & weather is restored and the public assessment returns to monitoring. | “Restore the source and the system recovers to an evidence-supported recommendation.” |
| 00:18–00:27 | The site changes from Bengaluru to New Delhi; the live assessment is recalculated for a different Indian coordinate. | “Aegis is a decision desk, not a fixed dashboard. Every site selection requests evidence for that coordinate.” |
| 00:27–00:37 | A terminal-style validation record presents the actual self-cleaning integration result: live sources, refusal, restored assessment, field-report persistence, and human-receipt persistence. | “The protected workflow was tested in the managed full-stack runtime using a temporary record that was cleaned up. No operator session, field observation, or photo was fabricated for this recording.” |

> **Final demonstration step for a presenter.** On a runtime with OAuth, database, storage, and model credentials available, sign in with the presenter’s own account, add only a genuine field observation, optionally attach a privacy-safe real scene photo, and record the actual human response. The [activation guide](ACTIVATION_GUIDE.md) provides the exact sequence.

## Recording Intent

This is a **live product demonstration**, not a slide deck. Keep the browser visible and narrate what the system knows, what it does not know, and why refusal is the most important capability. Do not pre-seed or fabricate operator evidence for the recording.

| Segment | Target duration | Proof point |
| --- | ---: | --- |
| Opening and operating question | 0:00–0:30 | Aegis asks whether an outdoor team can proceed, rather than presenting a generic analytics dashboard. |
| Live environmental evidence | 0:30–1:10 | Real coordinate-based temperature, gusts, rain chance, and US AQI resolve for Bengaluru. |
| Explainability | 1:10–1:45 | Provenance ledger, coverage, exposure, rationale, and all evidence-source states are visible. |
| **Hard mode** | 1:45–2:45 | Hide **Wind & weather**, show the refusal, 50% coverage/40% confidence, and the smallest missing fact. |
| Recovery and site switch | 2:45–3:20 | Restore weather, then select New Delhi or Mumbai; live values refresh from the selected coordinates. |
| Authenticated evidence | 3:20–4:35 | Sign in, add a real text report; optionally attach a real scene image and show the photo guardrails. |
| Human receipt and close | 4:35–5:10 | Record a human acknowledgement or request-for-check; reiterate that Aegis does not act autonomously. |

### 0:00–0:30 — Frame the Difference

> “This is Aegis, the Decision Refusal Engine. It helps an outdoor operations team answer one question: can we proceed safely right now? The distinguishing feature is that Aegis refuses to turn missing evidence into fake certainty.”

Point to the operating question, the autonomy contract, and the selected Indian location.

### 0:30–1:10 — Prove the Evidence Is Live

> “For Bengaluru, Aegis is retrieving live environmental evidence by coordinates: current conditions and gusts, short-range rain probability, and atmospheric exposure. These are not seeded dashboard numbers—the provider timezone and values resolve in the same desk.”

Click **Refresh evidence** once. Wait for the live telemetry card and the recommendation to resolve. Do not narrate a fixed numeric value; weather and air-quality values are expected to change.

### 1:10–1:45 — Make the Decision Legible

> “Aegis shows the conclusion, but it also shows its evidence coverage, operational exposure, source provenance, and contradiction scan. On the public desk we have three live environmental streams. The field observation is explicitly absent, not silently filled with a demo report.”

Point to the field row as `ABSENT` and the current coverage.

### 1:45–2:45 — Centrepiece: Hard-Mode Evidence Loss

> “Now I will deliberately remove a decisive source. A strong system should become less certain here—not more decisive.”

Click **Wind & weather** under **Hard mode / evidence fault injection**. Wait for the assessment to settle.

> “Aegis now refuses to decide. It does not invent a wind value or downgrade the failure into a vague warning. The weather stream is marked hidden, coverage and confidence fall, and it requests the smallest fact that can unblock the decision: a fresh on-site wind-gust reading.”

Point to the `REFUSE / HUMAN FACT REQUIRED` strip and the **smallest fact** card. This is the key judging moment; pause for the evidence ledger and refusal to remain visible.

### 2:45–3:20 — Recover and Prove Location Adaptability

Restore **Wind & weather**, then choose **New Delhi** or **Mumbai**.

> “Restoring the stream causes a fresh live assessment. Switching the site changes the coordinates, and the desk retrieves a new location-specific evidence set rather than recycling Bengaluru values.”

### 3:20–4:35 — Authenticated Field Evidence

Click **Operator sign in** and complete the normal sign-in flow using the presenter’s own account.

> “Only an authenticated operator can add field evidence. The report accepts a human condition, a measured gust if the operator actually has one, and a real free-text observation. Aegis attributes this context instead of pretending it came from a sensor.”

If an appropriate real scene image is available, choose **Optional site photo** and show the preview:

> “A real operator photo is limited to JPEG, PNG, or WebP under 2.5 MB. Server-side visual extraction returns only a neutral scene observation. It cannot make the decision, identify people, or execute any action.”

Do **not** upload an image containing identifiable people, personal data, private premises, or fabricated imagery. If a suitable image is not available, state that the optional path is intentionally not demonstrated with fabricated evidence.

### 4:35–5:10 — Human Decision Receipt

Open **Record human decision** and select **Request check**, **Defer decision**, or **Acknowledge recommendation** only when it reflects the presenter’s actual choice.

> “The receipt records the human response separately from Aegis’s recommendation and evidence snapshot. Aegis can advise, restrict, or refuse—but it cannot take the action for the operator.”

End on the evidence ledger and autonomy contract.

## Recording Checklist

| Item | Completion condition |
| --- | --- |
| Live data | A visibly resolved Open-Meteo weather and air-quality state is shown. |
| Hard mode | A weather fault is activated, producing refusal and a smallest-missing-fact prompt. |
| Site switch | A second Indian location is selected and live data refreshes. |
| Auth path | Presenter signs in with their own account; no account impersonation is used. |
| Field report | Only genuine presenter observations are submitted; optional photo is shown only if privacy-safe and real. |
| Human accountability | Decision-receipt choices are explained as human, not automated, actions. |
