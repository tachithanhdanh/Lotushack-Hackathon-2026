# Mobile Dev Guide (Expo SDK 54)

Goal: move fast with working UI on Android + Web, minimal bugs, and AI-friendly patterns.

## Node & Tooling
- Node: Prefer Node 18 LTS for SDK 54. Node 20 often works, but pin to 18 for hackathon stability.
  - Use `nvm use` (repo has `.nvmrc`). Optional add `"engines": {"node": ">=18 <21"}` (already set).
- Install packages with `npx expo install <pkg>` to get SDK-compatible versions.
- Health check: `npx expo-doctor` (run before PRs / after upgrades).

## Project Conventions
- Screens: place screen components in `screens/` (or keep simple in `App.tsx` for tiny demos).
- Navigation: use React Navigation with `native-stack`.
- UI Library: use `react-native-paper` (Material 3) for stable cross-platform components.
- Icons: use `@expo/vector-icons` (works out-of-the-box with Expo).
- Styling: keep base styles in `StyleSheet.create`; avoid fragile props like `gap`.
- Safe Areas: wrap app in `SafeAreaProvider` and prefer `SafeAreaView` from `react-native-safe-area-context`.
- Gestures: ensure `import 'react-native-gesture-handler'` is first line in `index.ts`.

## Start Commands
```bash
# Android device via QR (tunnel works across networks)
npm start -- --tunnel

# Same Wi‑Fi (faster)
npm start -- --lan

# Clear cache when bundler acts up
npm start -- --clear
```

## UI Recipes (Paper)
- App header: use `Appbar.Header` as a custom header for stacks.
- Buttons: `Button` from RN works; `react-native-paper` also provides themed `Button`.
- Forms: start simple with `TextInput` (Paper). For complex forms, add `react-hook-form` + `zod`.
- Cards/Lists: `Card`, `List`, `Divider` from Paper are stable on Android/Web.

## Data & Errors
- Wrap async code in `try/catch`; show friendly messages using `Alert` or a toast lib.
- For network calls, centralize fetch+retry logic; add timeouts.

## Testing & QA
- Type-check: `npx tsc -p tsconfig.json --noEmit`.
- Quick smoke test: scan QR on a physical Android after dependency changes.
- Web sanity: `npm run web` (requires `react-dom`, `react-native-web`).

## When Things Break
- Dependency mismatch: `npx expo install --fix`.
- Expo Go version mismatch: either upgrade Expo Go, or keep project on its supported SDK (current: 54).
- Team can’t update Expo Go: create a Development Client.
```bash
npx expo install expo-dev-client
npx expo run:android
```

## AI Prompting Tips (for this repo)
- Ask for UI using `react-native-paper` components and wrap screens with safe area.
- Prefer `@react-navigation/native-stack` patterns; pass typed params.
- Avoid props with partial RN/Web support; prefer margins/spacers.
- Provide runnable snippets end-to-end: imports, component, and small usage demo.

## Minimal Example (already implemented)
- See `App.tsx` for two screens (Home, Details) with navigation, Paper header, cards, inputs, alerts, and links.

---

## Component Palette (Allowed by default)
- Layout: `SafeAreaProvider`, `SafeAreaView`, `View`, `ScrollView`, `FlatList`, `Divider`
- Typography: `Text` (RN), `react-native-paper` theming via `PaperProvider`
- Inputs: `TextInput` (Paper), `Button` (RN or Paper), `Pressable`
- Surfaces: `Card`, `List.*`, `Appbar.Header`
- Navigation: `@react-navigation/native-stack` + `react-native-screens`
- Icons: `@expo/vector-icons`

Notes
- Avoid experimental/spotty props (e.g., `gap`). Prefer margins/paddings or spacer `View`.
- Always import `react-native-gesture-handler` first in `index.ts`.
- Install via `npx expo install` to ensure SDK compatibility.

## Skeletons (Copy/Paste Ready)

Screen Template (native-stack + safe area)
```tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SampleScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.section} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', padding: 16 },
  section: { height: 100 },
});
```

FlatList Template (stable list with separators)
```tsx
import React from 'react';
import { FlatList, View } from 'react-native';
import { Divider, List } from 'react-native-paper';

type Item = { id: string; title: string };

const data: Item[] = [
  { id: '1', title: 'First' },
  { id: '2', title: 'Second' },
];

export function SampleList() {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={Divider}
      renderItem={({ item }) => (
        <List.Item title={item.title} left={(p) => <List.Icon {...p} icon="folder" />} />
      )}
      contentContainerStyle={{ padding: 12 }}
    />
  );
}
```

Form Template (Paper-only; no extra deps)
```tsx
import React from 'react';
import { View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

export function SimpleForm() {
  const [email, setEmail] = React.useState('');
  const hasError = !!email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  return (
    <View style={{ padding: 12 }}>
      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <HelperText type={hasError ? 'error' : 'info'} visible>
        {hasError ? 'Invalid email' : 'We will never share your email.'}
      </HelperText>
      <Button mode="contained" disabled={!email || hasError} onPress={() => { /* submit */ }}>
        Submit
      </Button>
    </View>
  );
}
```

## Definition of Done (DoD)
- Build health: `npx tsc -p tsconfig.json --noEmit` passes; `npx expo-doctor` shows 0 issues.
- Device run: QR on an Android physical device loads without redbox; navigation Back/Home works.
- Web sanity: `npm run web` renders core screens.
- Compatibility: no usage of fragile props (`gap`, unstable experimental flags).
- Logs: no unexpected `console.error`/`console.warn` at interaction time.
