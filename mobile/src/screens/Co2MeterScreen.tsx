import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Card, ProgressBar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

export default function Co2MeterScreen() {
  const [running, setRunning] = React.useState(false);
  const [km, setKm] = React.useState(0);
  const [co2, setCo2] = React.useState(0);
  const [speed, setSpeed] = React.useState(0);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setKm((k) => +(k + 0.1).toFixed(1));
      // ví dụ hệ số phát thải 0.07 kg/km
      setCo2((c) => +(c + 0.007).toFixed(3));
      setSpeed((s) => (s >= 40 ? 18 : s + 2));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <SafeAreaView style={styles.screen}>
      <Card style={{ backgroundColor: colors.surface }}>
        <Card.Title title="CO₂ Meter" subtitle="Theo dõi hành trình (demo)" />
        <Card.Content>
          <View style={styles.row}>
            <Text style={styles.label}>Tốc độ:</Text>
            <Text>{speed} km/h</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Quãng đường:</Text>
            <Text>{km} km</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>CO₂ ước tính:</Text>
            <Text>{co2} kg</Text>
          </View>
          <View style={{ height: 8 }} />
          <ProgressBar
            progress={Math.min(speed / 60, 1)}
            color={colors.primary}
            style={{ height: 6, borderRadius: 6, backgroundColor: colors.card }}
          />
          <Text style={{ color: colors.textMuted, marginTop: 4 }}>
            Tốc độ / 60kmh
          </Text>
          <View style={{ height: 12 }} />
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Button
              mode={running ? "contained" : "outlined"}
              onPress={() => setRunning((v) => !v)}
            >
              {running ? "Dừng ghi" : "Bắt đầu"}
            </Button>
            <Button
              mode="text"
              onPress={() => {
                setKm(0);
                setCo2(0);
                setSpeed(0);
              }}
            >
              Reset
            </Button>
          </View>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  label: { color: colors.textMuted },
});
