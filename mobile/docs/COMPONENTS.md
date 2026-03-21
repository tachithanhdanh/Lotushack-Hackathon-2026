# Component Documentation — TascoHomeScreen

## Screen: `TascoHomeScreen`

**File:** `src/screens/TascoHomeScreen.tsx`
**Route name:** `TascoHome` (no header — `headerShown: false` in App.tsx)

The main landing screen of the Tasco VETC app. Composed of three visual zones stacked vertically: a mint-green header, a scrollable body, and a fixed bottom tab bar.

```
┌─────────────────────────────────┐
│  SafeAreaView (mint bg)         │  ← top inset handled here
│  ┌─────────────────────────┐   │
│  │  Greeting text           │   │
│  │  Promo Banner (green)    │   │
│  │  Wallet row              │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│  ScrollView (white bg)          │
│    Section: Đề xuất  (4 items)  │
│    Section: Tiện ích (8 items)  │
├─────────────────────────────────┤
│  SafeAreaView (white bg)        │  ← bottom inset handled here
│  BottomTabBar                   │
└─────────────────────────────────┘
```

### Local state

| State | Type | Default | Purpose |
|---|---|---|---|
| `activeTab` | `string` | `"home"` | Tracks which bottom tab is highlighted |
| `balanceHidden` | `boolean` | `true` | Toggles masked `*******` vs real balance display |

### Data constants

| Constant | Type | Role |
|---|---|---|
| `SUGGESTIONS` | `SuggestionItem[]` | 4 items rendered in the "Đề xuất" grid |
| `UTILITIES` | `UtilityItem[]` | 8 items rendered in the "Tiện ích" grid; items with `screen` navigate on press |
| `TABS` | `TabItem[]` | 4 bottom tab definitions |

---

## Component: `ServiceGridItem`

**File:** `src/components/ServiceGridItem.tsx`

A pressable grid cell used in both the "Đề xuất" and "Tiện ích" sections.
Renders a rounded-square icon container (60×60, `borderRadius: 14`) above a two-line label.

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `icon` | `string` (MaterialCommunityIcons glyph) | Yes | Icon name drawn inside the container |
| `label` | `string` | Yes | Text below the icon; wraps to 2 lines max |
| `isBrand` | `boolean` | No | When `true`, replaces the icon with a navy circle containing a gold "C" (used for "Mua xe") |
| `onPress` | `() => void` | No | Called when the item is tapped; no-op if omitted |

### Visual anatomy

```
┌──────────────────┐
│   ┌──────────┐   │
│   │  icon    │   │   60×60 rounded square, bg #F2F2F2
│   │  or 🅒   │   │   (isBrand → navy circle with gold "C")
│   └──────────┘   │
│    label text     │   12px, centered, up to 2 lines
└──────────────────┘
  width: 25% of parent (4 per row)
```

---

## Sub-section: Header Zone

Rendered inside `SafeAreaView` with `edges={["top","left","right"]}` so the status-bar area inherits the mint background (`#EDF7ED`).

| Element | Role |
|---|---|
| Greeting text | Personalised welcome line — replace hardcoded name with auth user data |
| Promo Banner | Green `View` (`#00A651`) standing in for the real LÀN ETC image asset; swap with `<Image>` once assets are available |
| Wallet label + balance | Displays masked `*******` by default; tap to toggle reveal |
| "+ Nạp tiền" button | Top-up CTA — wire to payment flow |

---

## Sub-section: Bottom Tab Bar

Rendered inside its own `SafeAreaView` with `edges={["bottom","left","right"]}` so the home-indicator area stays white.

| Tab key | Icon | Label | Current behaviour |
|---|---|---|---|
| `home` | `home` | Trang chủ | Active by default; no navigation |
| `wallet` | `wallet` | Ví của tôi | Sets `activeTab` only |
| `notifications` | `bell-outline` | Thông báo | Sets `activeTab` only |
| `account` | `account-outline` | Tài khoản | Sets `activeTab` only |

> **Note:** The tab bar is currently cosmetic (local state only). To connect it to real screens, replace the `Stack.Navigator` in `App.tsx` with a `createBottomTabNavigator` wrapping the individual screen stacks.

---

## Colors

| Token | Value | Used for |
|---|---|---|
| `GREEN` | `#00A651` | Primary action color, active tab, banner, top-up button |
| `MINT_BG` | `#EDF7ED` | Header background |
| Icon container bg | `#F2F2F2` | `ServiceGridItem` icon wrap |
| Brand circle | `#1A2B6D` | "Mua xe" navy circle |
| Brand letter | `#FFD700` | "C" glyph in brand circle |
