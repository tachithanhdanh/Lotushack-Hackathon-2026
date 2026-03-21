import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";

export type AppButtonVariant = "primary" | "outline" | "ghost";
export type AppButtonSize = "sm" | "md" | "lg";

export type AppButtonProps = {
  label: string;
  onPress: () => void;
  /** Visual style of the button. Default: "primary" */
  variant?: AppButtonVariant;
  /** Size preset. Default: "md" */
  size?: AppButtonSize;
  /** MaterialCommunityIcons glyph name shown before the label */
  iconLeft?: keyof typeof MaterialCommunityIcons.glyphMap;
  /** MaterialCommunityIcons glyph name shown after the label */
  iconRight?: keyof typeof MaterialCommunityIcons.glyphMap;
  /** Stretch to fill parent width */
  fullWidth?: boolean;
  /** Show a loading spinner and disable interaction */
  loading?: boolean;
  /** Dim and disable interaction */
  disabled?: boolean;
};

const SIZE_MAP: Record<
  AppButtonSize,
  { paddingVertical: number; paddingHorizontal: number; fontSize: number; iconSize: number; borderRadius: number }
> = {
  sm: { paddingVertical: 7, paddingHorizontal: 14, fontSize: 13, iconSize: 16, borderRadius: 20 },
  md: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 14, iconSize: 18, borderRadius: 24 },
  lg: { paddingVertical: 15, paddingHorizontal: 28, fontSize: 16, iconSize: 20, borderRadius: 28 },
};

export default function AppButton({
  label,
  onPress,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  fullWidth = false,
  loading = false,
  disabled = false,
}: AppButtonProps) {
  const s = SIZE_MAP[size];
  const isDisabled = disabled || loading;

  // Resolve colors per variant
  const bgColor =
    variant === "primary"
      ? isDisabled
        ? "#A3D9BC"
        : Colors.primary
      : "transparent";

  const textColor =
    variant === "primary"
      ? Colors.textOnPrimary
      : isDisabled
      ? Colors.textMuted
      : Colors.primary;

  const borderColor =
    variant === "outline" ? (isDisabled ? Colors.border : Colors.primary) : "transparent";

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bgColor,
          borderColor,
          borderWidth: variant === "outline" ? 1.5 : 0,
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          borderRadius: s.borderRadius,
          alignSelf: fullWidth ? "stretch" : "flex-start",
          opacity: pressed && !isDisabled ? 0.8 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? Colors.textOnPrimary : Colors.primary}
        />
      ) : (
        <View style={styles.inner}>
          {iconLeft && (
            <MaterialCommunityIcons
              name={iconLeft}
              size={s.iconSize}
              color={textColor}
              style={{ marginRight: 6 }}
            />
          )}
          <Text style={[styles.label, { fontSize: s.fontSize, color: textColor }]}>
            {label}
          </Text>
          {iconRight && (
            <MaterialCommunityIcons
              name={iconRight}
              size={s.iconSize}
              color={textColor}
              style={{ marginLeft: 6 }}
            />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontWeight: "700",
  },
});
