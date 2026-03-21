import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Card, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VehicleControlsScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Card>
        <Card.Title title="Điểm dịch vụ" subtitle="Xe đang đỗ" />
        <Card.Content>
          <View style={styles.heroRow}>
            <View style={styles.carBoxLight}>
              <Text style={{ color: "#6b7280" }}>Hình xe (demo)</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <RowItem
                label="Điều khiển"
                onPress={() => Alert.alert("Điều khiển")}
              />
              <Divider />
              <RowItem
                label="Điều hoà"
                onPress={() => Alert.alert("Điều hoà")}
              />
              <Divider />
              <RowItem
                label="Vị trí"
                onPress={() => Alert.alert("Vị trí hiện tại")}
              />
              <Divider />
              <RowItem
                label="Triệu hồi"
                onPress={() => Alert.alert("Triệu hồi")}
              />
              <Divider />
              <RowItem label="Bảo mật" onPress={() => Alert.alert("Bảo mật")} />
              <Divider />
              <RowItem
                label="Nâng cấp"
                onPress={() => Alert.alert("Nâng cấp")}
              />
              <Divider />
              <RowItem label="Dịch vụ" onPress={() => Alert.alert("Dịch vụ")} />
            </View>
          </View>

          <View style={{ height: 12 }} />
          <View style={styles.quickRow}>
            <Pressable
              style={styles.lightBtn}
              onPress={() => Alert.alert("Đèn nháy")}
            >
              <Text style={styles.lightBtnText}>Đèn nháy</Text>
            </Pressable>
            <Pressable
              style={styles.lightBtn}
              onPress={() => Alert.alert("Còi")}
            >
              <Text style={styles.lightBtnText}>Còi</Text>
            </Pressable>
            <Pressable
              style={styles.lightBtn}
              onPress={() => Alert.alert("Khởi động")}
            >
              <Text style={styles.lightBtnText}>Khởi động</Text>
            </Pressable>
            <Pressable
              style={[styles.lightBtn, { borderColor: "#22c55e" }]}
              onPress={() => Alert.alert("Tìm điểm dịch vụ gần đây")}
            >
              <Text style={[styles.lightBtnText, { color: "#16a34a" }]}>
                Điểm dịch vụ gần đây
              </Text>
            </Pressable>
          </View>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#fff" },
  heroRow: { flexDirection: "row" },
  carBoxLight: {
    width: 140,
    height: 140,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quickRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  lightBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  lightBtnText: { color: "#111827" },
});

function RowItem({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ paddingVertical: 12 }}>
      <Text style={{ fontSize: 16, color: "#111827" }}>{label}</Text>
    </Pressable>
  );
}
