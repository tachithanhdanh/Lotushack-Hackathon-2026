# Component & Theme Documentation

## Theme

### `src/theme/colors.ts`

Single source of truth for all colors. **Never hardcode hex strings in components — always import from here.**

```ts
import { Colors } from "../theme/colors";
```

| Token | Value | Use |
|---|---|---|
| `Colors.primary` | `#00A651` | Buttons, active states, banner, highlights |
| `Colors.primaryLight` | `#EDF7ED` | Header / hero background |
| `Colors.brandNavy` | `#1A2B6D` | "Mua xe" brand circle background |
| `Colors.brandGold` | `#FFD700` | "Mua xe" brand circle letter |
| `Colors.textPrimary` | `#1A1A1A` | Main body text |
| `Colors.textSecondary` | `#555555` | Supporting text, labels |
| `Colors.textMuted` | `#9E9E9E` | Placeholder, inactive, disabled |
| `Colors.textOnPrimary` | `#FFFFFF` | Text on green/colored backgrounds |
| `Colors.background` | `#FFFFFF` | Default screen background |
| `Colors.surfaceLight` | `#F2F2F2` | Icon container background |
| `Colors.border` | `#E0E0E0` | Dividers, borders, tab bar top line |
| `Colors.success` | `#00A651` | Success feedback |
| `Colors.warning` | `#F59E0B` | Warning feedback |
| `Colors.error` | `#EF4444` | Error feedback |
| `Colors.info` | `#3B82F6` | Info feedback |

---

## Components

### `AppButton`

**File:** `src/components/AppButton.tsx`

Reusable button. Covers all call-to-action patterns in the app.

```tsx
import AppButton from "../components/AppButton";

// Primary (default)
<AppButton label="+ Nạp tiền" onPress={handleTopUp} />

// Outline
<AppButton label="Xem thêm" variant="outline" onPress={handleMore} />

// Ghost (text-only)
<AppButton label="Bỏ qua" variant="ghost" onPress={handleSkip} />

// With icons
<AppButton label="Đặt lịch" iconLeft="calendar-check" onPress={handleBook} />
<AppButton label="Tiếp tục" iconRight="chevron-right" onPress={handleNext} />

// Sizes
<AppButton label="Nhỏ" size="sm" onPress={...} />
<AppButton label="Vừa" size="md" onPress={...} />   // default
<AppButton label="Lớn" size="lg" onPress={...} />

// Full width
<AppButton label="Xác nhận" onPress={handleConfirm} fullWidth />

// Loading / disabled
<AppButton label="Đang xử lý..." loading onPress={...} />
<AppButton label="Không khả dụng" disabled onPress={...} />
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Button text |
| `onPress` | `() => void` | — | Tap handler |
| `variant` | `"primary" \| "outline" \| "ghost"` | `"primary"` | Visual style |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size preset |
| `iconLeft` | `string` (MCI glyph) | — | Icon before label |
| `iconRight` | `string` (MCI glyph) | — | Icon after label |
| `fullWidth` | `boolean` | `false` | Stretch to fill parent |
| `loading` | `boolean` | `false` | Shows spinner, disables tap |
| `disabled` | `boolean` | `false` | Dims and disables tap |

#### Variant anatomy

```
primary  → green fill, white text
outline  → transparent fill, green border + text
ghost    → no fill, no border, green text
```

---

### `BottomTabBar`

**File:** `src/components/BottomTabBar.tsx`

App-wide bottom navigation bar. Handles its own bottom safe-area inset — do **not** wrap it in another `SafeAreaView`.

```tsx
import BottomTabBar, { TabItem } from "../components/BottomTabBar";

const TABS: TabItem[] = [
  { key: "home",          icon: "home",           label: "Trang chủ" },
  { key: "wallet",        icon: "wallet",          label: "Ví của tôi" },
  { key: "notifications", icon: "bell-outline",    label: "Thông báo" },
  { key: "account",       icon: "account-outline", label: "Tài khoản" },
];

// Inside your screen:
const [activeTab, setActiveTab] = useState("home");

<BottomTabBar tabs={TABS} activeKey={activeTab} onPress={setActiveTab} />
```

#### Props

| Prop | Type | Description |
|---|---|---|
| `tabs` | `TabItem[]` | Ordered list of tab definitions |
| `activeKey` | `string` | `key` of the currently active tab |
| `onPress` | `(key: string) => void` | Called when user taps a tab |

#### `TabItem` type

| Field | Type | Description |
|---|---|---|
| `key` | `string` | Unique identifier |
| `icon` | `string` (MCI glyph) | Icon shown above label |
| `label` | `string` | Text shown below icon |

> **Roadmap note:** Currently `onPress` just updates local state. To route between real screens, replace `Stack.Navigator` in `App.tsx` with `createBottomTabNavigator` and pass `navigation.navigate` as the `onPress` handler.

---

### `ServiceGridItem`

**File:** `src/components/ServiceGridItem.tsx`

Pressable grid cell used in service sections (Đề xuất, Tiện ích).

```tsx
import ServiceGridItem from "../components/ServiceGridItem";

<ServiceGridItem icon="shield-check" label="Bảo hiểm" />
<ServiceGridItem icon="car-hatchback" label="Mua xe" isBrand />
<ServiceGridItem icon="map-marker" label="Điểm dịch vụ" onPress={() => navigation.navigate("VehicleControls")} />
```

#### Props

| Prop | Type | Description |
|---|---|---|
| `icon` | `string` (MCI glyph) | Icon inside the rounded-square container |
| `label` | `string` | Text below icon, wraps to 2 lines |
| `isBrand` | `boolean` | Replaces icon with navy circle + gold "C" (Mua xe) |
| `onPress` | `() => void` | Optional tap handler |

Layout: `width: 25%` — always 4 items per row. Place inside a `flexWrap: "wrap"` row.

---

## Screen: `TascoHomeScreen`

**File:** `src/screens/TascoHomeScreen.tsx`
**Route:** `TascoHome` — `headerShown: false` in `App.tsx`

```
┌─────────────────────────────────┐
│  SafeAreaView (Colors.primaryLight)   top inset
│    Greeting text
│    Promo Banner  (Colors.primary)
│    Wallet row  +  <AppButton "Nạp tiền">
├─────────────────────────────────┤
│  ScrollView (Colors.background)
│    "Đề xuất"  → 4 × ServiceGridItem
│    "Tiện ích" → 8 × ServiceGridItem
├─────────────────────────────────┤
│  <BottomTabBar>                       bottom inset
└─────────────────────────────────┘
```

### Local state

| State | Default | Purpose |
|---|---|---|
| `activeTab` | `"home"` | Passed to `BottomTabBar` as `activeKey` |
| `balanceHidden` | `true` | Toggles `*******` vs real balance |

### Adding a new service item

1. Add an entry to `SUGGESTIONS` or `UTILITIES` in `TascoHomeScreen.tsx`.
2. If it navigates somewhere, add `screen: "RouteName"` — the route must exist in `RootStackParamList` in `App.tsx`.
