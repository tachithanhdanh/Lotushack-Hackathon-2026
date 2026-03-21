import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Card, TextInput, Chip } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors as colors } from "../theme/colors";


function RouteCard({ title, time, co2, points, onSelect }: any) {
  return (
    <Card style={{ marginTop: 8, backgroundColor: colors.surface }}>
      <Card.Content>
        <Text style={{ fontWeight: "600" }}>{title}</Text>
        <Text style={{ color: colors.textMuted }}>
          {time} • {co2} kg CO₂ • {points} GP
        </Text>
        <View style={{ height: 8 }} />
        <Button mode="outlined" onPress={onSelect}>
          Chọn tuyến
        </Button>
      </Card.Content>
    </Card>
  );
}

export default function RouteSuggestionScreen({ navigation }: any) {
  const [from, setFrom] = React.useState("Nhà");
  const [to, setTo] = React.useState("Cơ quan");
  const [show, setShow] = React.useState(false);

  return (
    <SafeAreaView style={styles.screen}>
      <Card style={{ backgroundColor: colors.surface }}>
        <Card.Title title="Tìm tuyến đường xanh" />
        <Card.Content>
          <TextInput
            mode="outlined"
            label="Điểm đi"
            value={from}
            onChangeText={setFrom}
          />
          <View style={{ height: 8 }} />
          <TextInput
            mode="outlined"
            label="Điểm đến"
            value={to}
            onChangeText={setTo}
          />
          <View style={{ height: 8 }} />
          <Button mode="contained" onPress={() => setShow(true)}>
            Tìm tuyến
          </Button>
        </Card.Content>
      </Card>

      {show && (
        <View style={{ marginTop: 12 }}>
          <RouteCard
            title="Nhanh nhất"
            time="22 phút"
            co2="0.42"
            points={0}
            onSelect={() => navigation.navigate("Co2Meter")}
          />
          <Card
            style={{
              marginTop: 8,
              borderColor: colors.success,
              borderWidth: 1,
              backgroundColor: colors.surface,
            }}
          >
            <Card.Content>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: "700" }}>Cân bằng</Text>
                <Chip
                  compact
                  style={{ backgroundColor: colors.success }}
                  textStyle={{ color: colors.surface }}
                >
                  Khuyên dùng
                </Chip>
              </View>
              <Text style={{ color: colors.textMuted }}>
                26 phút • 0.38 kg CO₂ • 8 GP
              </Text>
              <View style={{ height: 8 }} />
              <Button
                mode="contained"
                buttonColor={colors.success}
                onPress={() => navigation.navigate("Co2Meter")}
              >
                Chọn tuyến
              </Button>
            </Card.Content>
          </Card>
          <RouteCard
            title="Xanh nhất"
            time="31 phút"
            co2="0.31"
            points={15}
            onSelect={() => navigation.navigate("Co2Meter")}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 16 },
});
