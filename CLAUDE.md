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
