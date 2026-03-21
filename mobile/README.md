# Mobile (Expo)

Run the React Native app locally and load it on an Android device via QR code using Expo Go.

See also: [CHECKLIST.md](CHECKLIST.md) for compatibility best practices and [DEV_GUIDE.md](DEV_GUIDE.md) for AI-friendly patterns.

## Requirements
- Node.js 18+ and npm 9+
- Android device with the "Expo Go" app installed (from Google Play)
- Same network as your dev machine, or use the `--tunnel` option

## Setup
```bash
# From repo root
cd mobile
nvm use  # optional but recommended (Node 18)
npm install
```

## Start (QR scan on Android)
```bash
# Starts Expo dev server using a tunnel for easy device connectivity
npm start -- --tunnel
```

- Open Expo Go on your Android phone.
- Scan the QR code shown in the terminal or the browser UI that opens.
- Hot-reload is enabled by default; edits to `App.tsx` will refresh instantly.

## Common Tips
- If your network is stable and devices are on the same Wi‑Fi, you can try faster LAN mode:
  ```bash
  npm start -- --lan
  ```
- If the QR doesn’t load, switch between `--tunnel` and `--lan`, or restart Expo Go (swipe to close, reopen).
- Clear Metro cache if you hit odd bundling issues:
  ```bash
  npm start -- --clear
  ```
- To run the web preview in a browser:
  ```bash
  npm run web
  ```

## Project Structure
- Entry: `index.ts`
- App: `App.tsx`
- Config: `app.json`, `tsconfig.json`, `package.json`
- Assets: `assets/`

## Next Steps
- Rename the app by updating `name` and `slug` in `app.json`.
- Add libraries via `npx expo install <package>` to ensure compatible versions with Expo SDK.
