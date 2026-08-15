# CrisisGrid — Project Documentation

## Executive Summary

CrisisGrid is an explainable, resilient crisis-response coordination prototype built for the **Autonomous Crisis Response & Resource Coordination** track of STAMPERS National Hackathon 2026. It addresses a common emergency-operations failure mode: decision-makers receive many fragmented signals but cannot quickly determine where to act first, whether a route is credible, or how much confidence to place in an automated recommendation.

The prototype demonstrates an integrated response loop for a simulated monsoon flood: map affected areas, identify priority zones, explain the ranking, account for route accessibility, assign limited resources with human approval, receive citizen SOS reports, and remain useful under simulated communications loss.

## Problem Statement Fit

The challenge calls for a platform that coordinates people, resources, information, and emergency services during large-scale crises, combining signals from citizens, sensors, aerial sources, emergency systems, geographic data, weather, and infrastructure. It specifically asks teams to identify critical locations, people requiring immediate help, accessible routes, appropriate deployment points, and resource-prioritisation decisions.

CrisisGrid models this challenge as a decision-support environment rather than a passive map. Its central interaction is the **Decision Receipt**, which makes the priority model’s reasoning visible and requires human confirmation before a resource is dispatched.

## Solution Design

### 1. Situation Board

The situation board is the operational surface. It includes a simulated map, critical and elevated zones, active and alternate corridors, route confidence, signal integrity, deployable capacity, and a decision log. A coordinator can inspect any zone without leaving the board.

### 2. Decision Receipt

For the selected zone, CrisisGrid displays a priority score, isolated-person estimate, model confidence, and four rationale contributions: life-safety exposure, water-rise velocity, route accessibility, and report reliability. This receipt lets a human understand why the system recommends a particular response.

### 3. Human-in-the-Loop Dispatch

The system does not claim to autonomously dispatch a resource. It offers a recommendation and then exposes a deliberate **Approve dispatch** action. After approval, the assigned unit and reduced available capacity are recorded in the visible decision log.

### 4. Low-Connectivity Relay

When Mesh Fallback is enabled, the user interface explains that 40% communication loss is being simulated, favours cached road-graph and SMS-relay information, reduces route confidence, and retains SOS reports in browser local storage. The SOS flow is intentionally lightweight so it can represent constrained reporting conditions.

## Minimum-Requirement Coverage

| Requirement | Evidence in the prototype |
|---|---|
| Real-time crisis mapping | Selectable location markers and animated route layers on the territory plane. |
| Dynamic risk-zone detection | Four zones with distinct scores, risk classes, people-affected estimates, and confidence values. |
| Resource-allocation algorithm | Explainable priority inputs and a stateful dispatch action that updates capacity. |
| Emergency route optimisation | Two visual corridors plus a dynamic route-confidence measure. |
| Citizen SOS/reporting system | Log SOS modal with location, need, people-affected, and local receipt queue. |
| Offline/low-connectivity capability | Mesh Fallback mode and persistent browser-side queue. |
| Real-time command dashboard | Integrated territory, decisions, resources, feeds, and decision log. |

## Hard-Mode Response

The supplied hard mode assumes that 40% of communications infrastructure becomes unavailable. CrisisGrid demonstrates this condition with a network-state control that switches the board to **Mesh Fallback**. In this mode, the system makes the trade-off explicit: the cached road graph and SMS relays remain usable, while route confidence declines. New citizen SOS reports persist locally in the browser queue, providing a representation of store-and-forward behaviour until a relay is available.

## Data and Ethics

All locations, counts, risk scores, routes, signals, and dispatch activity in this repository are simulated for a hackathon demonstration. They must not be interpreted as real incident data, emergency guidance, or proof of operational readiness. The project intentionally avoids displaying personally identifying information and presents a human-confirmation requirement for high-consequence actions.

## Scalability Plan

The demonstration is front-end only to make the core interaction inspectable and easy to deploy. A production version would add authenticated operator roles, encrypted incident storage, verified source provenance, two-way communications, server-side priority calculations, geospatial route services, audit logs, incident hand-off, and jurisdiction-specific policy controls. The Decision Receipt format would remain the common explanation layer across those integrations.

## Conclusion

CrisisGrid demonstrates a practical direction for crisis-response software: coordinate fragmented evidence while preserving human judgement. Its innovation is not merely that it ranks zones. It makes the ranking, uncertainty, connectivity state, and dispatch consequences visible at the moment a response decision is made.
