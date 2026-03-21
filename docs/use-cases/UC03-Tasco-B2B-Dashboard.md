# UC03 — Tasco B2B Dashboard

- ID: UC03
- Name: Tasco B2B Dashboard
- Priority: P1
- Actors: Tasco ESG Officer (primary); Tasco Executive (viewer)
- Source: FigJam table node 138:1159

## Trigger
- ESG Officer logs in; exports GHG Protocol–compatible credentials

## Pre-conditions
1. Tasco corporate account is provisioned with admin credentials
2. VETC transaction API integration is active and syncing
3. At least 1 active user has completed ≥ 1 green action in the reporting period
4. Emission factors database is loaded (EPA MOVES + EVN grid factor)
5. GHG Protocol reporting period is configured (default: calendar month)

## Post-conditions
1. Dashboard reflects real-time aggregate CO₂ reduction across all users
2. ESG Officer can export GHG Protocol Scope 3 report (PDF + CSV) in < 30 seconds
3. All exported reports are version-stamped with methodology reference
4. Dashboard data is audit-ready: each metric traceable to source transactions
5. Tasco internal ESG report preparation time reduced from ~3 days to < 1 hour

## Main Flow
1. ESG Officer navigates to dashboard.greenpoints.vn → authenticates via Tasco SSO
2. Overview panel loads: KPI cards showing: Total CO₂ reduced this month (kg), Active contributors, ETC transactions processed, vs. prior month delta
3. Officer selects reporting period (e.g., Q2 2025) from date picker
4. System renders aggregate charts:
   - Chart A: Daily CO₂ reduction trend (bar chart)
   - Chart B: Breakdown by source — ETC idle-saving (68%), EV users (22%), off-peak driving (10%)
   - Chart C: User vehicle type distribution (xe máy / ô tô xăng / xe điện)
5. Officer drills into “ETC contribution” tile → sees trip-level breakdown (anonymised: no PII)
6. Officer clicks “Generate Report” → selects format: GHG Protocol Scope 3 / Internal ESG / CSV raw data
7. System generates PDF with: methodology statement, emission factors used, data period, total CO₂ reduction figure, limitation notes
8. PDF stamped: “Data source: Green Points Platform v1.0 | Methodology: GHG Protocol Scope 3 Category 11 | Prepared: [date]”
9. Officer downloads and attaches to DJSI submission package
10. System logs export event (timestamp, user, format) for audit trail

## Business Rules
- BR-01: All user data in dashboard is aggregated and anonymised — no individual PII visible to Tasco
- BR-02: CO₂ reduction methodology: GHG Protocol Scope 3, Category 11 (Use of sold products / services)
- BR-03: Baseline for ETC idle-saving: avg. 3.2 minutes idle per manual toll cash transaction × 0.03 kgCO₂/min
- BR-04: Dashboard data refresh rate: every 15 minutes (near real-time)
- BR-05: Exported reports must include limitation note about Green Points incentives vs certified carbon credits
- BR-06: Data available for export: up to 3 years historical rolling window
