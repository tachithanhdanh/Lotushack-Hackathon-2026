import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomTabBar, { TabItem } from "../components/BottomTabBar";
import { Colors } from "../theme/colors";

const VIDEO_SOURCE = require("../../assets/video_xe_chay.mp4");
const SCENE_IMAGE = require("../../assets/car.png");

type MeterStage = {
  eyebrow?: string;
  titleLead: string;
  titleAccent: string;
  subtitle: string;
  deltaSavedValue: string;
  totalPoints: string;
  pointBubble?: string;
  showPin?: boolean;
};

const TABS: TabItem[] = [
  { key: "home", icon: "home-outline", label: "Home" },
  { key: "journey", icon: "navigation-variant", label: "Journey" },
  { key: "impacts", icon: "leaf", label: "Impacts" },
  { key: "rewards", icon: "gift-outline", label: "Rewards" },
];

const START_PROGRESS = 0.06;
const END_PROGRESS = 0.96;
const TICK_MS = 80;
const START_DELAY_MS = 2500;
const LOOP_MS = 9600;
const STEP = ((END_PROGRESS - START_PROGRESS) * TICK_MS) / LOOP_MS;
const TRACK_DOTS = [0.16, 0.5];
const WAYPOINTS = [0.16, 0.5, 0.88];
const SCENE_TOP = 228;
const EXIT_BOTTOM = 14;

// ── Video background ───────────────────────────────────────────────────────

function JourneyVideoBackground() {
  const player = useVideoPlayer(VIDEO_SOURCE, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <VideoView
      player={player}
      style={StyleSheet.absoluteFillObject}
      contentFit="cover"
      nativeControls={false}
    />
  );
}

// ── Stage helpers ──────────────────────────────────────────────────────────

function getStage(progress: number): MeterStage {
  if (progress < WAYPOINTS[0]) {
    return {
      titleLead: "Arrive at ",
      titleAccent: "10:30 AM",
      subtitle: "VNG Campus | 4.8 km remaining",
      deltaSavedValue: "0",
      totalPoints: "Total: 0 pts",
      showPin: true,
    };
  }

  if (progress < WAYPOINTS[1]) {
    return {
      titleLead: "You have saved ",
      titleAccent: "0.8 kg CO2",
      subtitle: "ETC Charging Station I",
      deltaSavedValue: "0.2",
      totalPoints: "Total: +5 pts",
      pointBubble: "+5 pts",
      showPin: true,
    };
  }

  if (progress < WAYPOINTS[2]) {
    return {
      titleLead: "You have saved ",
      titleAccent: "1 kg CO2",
      subtitle: "ETC Parking Lot",
      deltaSavedValue: "0.8",
      totalPoints: "Total: +7 pts",
      pointBubble: "+2 pts",
      showPin: true,
    };
  }

  return {
    eyebrow: "🎉 Congrats",
    titleLead: "You've saved ",
    titleAccent: "1 kg CO2",
    subtitle: "",
    deltaSavedValue: "1",
    totalPoints: "Total: +7 pts",
    showPin: false,
  };
}

function getBubble(progress: number) {
  if (progress >= 0.16 && progress < 0.26) return "+5 pts";
  if (progress >= 0.5 && progress < 0.66) return "+2 pts";
  return undefined;
}

function JourneyTitle({ stage }: { stage: MeterStage }) {
  return (
    <Text style={styles.title}>
      {stage.titleLead}
      <Text style={styles.titleAccent}>{stage.titleAccent}</Text>
    </Text>
  );
}

// ── Congratulations overlay ────────────────────────────────────────────────

