# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a hackathon project with a single app:

- `mobile/` — Expo (SDK 54) React Native app targeting Android via Expo Go

## Commands

All commands run from the `mobile/` directory:

```bash
npm install                    # install dependencies
npm start -- --tunnel          # start dev server (works across networks via QR)
npm start -- --lan             # start dev serve`r (same Wi-Fi, faster)
npm start -- --clear           # clear Metro cache and start
npm run web                    # run web preview in browser
npx tsc -p tsconfig.json --noEmit  # type-check
npx expo-doctor                # health check (run before PRs and after upgrades)
npx expo install --fix         # fix SDK-incompatible dependency versions
```

Install new packages with `npx expo install <pkg>` (not plain `npm install`) to get SDK-compatible versions.

Node version: 18 LTS (pinned via `.nvmrc`; run `nvm use` before developing).

## Architecture

Entry point: `index.ts` imports `react-native-gesture-handler` first (required), then registers `App.tsx` via `registerRootComponent`.

`App.tsx` contains all screens for now (HomeScreen, DetailsScreen) and the root providers stacked as:
`PaperProvider (MD3LightTheme) > SafeAreaProvider > NavigationContainer > Stack.Navigator`

Navigation uses `@react-navigation/native-stack` with a typed `RootStackParamList`. New screens go in `screens/` once the app grows beyond trivial size.

### Data layer (`src/data/`)

The app uses a JSON store backed by `@react-native-async-storage/async-storage` — no backend required. All keys are namespaced `gordon:<collection>`.

| File | Purpose |
|------|---------|
| `types.ts` | Unified data model — single source of truth for all entities (User, DailyRing, Trip, PointsEntry, Achievement, CommunityStats, RouteOption) |
| `store.ts` | Generic CRUD primitives: `getAll`, `getById`, `add`, `update`, `remove`, `dropAll`, `seed`, `getSingleton`, `setSingleton`, `nukeAll` |
| `seed.ts` | Default data seeded on first launch (replaces all `mock_*.ts` files as source of truth) |
| `service.ts` | Domain operations (`toggleRingTask`, `addTrip`, `getImpactSummary`, `ensureSeeded`, `resetToDefaults`, …) — business logic lives here, not in components |

**Rule:** screens and hooks import from `service.ts` (or `types.ts` for types). They never import from `store.ts` or `seed.ts` directly.

**Seeding / reset:** `service.ensureSeeded()` is called once at app boot (inside each hook). Call `service.resetToDefaults()` from a dev settings screen to wipe and re-seed all data.

**Collections:** `users`, `daily_rings`, `trips`, `points_ledger`, `achievements`
**Singletons:** `community_stats`, `current_user_id`

### Use cases → screens mapping (Gordon app)

| UC | Screen(s) | Hook |
|----|-----------|------|
| UC-01 Live Green Ring | `LiveGreenRingScreen` | `useLiveGreenData` |
| UC-02 CO₂ Meter | `Co2MeterScreen` | service direct |
| UC-03 Tasco Dashboard | `ImpactsScreen` | `useImpactsData` |
| UC-04 Smart Route | `RouteSuggestionScreen` | service direct |

## Conventions

- UI components: `react-native-paper` (Material 3) — use `Card`, `Appbar.Header`, `TextInput`, `List`, `Divider`
- Icons: `@expo/vector-icons`
- Styling: `StyleSheet.create` only; avoid the `gap` prop (spotty RN support) — use margins/paddings or spacer `View`s
- Safe areas: always wrap screens with `SafeAreaView` from `react-native-safe-area-context`
- Navigation params: type them via `RootStackParamList`
- TypeScript strict mode is enabled

## Definition of Done

- `npx tsc -p tsconfig.json --noEmit` passes
- `npx expo-doctor` shows 0 issues
- QR scan on a physical Android device loads without redbox; navigation works
- `npm run web` renders core screens without errors
