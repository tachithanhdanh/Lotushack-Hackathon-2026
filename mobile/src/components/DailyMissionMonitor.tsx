import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import type { DailyStats } from "../hooks/useLiveGreenData";

interface DailyMissionMonitorProps {
  stats: DailyStats;
}

export default function DailyMissionMonitor({ stats }: DailyMissionMonitorProps) {
  return (
    <View style={styles.row}>
      <StatCard
        icon="target"
        value={`${Math.round(stats.missionProgress * 100)}%`}
        label="daily missions"
      />
      <StatCard icon="leaf" value={stats.co2Kg.toFixed(1)} label={`kg CO\u2082`} />
      <StatCard
        icon="lightning-bolt"
        value={String(stats.greenPoints)}
        label="green points"
      />
    </View>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.card}>
      <MaterialCommunityIcons name={icon as any} size={22} color={Colors.primary} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginTop: 4,
  },
  label: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: "center",
  },
});
