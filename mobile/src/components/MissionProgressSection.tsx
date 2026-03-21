import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import type { Mission } from "../hooks/useLiveGreenData";

// Ring geometry constants
const RING_R = 72;
const RING_SW = 13;
const RING_C = 2 * Math.PI * RING_R;
const RING_SIZE = (RING_R + RING_SW) * 2;

interface MissionProgressSectionProps {
  missions: Mission[];
  loading: boolean;
  onRefresh: () => void;
}

export default function MissionProgressSection({
  missions,
  loading,
  onRefresh,
}: MissionProgressSectionProps) {
  const doneCount = missions.filter((m) => m.done).length;
  const progress = missions.length > 0 ? doneCount / missions.length : 0;

  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>Live Green</Text>
          <Text style={styles.sub}>Do daily missions to earn Green Points</Text>
        </View>
        <TouchableOpacity
          onPress={onRefresh}
          disabled={loading}
          style={styles.refreshBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialCommunityIcons
            name="refresh"
            size={20}
            color={loading ? Colors.textMuted : Colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Circular progress ring */}
      <View style={styles.ringWrap}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          {/* Track */}
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_R}
            stroke="#E0E0E0"
            strokeWidth={RING_SW}
            fill="none"
          />
          {/* Progress arc */}
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_R}
            stroke={Colors.primary}
            strokeWidth={RING_SW}
            fill="none"
            strokeDasharray={`${RING_C * progress} ${RING_C}`}
            strokeLinecap="round"
            transform={`rotate(-90, ${RING_SIZE / 2}, ${RING_SIZE / 2})`}
          />
          {/* Center label */}
          <SvgText
            x={RING_SIZE / 2}
            y={RING_SIZE / 2 + 13}
            textAnchor="middle"
            fill={Colors.textPrimary}
            fontSize={34}
            fontWeight="700"
          >
            {`${Math.round(progress * 100)}%`}
          </SvgText>
        </Svg>
      </View>

      {/* Mission list */}
      {missions.map((m) => (
        <MissionRow key={m.id} mission={m} />
      ))}
    </View>
  );
}

function MissionRow({ mission }: { mission: Mission }) {
  return (
    <View style={styles.missionRow}>
      <MaterialCommunityIcons
        name={mission.done ? "check-circle" : "radiobox-blank"}
        size={26}
        color={mission.done ? Colors.primary : "#C0C0C0"}
        style={styles.missionIcon}
      />
      <Text style={styles.missionLabel}>{mission.label}</Text>
      <View style={styles.missionRight}>
        <View style={[styles.ptsBadge, mission.done && styles.ptsBadgeDone]}>
          <Text style={[styles.ptsText, mission.done && styles.ptsTextDone]}>
            +{mission.pts} pts
          </Text>
        </View>
        {mission.sub ? (
          <Text style={styles.missionSub}>{mission.sub}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, paddingTop: 20 },

  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  sub: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  refreshBtn: {
    marginLeft: "auto" as any,
    marginTop: 2,
  },

  ringWrap: { alignItems: "center", marginBottom: 24 },

  missionRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  missionIcon: { marginRight: 12 },
  missionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  missionRight: { alignItems: "flex-end" },
  ptsBadge: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  ptsBadgeDone: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  ptsText: { fontSize: 12, color: Colors.textSecondary, fontWeight: "600" },
  ptsTextDone: { color: Colors.primary },
  missionSub: { fontSize: 11, color: Colors.textMuted, marginTop: 3 },
});
