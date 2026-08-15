# VeilTrace — Project Documentation

## Executive Summary

VeilTrace is an explainable financial-fraud intelligence prototype for the STAMPERS National Hackathon 2026 FinTech track. It targets coordinated fraud in which an attacker deliberately makes individual transactions look legitimate. The system connects transaction, account, device, timing, merchant, and beneficiary signals into a relationship graph, then gives the investigator a clear decision receipt rather than a black-box alert.

## Problem

Rule-based fraud tools are strong at recognising known patterns but weak when adversaries distribute activity across multiple accounts, devices, and short time windows. They also create unnecessary friction when they cannot distinguish a suspicious shared device from a legitimate family, workplace, or payroll relationship.

The key design challenge is therefore dual: surface coordinated behaviour that no single transaction reveals, while preserving a defensible path to lower risk when legitimate counter-evidence arrives.

## Solution

VeilTrace models a short, simulated payment window. Three accounts make modest, individually normal payments. The interface then correlates four pieces of evidence: shared device usage, a coordinated beneficiary pathway, a repeated 41-second timing cadence, and individual-normality counter-evidence. The graph makes the hidden topology concrete; the Decision Receipt converts topology into a reviewable recommendation.

### Camouflage Index

The **Camouflage Index** is VeilTrace’s signature concept. It scores how effectively a network hides collective abnormality behind individually ordinary events. In the baseline view, the score is low because correlation has not been expanded. When the ring is revealed, it rises to 91/100 because the device, timing, and beneficiary path reinforce each other. When verified KYC evidence explains the shared device, it drops to 44/100—but not to zero, because the beneficiary and timing patterns remain unresolved.

### False-Positive Guard

The system distinguishes a suspicion signal from an adverse outcome. The **False-Positive Guard** visibly increases after a verified employment linkage is introduced. This avoids a simplistic “fraud or not” binary: the recommendation changes to enhanced monitoring while the unresolved graph factors remain visible.

## Minimum-Requirement Coverage

| Requirement | Demonstrated evidence |
|---|---|
| Real-time analysis | Timestamped payment stream and live/paused stream state. |
| Risk scoring | Dynamic score transitions of 41, 93, and 58. |
| Behavioural anomaly | Timing heartbeat and expected-rhythm deviation. |
| Network detection | SVG relationship graph with account, merchant, device, and beneficiary nodes. |
| Relationship analysis | Device Relay and Beneficiary Convergence evidence cards. |
| Explainability | Decision Receipt, evidence ledger, narrative rationale, and counterfactual statement. |
| False-positive reduction | Verified KYC control and visible False-Positive Guard. |

## Safety and Privacy

All prototype data is fictional. The user interface explicitly avoids asserting guilt, recommends analyst approval for any customer-impacting action, and treats KYC verification as a risk-adjustment signal rather than an automatic clearance. A production system would require encrypted data handling, data minimisation, consent and legal-basis controls, model monitoring, bias analysis, access control, and immutable review logs.

## Potential Impact

The concept can protect financial institutions and customers from fraud that is engineered to bypass amount-based screening. More importantly, by surfacing counter-evidence and uncertainty, it can reduce unnecessary intervention against legitimate customers. This makes the project relevant to fraud teams, digital-wallet operators, payment gateways, and financial institutions that need both stronger detection and more accountable customer outcomes.
