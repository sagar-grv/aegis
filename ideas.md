# CrisisGrid Design Brainstorm

## Three Directions

### Signal in the Storm
**Very Brief Intro:** A field-operations command surface inspired by emergency paper maps, radio logs, and weathered infrastructure. It uses restrained colour, precise typography, and dynamic layers to make urgency legible without visual panic.

**Probability:** 0.07

### Civic Relay
**Very Brief Intro:** A warm, community-first public-service interface that centres citizens and mutual aid rather than control-room density. Soft daylight tones and generous surfaces make an intimidating emergency system feel approachable.

**Probability:** 0.04

### Night Shift Mesh
**Very Brief Intro:** A midnight control-room environment with bright status signals, dense information tiles, and live-data motion. It frames response coordination as a resilient digital network working through the night.

**Probability:** 0.09

## Chosen Direction: Signal in the Storm

### Design Movement
**Signal in the Storm** draws from Swiss information design, emergency incident-command boards, and topographic field maps. It is a calm operational interface: a tool that helps a coordinator reason about incomplete information, rather than a decorative disaster dashboard.

### Core Principles
1. **Calm clarity under pressure.** Information is grouped around actions, confidence, and consequences—not visual novelty.
2. **Explain every recommendation.** Allocation and routing decisions retain a visible rationale and uncertainty cue.
3. **Physical map language, digital resilience.** Contour patterns, coordinates, and paper-like annotation details make the system feel connected to place and field operations.
4. **Contrast with purpose.** Life-safety risk uses a carefully limited signal red; safe and confirmed states use a deep emergency teal.

### Color Philosophy
The base is a warm, off-white map stock that reduces control-room fatigue and helps emergency colours carry meaning. Graphite anchors typography and structure, a forest-teal indicates verified operating capacity, signal red indicates critical action, and high-visibility chartreuse is reserved for route and allocation emphasis. The result is sober, human, and easily interpretable instead of technologically theatrical.

### Layout Paradigm
The app uses an **operational strip** rather than a symmetrical dashboard. A fixed left rail holds the mission context and mode controls; the central territory plane shows the evolving crisis map; a right-side decision ledger exposes priorities, confidence, and actions. On smaller screens, these planes become a sequential field briefing rather than miniature panels.

### Signature Elements
1. **Coordinate ribbons:** small coordinate and timestamp notations recur beside high-value data.
2. **Risk contours:** thin, translucent topographic arcs appear behind the map and hero surfaces.
3. **Decision receipts:** every suggested action includes its score, source inputs, and a plain-language explanation.

### Interaction Philosophy
Interactions should feel deliberate and field-ready. Users may switch network availability, accept allocations, send an SOS, and inspect a zone. Each action updates the confidence layer and provides a concise response-log entry so the impact is traceable.

### Animation
Motion is sparse and purposeful. Risk contours drift very slowly only when reduced motion is not preferred. New SOS alerts enter with a short opacity-and-translate transition, critical route paths draw into place, and decisions update with a brief ledger flash. All UI transition timing is 120–240ms with crisp cubic-bezier easing; no decorative looping spinners or exaggerated scale effects are used.

### Typography System
**Space Grotesk** supplies the technical, high-legibility interface voice, with **IBM Plex Mono** for coordinates, system logs, scores, and metadata. Headlines use compact uppercase tracking; primary messages stay sentence case for readable, humane instruction. The hierarchy favours large operational numbers, then clear action titles, then support text.

### Brand Essence
**CrisisGrid is a resilient command layer for teams coordinating response when the map, network, and minutes are all failing.**

Personality: **steadfast, lucid, accountable**.

### Brand Voice
The voice is succinct, evidence-aware, and action-oriented. It avoids alarmism, vague claims, and bureaucratic filler.

Example headline: “Decide with what you know. Protect where it matters.”

Example microcopy: “Route 04 remains viable through the cached road graph. Confidence: 78%.”

### Wordmark and Logo
The logo is a bold, text-free **four-cell relay mark**: four offset rounded grid cells form a directional cross, with one cell bridged by a small link to represent communication continuity during infrastructure failure. The mark should work in solid forest-teal against map stock and render clearly at favicon scale.

### Signature Brand Color
**Relay Teal — #005E57.** A deep, ownable teal that signifies verified capability, continuity, and coordinated action.
