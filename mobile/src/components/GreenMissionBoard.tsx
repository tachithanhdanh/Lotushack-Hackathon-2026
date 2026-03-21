import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import type { DailyStats, Mission } from "../hooks/useLiveGreenData";

// ── Ring geometry ─────────────────────────────────────────────────────────────
const RING_R = 72;
const RING_SW = 13;
const RING_C = 2 * Math.PI * RING_R;
const RING_SIZE = (RING_R + RING_SW) * 2;

// ── Props ─────────────────────────────────────────────────────────────────────
interface GreenMissionBoardProps {
  stats: DailyStats;
  missions: Mission[];
  loading: boolean;
  onRefresh: () => void;
  onToggleMission: (id: string) => void;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function GreenMissionBoard({
  stats,
  missions,
  loading,
  onRefresh,
  onToggleMission,
}: GreenMissionBoardProps) {
  return (
    <>
      {/* ── Stat cards row ─────────────────────────────── */}
      <View style={styles.statsRow}>
        <StatCard
          icon="target"
          value={`${Math.round(stats.missionProgress * 100)}%`}
          label="daily missions"
        />
        <StatCard
          icon="leaf"
          value={stats.co2Kg.toFixed(1)}
          label={`kg CO\u2082`}
        />
        <StatCard
          icon="lightning-bolt"
          value={String(stats.greenPoints)}
          label="green points"
        />
      </View>

      {/* ── Live Green section ──────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Live Green</Text>
            <Text style={styles.sub}>
              Do daily missions to earn Green Points
            </Text>
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

        {/* Progress ring — progress derived from missions state */}
        <View style={styles.ringWrap}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_R}
              stroke="#E0E0E0"
              strokeWidth={RING_SW}
              fill="none"
            />
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_R}
              stroke={Colors.primary}
              strokeWidth={RING_SW}
              fill="none"
              strokeDasharray={`${RING_C * stats.missionProgress} ${RING_C}`}
              strokeLinecap="round"
              transform={`rotate(-90, ${RING_SIZE / 2}, ${RING_SIZE / 2})`}
            />
            <SvgText
              x={RING_SIZE / 2}
              y={RING_SIZE / 2 + 13}
              textAnchor="middle"
              fill={Colors.textPrimary}
              fontSize={34}
              fontWeight="700"
            >
              {`${Math.round(stats.missionProgress * 100)}%`}
            </SvgText>
          </Svg>
        </View>

        {/* Mission checklist */}
        {missions.map((m) => (
          <MissionRow key={m.id} mission={m} onToggle={onToggleMission} />
        ))}
      </View>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

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
    <View style={styles.statCard}>
      <MaterialCommunityIcons
        name={icon as any}
        size={22}
        color={Colors.primary}
      />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MissionRow({
  mission,
  onToggle,
}: {
  mission: Mission;
  onToggle: (id: string) => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.missionRow,
        mission.done && styles.missionRowDone,
        pressed && styles.missionRowPressed,
      ]}
      onPress={() => onToggle(mission.id)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: mission.done }}
    >
      <MaterialCommunityIcons
        name={mission.done ? "check-circle" : "radiobox-blank"}
        size={26}
        color={mission.done ? Colors.primary : "#C0C0C0"}
        style={styles.missionIcon}
      />
      <Text
        style={[styles.missionLabel, mission.done && styles.missionLabelDone]}
      >
        {mission.label}
      </Text>
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
    </Pressable>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Stat cards
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: "center",
  },

  // Section header
  section: { paddingHorizontal: 20, paddingTop: 20 },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: "700", color: Colors.textPrimary },
  sub: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  refreshBtn: { marginLeft: "auto" as any, marginTop: 2 },

  // Ring
  ringWrap: { alignItems: "center", marginBottom: 24 },

  // Mission rows
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
  missionRowDone: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  missionRowPressed: { opacity: 0.7 },
  missionIcon: { marginRight: 12 },
  missionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  missionLabelDone: { color: Colors.primary },
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
