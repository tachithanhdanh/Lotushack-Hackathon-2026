# UC02 — Real-Time CO₂ Meter

- ID: UC02
- Name: Real-Time CO₂ Meter
- Priority: P0
- IA: Live emission display while driving/walking
- Actors: Driver xe xăng; Driver xe điện (EV)
- Source: FigJam table node 138:1159

## Trigger
- User taps “Start Journey” OR app auto-detects motion > 20 km/h for 2 minutes

## Pre-conditions
1. User is authenticated and vehicle type is set
2. Location (foreground) and motion permissions granted
3. Journey destination entered OR route A→B loaded from profile
4. Device GPS signal strength ≥ 2 bars (accuracy ≤ 50m)
5. App is in foreground (or background with location permission)

## Post-conditions
1. Trip CO₂ log saved: distance (km), duration, CO₂ emitted (kg), CO₂ saved vs baseline
2. Live Green Ring task data updated if ETC event occurred during journey
3. Weekly/monthly cumulative CO₂ chart updated on Impact screen
4. Trip data contributed to Tasco Scope 3 aggregate (UC-03)
5. If EV vehicle: “CO₂ vs petrol equivalent” saved for social sharing

## Main Flow
1. User taps “Start Journey”; enters destination or selects saved A→B route
2. System loads vehicle emission factor: xe máy xăng = 0.07 kgCO₂/km | ô tô xăng = 0.21 | xe điện = 0.02 (EVN grid)
3. GPS begins tracking at 1-second intervals; speed and coordinates logged
4. Dashboard displays live meter: current speed, CO₂/km (real-time), trip total CO₂ so far → “2.4 km → 0.17 kg CO₂ emitted | Eco score: B+”
5. At each kilometer: micro-update animation; running total refreshed
6. ETC gate detected (GPS coordinates match known gate location): idle time = 0 saved → CO₂ saved delta calculated and displayed in green: “-0.06 kg CO₂ saved!”
7. User arrives at destination → Journey ends automatically (speed < 5 km/h for 60 sec)
8. Trip summary shown: distance, total CO₂, CO₂ saved vs no-ETC scenario, eco-grade (A–F), Green Points earned
9. Translation displayed: “0.42 kg CO₂ = năng lượng để đun sôi 5 ấm nước”
10. User taps “Save & Share” or dismisses; data persisted to local + Tasco cloud

## Alternative Flows
- User is driving EV (xe điện): Emission factor = 0.02 kgCO₂/km (EVN grid 2024: 0.5 kgCO₂/kWh ÷ avg 25 km/kWh). Meter shows: “CO₂ actual: 0.05 kg | vs petrol equivalent: 0.53 kg | You saved: 0.48 kg”. Trip summary adds: “Bạn đã tiết kiệm 0.48 kg CO₂ so với xe xăng tương đương. Tương đương 4.8 cây xanh tháng này!”
- Traffic jam detected (avg speed < 15 km/h for > 5 min): System flags “congestion mode”; idle emission rate applied: +0.008 kgCO₂/min. Meter turns amber with suggestion: “Tắt máy nếu dừng > 1 phút để tiết kiệm CO₂” (once per trip)

## Business Rules
- BR-01: Emission factors updated quarterly from MONRE / EPA MOVES database
- BR-02: Minimum trip distance = 0.5 km for data to be logged (filters GPS noise)
- BR-03: CO₂ saved = [(baseline_idle_time × 0.03 kgCO₂/min) + (ETC_passes × avg_idle_avoided_min × 0.03)]
- BR-04: Eco-grade scale: A (< 0.05 kg/km) | B (0.05–0.10) | C (0.10–0.15) | D (0.15–0.20) | F (> 0.20)
- BR-05: Data retention: raw GPS deleted after 30 days; aggregated trip metrics kept indefinitely
