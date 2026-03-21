import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import type { VehicleInfo } from "../hooks/useLiveGreenData";

const STATUS_CONFIG: Record<
  VehicleInfo["status"],
  { label: string; dotColor: string }
> = {
  parking: { label: "Parking", dotColor: "#9E9E9E" },
  driving: { label: "Driving", dotColor: Colors.primary },
  charging: { label: "Charging", dotColor: Colors.warning },
};

const BATTERY_ICON: (pct: number) => string = (pct) => {
  if (pct >= 90) return "battery";
  if (pct >= 70) return "battery-70";
  if (pct >= 50) return "battery-50";
  if (pct >= 30) return "battery-30";
  return "battery-10";
};

interface CarInfoCardProps {
  vehicle: VehicleInfo;
}

export default function CarInfoCard({ vehicle }: CarInfoCardProps) {
  const status = STATUS_CONFIG[vehicle.status];

  return (
    <View style={styles.row}>
      <Text style={styles.name}>{vehicle.name}</Text>

      <View style={styles.badge}>
        <View style={[styles.dot, { backgroundColor: status.dotColor }]} />
        <Text style={styles.badgeText}>{status.label}</Text>
      </View>

      <View style={styles.spacer} />

      {vehicle.batteryPercent !== undefined && (
        <>
          <MaterialCommunityIcons
            name={BATTERY_ICON(vehicle.batteryPercent) as any}
            size={22}
            color={Colors.primary}
          />
          <Text style={styles.batteryText}>{vehicle.batteryPercent}%</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginRight: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  badgeText: { fontSize: 12, color: Colors.textSecondary },
  spacer: { flex: 1 },
  batteryText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginLeft: 4,
  },
});
