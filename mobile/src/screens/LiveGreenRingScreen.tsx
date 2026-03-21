import React from "react";
import { Button, Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";

export default function LiveGreenRingScreen() {
  const [a, setA] = React.useState(false);
  const [b, setB] = React.useState(false);
  const [c, setC] = React.useState(false);
  const tasksDone = [a, b, c].filter(Boolean).length;
  const pct = Math.round((tasksDone / 3) * 100);
  const basePts = tasksDone * 5;
  const streakBonus = pct === 100 ? 10 : 0;
  return (
    <SafeAreaView style={styles.screen}>
      <Card>
        <Card.Title
          title={`Hôm nay: ${pct}%`}
          subtitle={`Điểm: ${basePts}+${streakBonus}`}
        />
        <Card.Content>
          <Text style={styles.subtitle}>
            Hoàn thành 3 nhiệm vụ để lấp vòng.
          </Text>
          <View style={{ height: 12 }} />
          <Button
            mode={a ? "contained" : "outlined"}
            onPress={() => setA((v) => !v)}
          >
            {a ? "✓ " : ""}ETC qua trạm (auto)
          </Button>
          <View style={{ height: 8 }} />
          <Button
            mode={b ? "contained" : "outlined"}
            onPress={() => setB((v) => !v)}
          >
            {b ? "✓ " : ""}Khởi hành trước 7:30 AM
          </Button>
          <View style={{ height: 8 }} />
          <Button
            mode={c ? "contained" : "outlined"}
            onPress={() => setC((v) => !v)}
          >
            {c ? "✓ " : ""}Đỗ xe (payment API)
          </Button>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", padding: 16 },
  subtitle: { fontSize: 16, color: "#555" },
});
