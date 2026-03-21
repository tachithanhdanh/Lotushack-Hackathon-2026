import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Car360Viewer from "../components/Car360Viewer";

// Public demo images from Scaleflex js-cloudimage-360-view (36 frames)
const CAR_360_FRAMES = Array.from({ length: 64 }, (_, i) =>
  `https://cdn.honda.com.vn/automobile-versions/Image360/October2024/1729591947/${i}.png`
);

export default function VehicleControlsScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.viewerCard}>
          <Card.Title title="Xem xe 360°" subtitle="Vuot trai / phai de xoay" />
          <Card.Content>
            <Car360Viewer images={CAR_360_FRAMES} />
          </Card.Content>
        </Card>

        <View style={styles.spacer} />

        <Card>
          <Card.Title title="Diem dich vu" subtitle="Xe dang do" />
          <Card.Content>
            <RowItem
              label="Dieu khien"
              onPress={() => Alert.alert("Dieu khien")}
            />
            <Divider />
            <RowItem
              label="Dieu hoa"
              onPress={() => Alert.alert("Dieu hoa")}
            />
            <Divider />
            <RowItem
              label="Vi tri"
              onPress={() => Alert.alert("Vi tri hien tai")}
            />
            <Divider />
            <RowItem
              label="Trieu hoi"
              onPress={() => Alert.alert("Trieu hoi")}
            />
            <Divider />
            <RowItem label="Bao mat" onPress={() => Alert.alert("Bao mat")} />
            <Divider />
            <RowItem
              label="Nang cap"
              onPress={() => Alert.alert("Nang cap")}
            />
            <Divider />
            <RowItem label="Dich vu" onPress={() => Alert.alert("Dich vu")} />

            <View style={styles.spacer} />

            <View style={styles.quickRow}>
              <Pressable
                style={styles.lightBtn}
                onPress={() => Alert.alert("Den nhay")}
              >
                <Text style={styles.lightBtnText}>Den nhay</Text>
              </Pressable>
              <Pressable
                style={styles.lightBtn}
                onPress={() => Alert.alert("Coi")}
              >
                <Text style={styles.lightBtnText}>Coi</Text>
              </Pressable>
              <Pressable
                style={styles.lightBtn}
                onPress={() => Alert.alert("Khoi dong")}
              >
                <Text style={styles.lightBtnText}>Khoi dong</Text>
              </Pressable>
              <Pressable
                style={[styles.lightBtn, styles.lightBtnGreen]}
                onPress={() => Alert.alert("Tim diem dich vu gan day")}
              >
                <Text style={[styles.lightBtnText, styles.lightBtnTextGreen]}>
                  Diem dich vu gan day
                </Text>
              </Pressable>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#fff" },
  viewerCard: { marginBottom: 0 },
  spacer: { height: 12 },
  quickRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 12, marginHorizontal: -4 },
  lightBtn: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    margin: 4,
  },
  lightBtnGreen: { borderColor: "#22c55e" },
  lightBtnText: { color: "#111827" },
  lightBtnTextGreen: { color: "#16a34a" },
});

function RowItem({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ paddingVertical: 12 }}>
      <Text style={{ fontSize: 16, color: "#111827" }}>{label}</Text>
    </Pressable>
  );
}