function StatBox({
  value,
  label,
  valueColor,
}: {
  value: string;
  label: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, valueColor ? { color: valueColor } : null]}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function CongratsOverlay({ onDone }: { onDone: () => void }) {
  return (
    <View style={styles.congratsOverlay}>
      <View style={styles.congratsBadgeWrap}>
        <View style={styles.congratsBadgeOuter}>
          <View style={styles.congratsBadgeInner}>
            <MaterialCommunityIcons
              name="check-bold"
              size={48}
              color={Colors.textOnPrimary}
            />
          </View>
        </View>
      </View>

      <Text style={styles.congratsTitle}>Journey Complete!</Text>
      <Text style={styles.congratsSubtitle}>
        You've made a difference today.{"\n"}Keep up the green habit!
      </Text>

      <View style={styles.statsGrid}>
        <StatBox value="1 kg" label="CO₂ Saved" valueColor={Colors.success} />
        <View style={styles.statsGridDivider} />
        <StatBox value="+7 pts" label="Green Points" valueColor={Colors.warning} />
      </View>

      <View style={styles.tripSummaryCard}>
        <View style={styles.tripSummaryRow}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={18}
            color={Colors.textMuted}
          />
          <Text style={styles.tripSummaryText}>Home → VNG Campus</Text>
        </View>
        <View style={styles.tripSummaryDivider} />
        <View style={styles.tripSummaryPills}>
          <View style={styles.tripSummaryPill}>
            <MaterialCommunityIcons name="map-marker-distance" size={14} color={Colors.primary} />
            <Text style={styles.tripSummaryPillText}>4.8 km</Text>
          </View>
          <View style={styles.tripSummaryPill}>
            <MaterialCommunityIcons name="clock-outline" size={14} color={Colors.primary} />
            <Text style={styles.tripSummaryPillText}>31 min</Text>
          </View>
          <View style={styles.tripSummaryPill}>
            <MaterialCommunityIcons name="leaf" size={14} color={Colors.primary} />
            <Text style={styles.tripSummaryPillText}>Grade A</Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.congratsButton} onPress={onDone}>
        <Text style={styles.congratsButtonText}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────

export default function Co2MeterScreen({ navigation }: any) {
  const [progress, setProgress] = React.useState(START_PROGRESS);

  React.useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setProgress((current) => {
          const next = current + STEP;
          if (next >= END_PROGRESS) {
            if (intervalId) clearInterval(intervalId);
            return END_PROGRESS;
          }
          return next;
        });
      }, TICK_MS);
    }, START_DELAY_MS);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const isComplete = progress >= END_PROGRESS;
  const stage = getStage(progress);
  const pointBubble = getBubble(progress) ?? stage.pointBubble;
  const markerProgress = Math.min(Math.max(progress, START_PROGRESS), END_PROGRESS);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        {/* Looping video background — car driving forward */}
        <View style={styles.scene}>
          <JourneyVideoBackground />
        </View>

        {/* Journey progress card */}
        <View style={styles.card}>
          {stage.eyebrow ? <Text style={styles.eyebrow}>{stage.eyebrow}</Text> : null}
          <JourneyTitle stage={stage} />
          {stage.subtitle ? <Text style={styles.subtitle}>{stage.subtitle}</Text> : null}

          <View style={styles.trackSection}>
            <View style={styles.track}>
              <View style={styles.trackBase} />
              <View style={[styles.trackActive, { width: `${markerProgress * 100}%` }]} />

              {TRACK_DOTS.map((point) => {
                const reached = markerProgress >= point;
                return (
                  <View
                    key={point}
                    style={[
                      styles.trackDot,
                      { left: `${point * 100}%` },
                      reached && styles.trackDotActive,
                    ]}
                  />
                );
              })}

              {stage.showPin !== false ? (
                <View style={styles.pinWrap}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={30}
                    color={Colors.error}
                  />
                </View>
              ) : null}

              <View style={[styles.carMarkerWrap, { left: `${markerProgress * 100}%` }]}>
                {pointBubble ? (
                  <View style={styles.pointsBubble}>
                    <Text style={styles.pointsBubbleText}>{pointBubble}</Text>
                    <View style={styles.pointsBubbleTail} />
                  </View>
                ) : null}

                <View style={styles.carMarker}>
                  <View style={styles.carMarkerCrop}>
                    <Image
                      source={SCENE_IMAGE}
                      style={styles.carMarkerImage}
                      resizeMode="cover"
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.savedRow}>
                <MaterialCommunityIcons
                  name="arrow-up"
                  size={22}
                  color={markerProgress < WAYPOINTS[0] ? Colors.textMuted : Colors.success}
                />
                <Text style={styles.savedText}>
                  <Text
                    style={[
                      styles.savedAccent,
                      markerProgress < WAYPOINTS[0] && styles.savedAccentMuted,
                    ]}
                  >
                    {stage.deltaSavedValue} kg
                  </Text>{" "}
                  CO2 saved
                </Text>
              </View>
              <Text style={styles.totalPoints}>{stage.totalPoints}</Text>
            </View>
          </View>
        </View>

        {/* Congratulations overlay — shown when journey finishes */}
        {isComplete ? (
          <CongratsOverlay onDone={() => navigation.navigate("MainTab")} />
        ) : null}

        {!isComplete ? (
          <Pressable
            style={styles.exitButton}
            onPress={() => navigation.navigate("MainTab")}
          >
            <Text style={styles.exitButtonText}>Exit Journey</Text>
          </Pressable>
        ) : null}
      </View>

      <BottomTabBar
        tabs={TABS}
        activeKey="journey"
        onPress={(key) => {
          if (key === "home") navigation.navigate("MainTab");
        }}
      />
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  card: {
    position: "absolute",
    left: 18,
    right: 18,
    top: 18,
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 18,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    shadowColor: Colors.charcoal,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
    zIndex: 2,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "800",
    color: Colors.ink,
  },
  eyebrow: {
    marginBottom: 10,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    color: Colors.textSecondary,
  },
  titleAccent: {
    color: Colors.success,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 18,
    lineHeight: 26,
    color: Colors.textSecondary,
  },
  trackSection: {
    marginTop: 26,
  },
  track: {
    height: 56,
    justifyContent: "center",
  },
  trackBase: {
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.track,
  },
  trackActive: {
    position: "absolute",
    left: 0,
    height: 6,
    borderRadius: 999,
    backgroundColor: Colors.success,
  },
  trackDot: {
    position: "absolute",
    top: 19,
    width: 18,
    height: 18,
    marginLeft: -9,
    borderRadius: 9,
    backgroundColor: Colors.track,
  },
  trackDotActive: {
    backgroundColor: Colors.success,
  },
  pinWrap: {
    position: "absolute",
    right: -10,
    top: 8,
  },
  carMarkerWrap: {
    position: "absolute",
    top: 8,
    marginLeft: -24,
    alignItems: "center",
  },
  carMarker: {
    width: 52,
    height: 28,
    borderRadius: 13,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.charcoal,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  carMarkerCrop: {
    width: 44,
    height: 22,
    borderRadius: 11,
    overflow: "hidden",
  },
  carMarkerImage: {
    position: "absolute",
    left: -2,
    top: -37,
    width: 48,
    height: 71,
  },
  pointsBubble: {
    position: "absolute",
    bottom: 34,
    alignItems: "center",
    minWidth: 70,
  },
  pointsBubbleText: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: Colors.ink,
    color: Colors.textOnPrimary,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  pointsBubbleTail: {
    marginTop: -1,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: Colors.ink,
  },
  statsRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  savedRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  savedText: {
    marginLeft: 2,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  savedAccent: {
    color: Colors.success,
    fontSize: 18,
    fontWeight: "700",
  },
  savedAccentMuted: {
    color: Colors.textSecondary,
  },
  totalPoints: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.success,
  },
  scene: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.charcoal,
  },

  // ── Exit button ──────────────────────────────────────────
  exitButton: {
    position: "absolute",
    bottom: EXIT_BOTTOM,
    alignSelf: "center",
    minWidth: 232,
    paddingHorizontal: 34,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "red",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    zIndex: 3,
  },
  exitButtonText: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    color: Colors.textOnPrimary,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // ── Congratulations overlay ──────────────────────────────
  congratsOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: SCENE_TOP - 40,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "center",
    shadowColor: Colors.charcoal,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
    elevation: 10,
    zIndex: 5,
  },
  congratsBadgeWrap: {
    marginTop: -36,
    marginBottom: 20,
  },
  congratsBadgeOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: Colors.surface,
    shadowColor: Colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  congratsBadgeInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  congratsTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.ink,
    textAlign: "center",
  },
  congratsSubtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    width: "100%",
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.ink,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: "600",
  },
  statsGridDivider: {
    width: 1,
    height: 44,
    backgroundColor: Colors.border,
  },
  tripSummaryCard: {
    marginTop: 16,
    width: "100%",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  tripSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripSummaryText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "700",
    color: Colors.ink,
  },
  tripSummaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  tripSummaryPills: {
    flexDirection: "row",
  },
  tripSummaryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  tripSummaryPillText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "700",
    color: Colors.success,
  },
  congratsButton: {
    marginTop: 20,
    width: "100%",
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: Colors.success,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  congratsButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textOnPrimary,
  },
});
