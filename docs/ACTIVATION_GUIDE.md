# Aegis — Public First-Use Guide

## 1. Open the Decision Desk

Open the deployed Aegis URL and select an Indian operating site. The public desk retrieves live environmental evidence and can be used without an account for the evidence-only assessment.

## 2. Demonstrate Safe Refusal

Select **Wind & weather** under **Hard mode / evidence fault injection**. Aegis should mark the weather source as hidden, recalculate the assessment, refuse an autonomous decision where confidence falls below policy, and name the smallest missing fact. Restore the source before any normal operation.

## 3. Record a Public Field Contribution

Use **Add public field fact** to select the condition you personally observed, enter a real note, and optionally enter a gust value only when it was actually measured. Do not enter an invented observation merely to change the recommendation. The submission is stored as **unattributed** and can surface attention for a human, but cannot restore evidence coverage, raise confidence, authorise an action, or alter Aegis’s operational recommendation.

An optional photo is limited to JPEG, PNG, or WebP under 2.5 MB. Submit only a scene image you are permitted to share. Avoid faces, personal data, private homes, vehicle registrations, and sensitive locations. The visual extractor returns neutral, visible context; it cannot decide whether to proceed.

## 4. Record a Public Human Response

Choose **Record public human response** only after reviewing the recommendation and available evidence. Choose acknowledgement, request-for-check, or deferral to reflect your actual response. Aegis stores this unattributed receipt separately from its recommendation.

## Operational Checklist

| Check | Expected result |
| --- | --- |
| Public live desk | Current environmental telemetry resolves for the selected coordinate. |
| Hard mode | Evidence loss increases uncertainty and can produce an explicit refusal. |
| Public contribution | An unattributed public note can be submitted without signing in; it is visible as context, not confidence-bearing evidence. |
| Field report | A real public note is stored separately from Aegis’s live evidence; it cannot alter the recommendation. |
| Optional photo | Bounded supported image format is accepted; invalid or oversized files are rejected. |
| Public receipt | A public human response is retained separately from the recommendation snapshot and is explicitly unattributed. |
