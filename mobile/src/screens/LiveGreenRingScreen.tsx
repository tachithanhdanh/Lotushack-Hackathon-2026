import React from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../theme/colors";
import { useLiveGreenData } from "../hooks/useLiveGreenData";
import { MOCK_CAR_360_IMAGES } from "../constants/mock_live_green";
import Car360Viewer from "../components/Car360Viewer";
import CarInfoCard from "../components/CarInfoCard";
import GreenMissionBoard from "../components/GreenMissionBoard";

const SCREEN_W = Dimensions.get("window").width;

/**
 * Content-only component — no SafeAreaView, no BottomTabBar.
 * Rendered inside MainTabScreen which owns the shell and tab bar.
 */
export function LiveGreenRingContent() {
  const { data, loading, refresh, toggleMission } = useLiveGreenData();

  return (
    <ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    >
      {/* ── Header ─────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning, Ngoc!</Text>
        <CarInfoCard vehicle={data.vehicle} />
      </View>

      {/* ── Hero: 360° car viewer ────────────────────────── */}
      <View style={styles.hero}>
        <Car360Viewer
          images={MOCK_CAR_360_IMAGES}
          width={SCREEN_W - 40}
          height={200}
        />
      </View>

      {/* ── Mission board: stat cards + ring + checklist ─── */}
      <GreenMissionBoard
        stats={data.stats}
        missions={data.missions}
        loading={loading}
        onRefresh={refresh}
        onToggleMission={toggleMission}
      />

      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  hero: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  bottomPad: { height: 16 },
});
