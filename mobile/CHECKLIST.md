# Expo/React Native Compatibility Checklist (SDK 54)

Use this checklist to ship features that run reliably across common devices and Expo Go versions.

## Versions & Tooling
- Match SDK: Always install packages with `npx expo install <pkg>` to get SDK-compatible versions.
- Verify health: `npx expo-doctor` before PRs and after big upgrades.
- Expo Go vs SDK: Confirm your device's Expo Go client supports your SDK (Profile → About/Diagnostics). If not, upgrade Expo Go or keep project at that SDK.
- Pin Node: Use Node 18 LTS. Optionally add `.nvmrc` with `18` and run `nvm use`.
- Fix deps: If mismatch warnings appear, run `npx expo install --fix`.

## Run Modes & Caching
- LAN vs Tunnel:
  - Same Wi‑Fi: `npm start -- --lan`
  - Different networks/unstable Wi‑Fi: `npm start -- --tunnel`
- Clear cache on bundling quirks: `npm start -- --clear`
- Restart Expo Go if the app fails to refresh.

## Navigation & Gestures
- Gesture handler: Import first in entry file:
  ```ts
  // index.ts
  import 'react-native-gesture-handler';
  ```
- Safe areas: Wrap app with `SafeAreaProvider`, use `SafeAreaView` from `react-native-safe-area-context`.
- Native stack: Prefer `@react-navigation/native-stack` with `react-native-screens` for performance.

## Layout & Styling
- Avoid layout props with spotty support across RN versions (e.g., `gap`). Use margins/paddings or spacer `View`s instead.
- Use `StyleSheet.create` for styles; avoid inline styles in hot paths.
- Use `Platform.select` for platform-specific tweaks when needed.

## Components & Modules
- Prefer Expo modules where available (e.g., `expo-status-bar`, `expo-asset`, `expo-font`). Install via `npx expo install`.
- For icons use `@expo/vector-icons` (auto-linked and widely compatible).
- Permissions: Use each module's permission API (e.g., `Camera.requestPermissionsAsync()`), avoid deprecated umbrella permissions packages.

## TypeScript & Linting
- Enable strict TypeScript in `tsconfig.json` (`"strict": true`) for earlier bug catching.
- Add ESLint + React Native config to catch common pitfalls (optional but recommended).
- Type your navigation params (e.g., `RootStackParamList`) and component props.

## Networking & Links
- Use HTTPS. For dev servers on HTTP, keep on local/LAN. If hitting Android cleartext issues in a bare build, configure Network Security Config.
- Deep links: Use `expo-linking` utilities to create safe, portable URLs.

## Assets & Fonts
- Preload fonts with `expo-font` and images with `expo-asset` before showing UI to avoid flashes.
- Keep images in `assets/` and reference via static imports for bundling.

## Error Handling & Logs
- Use `try/catch` around async calls. Surface user-friendly toasts/alerts.
- Keep `LogBox.ignoreLogs` minimal; fix root causes where possible.
- Capture environment/device info when reporting bugs.

## Performance
- Prefer `FlatList` over `ScrollView` for long lists; set `keyExtractor` and `getItemLayout` when possible.
- Memoize heavy components with `React.memo` and handlers with `useCallback`.
- Avoid unnecessary re-renders: stable keys, minimal context churn.

## Web Support (optional)
- Install web deps when using Web: `npx expo install react-dom react-native-web`.
- Guard platform-specific code with `Platform.OS` or `Platform.select`.

## Team Variations & Expo Go Mismatch
- If some teammates can't update Expo Go: build a Development Client to standardize the runtime.
  ```bash
  # one-time
  npx expo install expo-dev-client
  # Android dev client build/run
  npx expo run:android
  ```
- Share the generated APK to install on devices; connect with `npm start -- --lan|--tunnel`.

## Upgrade Strategy
- Upgrade one SDK at a time; read Expo release notes.
- After upgrade:
  - `npx expo install --fix`
  - `npx expo-doctor`
  - Manual QA on Android physical device via QR.

---

Quick sanity commands
```bash
# Health check
npx expo-doctor

# Fix dependency versions
npx expo install --fix

# Start with cache clear (QR via tunnel)
npm start -- --tunnel --clear
```
