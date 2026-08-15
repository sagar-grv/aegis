# Aegis — Feature-Tested Demo Script

## Recorded Submission Artifact

The attached submission artifact is a **41.7-second evidence-based recording**. It opens the deployed Vercel desk with real Open-Meteo evidence, triggers and restores the live Wind & weather fault, changes to New Delhi, opens both anonymous public-contribution controls, and then shows the output of the just-run, self-cleaning public API probe. It does not impersonate a user or present a fabricated photo upload as real.

| Approximate time | Visible evidence | Presenter narration |
| --- | --- | --- |
| 00:00–00:06 | Bengaluru public desk resolves live temperature, wind gust, rain probability, air quality, provenance, and 75% confidence. | “Aegis begins with real environmental evidence. The recommendation is visible together with coverage, source provenance, and the reason for it.” |
| 00:06–00:14 | Wind & weather is intentionally hidden. The desk refuses, confidence falls to 40%, and a fresh on-site wind-gust reading is requested. | “Hard mode removes a decisive stream. Aegis does not compensate with confidence theatre: it refuses and names the smallest missing fact.” |
| 00:14–00:18 | Wind & weather is restored and the public assessment returns to monitoring. | “Restore the source and the system recovers to an evidence-supported recommendation.” |
| 00:18–00:22 | The site changes from Bengaluru to New Delhi; the live assessment is recalculated for a different Indian coordinate. | “Aegis is a decision desk, not a fixed dashboard. Every site selection requests evidence for that coordinate.” |
| 00:22–00:31 | The **Public Field Contribution** and **Public Human Response** modals open without a sign-in screen. | “Anyone can contribute context or a response. These are explicitly unattributed and cannot restore confidence, alter risk, authorise an action, or make Aegis act.” |
| 00:32–00:42 | A terminal-style validation record presents the actual self-cleaning public API result: an unattributed report and response were created then deleted. | “The managed full-stack runtime verified the public procedures without a session and cleaned up the temporary rows. No operational field observation or photo was fabricated for this recording.” |

> **Optional photo demonstration.** Use only a permitted, privacy-safe real scene image. The optional photo path remains bounded to neutral visual context; it cannot make or execute a decision. On deployments without persistence or server-side model credentials, public text context remains in the contributor’s current browser session only.

## Recording Intent

This is a **live product demonstration**, not a slide deck. Keep the browser visible and narrate what the system knows, what it does not know, and why refusal is the most important capability. Do not pre-seed or fabricate public evidence for the recording.

| Segment | Target duration | Proof point |
| --- | ---: | --- |
| Opening and operating question | 0:00–0:30 | Aegis asks whether an outdoor team can proceed, rather than presenting a generic analytics dashboard. |
| Live environmental evidence | 0:30–1:10 | Real coordinate-based temperature, gusts, rain chance, and US AQI resolve for Bengaluru. |
| Explainability | 1:10–1:45 | Provenance ledger, coverage, exposure, rationale, and all evidence-source states are visible. |
| **Hard mode** | 1:45–2:45 | Hide **Wind & weather**, show the refusal, 50% coverage/40% confidence, and the smallest missing fact. |
| Recovery and site switch | 2:45–3:20 | Restore weather, then select New Delhi or Mumbai; live values refresh from the selected coordinates. |
| Public context controls | 3:20–4:35 | Open the public field-contribution control and show that it is explicitly unattributed and cannot change the recommendation. |
| Public response and close | 4:35–5:10 | Open a public response option; reiterate that Aegis does not act autonomously and that the response is separate from the recommendation. |

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

### 3:20–4:35 — Public Field Context

Click **Add public field fact**. Do not submit invented content.

> “The public field control is deliberately open without sign-in. A submitted contribution is clearly marked unattributed. It can surface a concern to a human, but it cannot fill the evidence gap, alter confidence or risk, authorise action, or make Aegis act.”

If an appropriate real scene image is available, choose **Optional site photo** and show the preview:

> “A real public photo is limited to JPEG, PNG, or WebP under 2.5 MB. Server-side visual extraction returns only a neutral scene observation. It cannot make the decision, identify people, or execute any action.”

Do **not** upload an image containing identifiable people, personal data, private premises, or fabricated imagery. If a suitable image is not available, state that the optional path is intentionally not demonstrated with fabricated evidence.

### 4:35–5:10 — Public Human Response

Open **Record public human response** and show **Request check**, **Defer decision**, or **Acknowledge recommendation**. Submit only when it reflects the contributor’s actual choice.

> “The public response is separate from Aegis’s recommendation and evidence snapshot. Aegis can advise, restrict, or refuse—but it cannot take the action for the contributor.”

End on the evidence ledger and autonomy contract.

## Recording Checklist

| Item | Completion condition |
| --- | --- |
| Live data | A visibly resolved Open-Meteo weather and air-quality state is shown. |
| Hard mode | A weather fault is activated, producing refusal and a smallest-missing-fact prompt. |
| Site switch | A second Indian location is selected and live data refreshes. |
| Public context | Public field and response controls open without a sign-in screen and state their unattributed boundary. |
| Field contribution | Only genuine public observations are submitted; optional photo is shown only if privacy-safe and real. |
| Human accountability | Public-response choices are explained as human, not automated or authorising, actions. |
