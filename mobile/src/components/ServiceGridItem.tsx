import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type ServiceGridItemProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap | string;
  label: string;
  /** Renders a brand circle logo (navy circle with gold "C") instead of an icon */
  isBrand?: boolean;
  onPress?: () => void;
};

export default function ServiceGridItem({
  icon,
  label,
  isBrand,
  onPress,
}: ServiceGridItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
      onPress={onPress}
    >
      <View style={styles.iconWrap}>
        {isBrand ? (
          <View style={styles.brandCircle}>
            <Text style={styles.brandLetter}>C</Text>
          </View>
        ) : (
          <MaterialCommunityIcons
            name={icon as any}
            size={28}
            color="#333"
          />
        )}
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    width: "25%",
    paddingHorizontal: 4,
    paddingVertical: 8,
    alignItems: "center",
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  brandCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1A2B6D",
    alignItems: "center",
    justifyContent: "center",
  },
  brandLetter: {
    color: "#FFD700",
    fontSize: 20,
    fontWeight: "800",
  },
  label: {
    textAlign: "center",
    fontSize: 12,
    color: "#333",
    lineHeight: 16,
  },
});
