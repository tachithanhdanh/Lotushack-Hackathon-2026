import React from "react";
import { Button, Card, ProgressBar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

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
      <Card style={{ backgroundColor: colors.surface }}>
        <Card.Title
          title={`Hôm nay: ${pct}%`}
          subtitle={`Điểm: ${basePts}+${streakBonus}`}
        />
        <Card.Content>
          <Text style={styles.subtitle}>
            Hoàn thành 3 nhiệm vụ để lấp vòng.
          </Text>
          <View style={{ height: 8 }} />
          <ProgressBar
            progress={pct / 100}
            color={pct === 100 ? colors.success : colors.primary}
            style={{
              height: 10,
              borderRadius: 8,
              backgroundColor: colors.card,
            }}
          />
          <View style={{ height: 12 }} />
          <Button
            mode={a ? "contained" : "outlined"}
            buttonColor={a ? colors.success : undefined}
            onPress={() => setA((v) => !v)}
          >
            {a ? "✓ " : ""}ETC qua trạm (auto)
          </Button>
          <View style={{ height: 8 }} />
          <Button
            mode={b ? "contained" : "outlined"}
            buttonColor={b ? colors.success : undefined}
            onPress={() => setB((v) => !v)}
          >
            {b ? "✓ " : ""}Khởi hành trước 7:30 AM
          </Button>
          <View style={{ height: 8 }} />
          <Button
            mode={c ? "contained" : "outlined"}
            buttonColor={c ? colors.success : undefined}
            onPress={() => setC((v) => !v)}
          >
            {c ? "✓ " : ""}Đỗ xe (payment API)
          </Button>
          <View style={{ height: 16 }} />
          <Text style={{ color: colors.textMuted }}>
            Quy tắc: ≥70% trước 23:59 sẽ tăng streak. Đạt 100% nhận +10 điểm
            thưởng.
          </Text>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 16 },
  subtitle: { fontSize: 16, color: colors.textMuted },
});
