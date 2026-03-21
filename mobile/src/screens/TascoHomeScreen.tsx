import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Card, Button, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ServiceGridItem from "../components/ServiceGridItem";

export default function TascoHomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Card>
          <Card.Content>
            <Image
              source={require("../../assets/icon.png")}
              style={{ width: "100%", height: 120, resizeMode: "contain" }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 12,
              }}
            >
              <View>
                <Text style={{ fontWeight: "600" }}>Số dư ví khả dụng</Text>
                <Text style={{ color: "#374151", marginTop: 2 }}>*******</Text>
              </View>
              <Button mode="contained" onPress={() => {}}>
                + Nạp tiền
              </Button>
            </View>
          </Card.Content>
        </Card>

        <View style={{ height: 12 }} />

        <Card>
          <Card.Title title="Đề xuất" />
          <Card.Content>
            <View style={styles.gridRow}>
              <ServiceGridItem icon="shield-check" label="Bảo hiểm" />
              <ServiceGridItem icon="car-hatchback" label="Mua xe" />
              <ServiceGridItem
                icon="calendar-check"
                label="Đặt lịch sửa chữa"
              />
              <ServiceGridItem icon="gas-station" label="Trạm xăng" />
            </View>
          </Card.Content>
        </Card>

        <View style={{ height: 12 }} />

        <Card>
          <Card.Title title="Tiện ích" />
          <Card.Content>
            <View style={styles.gridRow}>
              <ServiceGridItem
                icon="credit-card"
                label="Tài khoản giao thông"
              />
              <ServiceGridItem
                icon="ticket-confirmation"
                label="Vé tháng qua"
              />
              <ServiceGridItem icon="history" label="Lịch sử giao dịch" />
              <ServiceGridItem icon="car-cog" label="Quản lý xe" />
              <ServiceGridItem
                icon="map-marker"
                label="Điểm dịch vụ"
                onPress={() => navigation.navigate("VehicleControls")}
              />
              <ServiceGridItem icon="security" label="Bảo hiểm" />
              <ServiceGridItem icon="car-arrow-right" label="Nhận xe từ" />
              <ServiceGridItem icon="dots-horizontal" label="Khác" />
            </View>
          </Card.Content>
        </Card>

        <View style={{ height: 12 }} />

        <Card>
          <Card.Content>
            <Pressable onPress={() => navigation.navigate("LiveGreenRing")}>
              <Text style={{ fontWeight: "600" }}>Live Green Ring</Text>
              <Text style={{ color: "#6b7280" }}>
                Hoàn thành nhiệm vụ xanh hôm nay
              </Text>
            </Pressable>
          </Card.Content>
        </Card>

        <Divider style={{ marginTop: 16 }} />
        <Text style={{ textAlign: "center", color: "#9ca3af", marginTop: 8 }}>
          © Tasco VETC — demo
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
