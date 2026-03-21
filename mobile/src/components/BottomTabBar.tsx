import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../theme/colors";

export type TabItem = {
  /** Unique identifier — pass as `activeKey` to highlight this tab */
  key: string;
  /** MaterialCommunityIcons glyph name */
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  /** Label shown below the icon */
  label: string;
};

export type BottomTabBarProps = {
  tabs: TabItem[];
  activeKey: string;
  onPress: (key: string) => void;
};

/**
 * App-wide bottom tab bar.
 *
 * Usage:
 * ```tsx
 * <BottomTabBar tabs={TABS} activeKey={activeTab} onPress={setActiveTab} />
 * ```
 *
 * Handles its own bottom safe-area inset — no need to wrap it in another SafeAreaView.
 */
export default function BottomTabBar({ tabs, activeKey, onPress }: BottomTabBarProps) {
  return (
    <SafeAreaView style={styles.safe} edges={["bottom", "left", "right"]}>
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;
          const color = isActive ? Colors.primary : Colors.textMuted;
          return (
            <Pressable
              key={tab.key}
              style={styles.item}
              onPress={() => onPress(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <MaterialCommunityIcons name={tab.icon} size={24} color={color} />
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: Colors.background },
  bar: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
    paddingVertical: 4,
  },
  item: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
  },
  label: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
