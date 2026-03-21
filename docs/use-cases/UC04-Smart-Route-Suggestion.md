# UC04 — Smart Route Suggestion

- ID: UC04
- Name: Smart Route Suggestion (ETC-Optimized Green Routing)
- Priority: P1
- Actors: Driver xe xăng; Driver xe điện (EV)
- Source: FigJam table node 138:1159

## Trigger
- User opens “Search route” screen OR opens app with pending A→B route and taps “Suggest Route”

## Pre-conditions
1. User authenticated with vehicle type and fuel type configured
2. Origin and destination entered (or loaded from saved profile)
3. Internet connection available for Maps API call
4. Maps API key active with Directions + Roads API enabled
5. VETC toll database loaded (gate locations, average idle time per gate)

## Post-conditions
1. User is presented with 2–3 route options, each with CO₂, time, cost, and Green Points scored
2. Selected route is saved to journey plan; UC-02 (CO₂ Meter) uses this route as baseline
3. If ETC-optimised route is selected: expected Green Points pre-credited as “pending” (confirmed on completion)
4. Route deviation during trip: UC-04 recalculates and offers re-route suggestion

## Main Flow
1. User enters origin A and destination B → taps “Find Green Routes”
2. System calls Maps API → retrieves 3 candidate routes (fastest / balanced / eco)
3. For each route, system calculates:
   - Distance (km) × vehicle emission factor = CO₂ emitted
   - Number of ETC toll gates on route × idle_time_saved × 0.03 kgCO₂/min = CO₂ saved
   - Estimated fuel cost (VND) based on distance + avg consumption
   - Green Points earnable if ETC used at all gates on route
   - Travel time (minutes) from Maps API
4. Routes ranked by “Green Score” = (CO₂_saved / CO₂_emitted) × 100
5. UI shows route comparison card with three options and badges
6. User selects route → “Start Journey” button activates UC-02 CO₂ Meter
7. During trip: if user deviates > 500m from selected route → gentle notification
8. On arrival: actual vs estimated CO₂ compared; discrepancy > 20% flagged for model improvement

## Business Rules
- BR-01: Maximum 3 routes shown (UX constraint); always includes fastest option even if not greenest
- BR-02: “Recommended” badge only assigned if Green Route saves ≥ 10% CO₂ vs fastest AND adds < 15 minutes
- BR-03: Green Points shown as “potential” — only confirmed after UC-01 / UC-02 validates actual ETC usage
- BR-04: VETC gate locations sourced from Tasco VETC API (authoritative); updated weekly
- BR-05: Idle time per manual toll assumed = 3.2 minutes; configurable per gate
- BR-06: Route re-calculation triggered if: user deviates > 500m OR journey paused > 10 minutes
