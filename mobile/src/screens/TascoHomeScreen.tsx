import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ServiceGridItem from "../components/ServiceGridItem";

const GREEN = "#00A651";
const MINT_BG = "#EDF7ED";

type SuggestionItem = { icon: string; label: string; isBrand?: boolean };
type UtilityItem = { icon: string; label: string; screen?: string };
type TabItem = { key: string; icon: string; label: string };

const SUGGESTIONS: SuggestionItem[] = [
  { icon: "shield-check", label: "Bảo hiểm" },
  { icon: "car-hatchback", label: "Mua xe", isBrand: true },
  { icon: "calendar-check", label: "Đặt lịch\nsửa chữa" },
  { icon: "gas-station", label: "Trạm xăng" },
];

const UTILITIES: UtilityItem[] = [
  { icon: "credit-card", label: "Tài khoản\ngiao thông" },
  { icon: "ticket-confirmation", label: "Mua vé\ntháng quý" },
  { icon: "history", label: "Lịch sử\ngiao dịch" },
  { icon: "car-cog", label: "Quản lý xe" },
  { icon: "map-marker", label: "Điểm dịch vụ", screen: "VehicleControls" },
  { icon: "security", label: "Bảo hiểm" },
  { icon: "car-arrow-right", label: "Nhận xe từ" },
  { icon: "view-grid", label: "Tất cả" },
];

const TABS: TabItem[] = [
  { key: "home", icon: "home", label: "Trang chủ" },
  { key: "wallet", icon: "wallet", label: "Ví của tôi" },
  { key: "notifications", icon: "bell-outline", label: "Thông báo" },
  { key: "account", icon: "account-outline", label: "Tài khoản" },
];

export default function TascoHomeScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState("home");
  const [balanceHidden, setBalanceHidden] = useState(true);

  return (
    <View style={styles.container}>
      {/* ── Header: mint background, greeting, banner, wallet ── */}
      <SafeAreaView style={styles.headerSafe} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <Text style={styles.greeting}>👋 Chào TRẦN TUẤN ANH!</Text>

          {/* Promotional banner */}
          <View style={styles.banner}>
            <View>
              <Text style={styles.bannerBrand}>LÀN ETC</Text>
              <Text style={styles.bannerVetc}>VETC</Text>
            </View>
            <View style={styles.bannerRight}>
              <Text style={styles.bannerSlogan}>SỐNG HIỆN ĐẠI</Text>
              <Text style={styles.bannerSlogan}>LÁI VĂN MINH</Text>
            </View>
          </View>

          {/* Wallet balance row */}
          <View style={styles.walletRow}>
            <View>
              <View style={styles.walletLabelRow}>
                <Text style={styles.walletLabel}>Số dư ví khả dụng</Text>
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={14}
                  color="#555"
                  style={{ marginLeft: 6 }}
                />
              </View>
              <Pressable
                onPress={() => setBalanceHidden((v) => !v)}
                style={styles.balanceRow}
              >
                <Text style={styles.balance}>
                  {balanceHidden ? "*******" : "1.234.567 đ"}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={18}
                  color="#333"
                />
              </Pressable>
            </View>
            <Pressable style={styles.topUpButton}>
              <Text style={styles.topUpText}>+ Nạp tiền</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      {/* ── Scrollable service sections ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Đề xuất</Text>
        <View style={styles.gridRow}>
          {SUGGESTIONS.map((item) => (
            <ServiceGridItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              isBrand={item.isBrand}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Tiện ích</Text>
        <View style={styles.gridRow}>
          {UTILITIES.map((item) => (
            <ServiceGridItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              onPress={
                item.screen
                  ? () => navigation.navigate(item.screen!)
                  : undefined
              }
            />
          ))}
        </View>
      </ScrollView>

      {/* ── Bottom tab bar ── */}
      <SafeAreaView
        style={styles.tabBarSafe}
        edges={["bottom", "left", "right"]}
      >
        <View style={styles.tabBar}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={styles.tabItem}
                onPress={() => setActiveTab(tab.key)}
              >
                <MaterialCommunityIcons
                  name={tab.icon as any}
                  size={24}
                  color={isActive ? GREEN : "#9E9E9E"}
                />
                <Text
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Header
  headerSafe: { backgroundColor: MINT_BG },
  header: {
    backgroundColor: MINT_BG,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },

  // Banner
  banner: {
    backgroundColor: GREEN,
    borderRadius: 12,
    height: 110,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  bannerBrand: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  bannerVetc: { color: "#fff", fontSize: 12, fontWeight: "600" },
  bannerRight: { alignItems: "flex-end" },
  bannerSlogan: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "right",
  },

  // Wallet
  walletRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  walletLabelRow: { flexDirection: "row", alignItems: "center" },
  walletLabel: { fontSize: 13, color: "#555" },
  balanceRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  balance: { fontSize: 18, fontWeight: "700", color: "#111", marginRight: 2 },
  topUpButton: {
    backgroundColor: GREEN,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  topUpText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  // Scroll content
  scroll: { flex: 1, backgroundColor: "#fff" },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },

  // Bottom tab bar
  tabBarSafe: { backgroundColor: "#fff" },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#fff",
    paddingVertical: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
  },
  tabLabel: { fontSize: 11, color: "#9E9E9E", marginTop: 2 },
  tabLabelActive: { color: GREEN, fontWeight: "600" },
});
