import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MD3Colors } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type ServiceGridItemProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap | string;
  label: string;
  onPress?: () => void;
};

export default function ServiceGridItem({
  icon,
  label,
  onPress,
}: ServiceGridItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
      onPress={onPress}
    >
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons
          name={icon as any}
          size={22}
          color={MD3Colors.primary80}
        />
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    width: "23%",
    margin: "1%",
    alignItems: "center",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  label: {
    textAlign: "center",
    fontSize: 12,
  },
});
