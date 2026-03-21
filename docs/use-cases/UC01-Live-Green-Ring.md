# UC01 — Live Green Ring

- ID: UC01
- Name: Live Green Ring
- Priority: P0
- IA: Ring chart; Daily tasks
- Actors: Driver xe xăng; Driver xe điện; Người đi bộ; Người đi bus
- Source: FigJam table node 138:1159

## Trigger
- User opens app each morning OR receives morning push notification at 6:30 AM

## Pre-conditions
1. User has registered and linked VETC account
2. User has set home → workplace route (A → B) during onboarding
3. Vehicle type is configured (motorbike / car / EV)
4. Location permission granted (background)
5. Push notification permission granted

## Post-conditions
1. Daily ring reflects accurate completion % based on verified green actions
2. Green Points balance is updated in real-time after each task
3. Streak counter incremented if ring reaches ≥ 70% by 11:59 PM
4. CO₂ contribution data logged to Tasco Dashboard (UC03)
5. If ring = 100%: celebration animation shown, bonus 10 pts awarded

## Main Flow
1. Input by voice/text today’s route
2. System generates personalized tasks based on input
3. User opens app → sees ring at 0% with today’s 3 task cards
4. User commutes; VETC API detects toll transaction → webhook fires within 3 seconds
5. System validates ETC event: match user ID + timestamp + expected toll gate on route
6. Task (a) auto-completes → ring fills +33% → push notification sent: “ETC qua trạm — tiết kiệm 0.06 kg CO₂. +5 Green Points!”
7. User departs before 7:30 AM (GPS timestamp) → task (b) auto-completes → ring +33%
8. Parking event detected via payment API → task (c) validated → ring +34% → ring FULL
9. Full ring celebration: confetti animation, “Hôm nay bạn đã đóng góp 0.18 kg CO₂ - tương đương trồng 0.018 cây xanh!”
10. Green Points (15 pts base + 10 pts streak bonus) credited to wallet
11. Data pushed to Tasco B2B Dashboard aggregate (anonymous)

## Alternative Flows
- Ring incomplete by 11:59 PM (< 70%): No streak increment; streak counter resets to 0. System logs partial contribution (proportional CO₂ credit still applied). Push notification next morning: “Hôm qua bạn hoàn thành 2/3 tasks. Hôm nay thử hoàn thành cả 3 nhé!”

## Business Rules
- BR-01: 1 ring per calendar day; resets at midnight local time
- BR-02: Tasks are route-specific; if no commute day (weekend), ring switches to “Leisure mode” with different tasks
- BR-03: Green Points expiry: 12 months from issuance
- BR-04: Minimum 1 task completed for any CO₂ data to be logged
- BR-05: Anti-gaming: same VETC transaction cannot complete tasks for 2 different users

## Notes
- Display placement: Home screen widget + dedicated Impact screen
- Dependencies: VETC transactions API, Parking/payment events, GPS background service, Push service
