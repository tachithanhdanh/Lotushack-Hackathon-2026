import { StatusBar } from "expo-status-bar";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomTabBar, { TabItem } from "../components/BottomTabBar";
import { Colors } from "../theme/colors";

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
const SCENE_IMAGE = require("../../assets/car.png");

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
  if (progress >= 0.16 && progress < 0.26) {
    return "+5 pts";
  }

  if (progress >= 0.5 && progress < 0.66) {
    return "+2 pts";
  }

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

export default function Co2MeterScreen({ navigation }: any) {
  const [progress, setProgress] = React.useState(START_PROGRESS);

  React.useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setProgress((current) => {
          const next = current + STEP;
          if (next >= END_PROGRESS) {
            if (intervalId) {
              clearInterval(intervalId);
            }
            return END_PROGRESS;
          }

          return next;
        });
      }, TICK_MS);
    }, START_DELAY_MS);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const stage = getStage(progress);
  const pointBubble = getBubble(progress) ?? stage.pointBubble;
  const markerProgress = Math.min(Math.max(progress, START_PROGRESS), END_PROGRESS);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <View style={styles.scene}>
          <Image source={SCENE_IMAGE} style={styles.sceneImage} resizeMode="cover" />
        </View>

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

        <Pressable
          style={styles.exitButton}
          onPress={() => navigation.navigate("TascoHome")}
        >
          <Text style={styles.exitButtonText}>Exit Journey</Text>
        </Pressable>
      </View>

      <BottomTabBar
        tabs={TABS}
        activeKey="journey"
        onPress={(key) => {
          if (key === "home") {
            navigation.navigate("TascoHome");
          }
        }}
      />
    </SafeAreaView>
  );
}

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
    position: "absolute",
    top: SCENE_TOP,
    left: 0,
    right: 0,
    bottom: EXIT_BOTTOM + 60,
    overflow: "hidden",
    backgroundColor: Colors.canvas,
  },
  sceneImage: {
    width: "100%",
    height: "100%",
  },
  exitButton: {
    position: "absolute",
    bottom: EXIT_BOTTOM,
    alignSelf: "center",
    minWidth: 232,
    paddingHorizontal: 34,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#E73423",
    shadowColor: Colors.charcoal,
    shadowOpacity: 0,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 0,
  },
  exitButtonText: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    color: Colors.textOnPrimary,
    textAlign: "center",
  },
});
