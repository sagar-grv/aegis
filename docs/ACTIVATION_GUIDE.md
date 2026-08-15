# Aegis — Operator First-Use Guide

## 1. Open the Decision Desk

Open the deployed Aegis URL and select an Indian operating site. The public desk retrieves live environmental evidence and can be used without an account for the evidence-only assessment.

## 2. Demonstrate Safe Refusal

Select **Wind & weather** under **Hard mode / evidence fault injection**. Aegis should mark the weather source as hidden, recalculate the assessment, refuse an autonomous decision where confidence falls below policy, and name the smallest missing fact. Restore the source before any normal operation.

## 3. Authenticate an Operator

Select **Operator sign in**. A successful OAuth session unlocks field evidence and human decision receipts. Authentication is required because these records must be attributed to the person who supplied or accepted the information.

## 4. Record Genuine Field Evidence

Use **Add field fact** to select the condition you personally observed, enter a real note, and optionally enter a gust value only when it was actually measured. Do not enter an invented observation merely to change the recommendation.

An optional photo is limited to JPEG, PNG, or WebP under 2.5 MB. Submit only a scene image you are permitted to share. Avoid faces, personal data, private homes, vehicle registrations, and sensitive locations. The visual extractor returns neutral, visible context; it cannot decide whether to proceed.

## 5. Record the Human Outcome

Choose **Record human decision** only after reviewing the recommendation and available evidence. Choose acknowledgement, request-for-check, or deferral to reflect your actual decision. Aegis stores this receipt separately from its recommendation.

## Operational Checklist

| Check | Expected result |
| --- | --- |
| Public live desk | Current environmental telemetry resolves for the selected coordinate. |
| Hard mode | Evidence loss increases uncertainty and can produce an explicit refusal. |
| OAuth sign-in | Operator returns to Aegis with attributed, protected actions available. |
| Field report | A real operator note is saved and the evidence graph recalculates. |
| Optional photo | Bounded supported image format is accepted; invalid or oversized files are rejected. |
| Human receipt | A human action is retained separately from the recommendation snapshot. |
