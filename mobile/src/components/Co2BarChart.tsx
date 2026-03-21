import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';
import type { DailyBarData } from '../constants/mock_impacts';

interface Co2BarChartProps {
  data: DailyBarData[];
}

const CHART_H = 130;
const TODAY_COLOR = '#0B5E38';

function fmtY(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

export default function Co2BarChart({ data }: Co2BarChartProps) {
  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.co2Kg)) : 1;

  return (
    <View>
      {/* "Hôm nay" top-right label */}
      <View style={styles.todayLabelRow}>
        <Text style={styles.todayLabel}>Hôm nay</Text>
      </View>

      <View style={styles.row}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={styles.yLabel}>{fmtY(maxValue)}</Text>
          <Text style={styles.yLabel}>{fmtY(maxValue / 2)}</Text>
          <Text style={styles.yLabel}>0</Text>
        </View>

        {/* Chart body — overflow:hidden clips any rounding edge-cases */}
        <View style={styles.chartBody}>
          {/* Gridlines */}
          <View style={[styles.gridLine, { top: 0 }]} />
          <View style={[styles.gridLine, { top: CHART_H / 2 - 0.5 }]} />
          <View style={[styles.gridLine, { top: CHART_H - 1 }]} />

          {/* Bars */}
          <View style={styles.barsRow}>
            {data.map((item) => {
              const barH = Math.max(4, (item.co2Kg / maxValue) * CHART_H);
              const barColor = item.isToday ? TODAY_COLOR : Colors.primary;
              return (
                <View key={item.day} style={styles.barCol}>
                  <View
                    style={[
                      styles.bar,
                      { height: barH, backgroundColor: barColor },
                    ]}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Day labels */}
      <View style={styles.dayLabelsRow}>
        <View style={styles.yAxisSpacer} />
        {data.map((item) => (
          <View key={item.day} style={styles.dayLabelCol}>
            <Text
              style={[styles.dayLabel, item.isToday && styles.dayLabelToday]}
              numberOfLines={1}
            >
              {item.day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  todayLabelRow: {
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  todayLabel: {
    fontSize: 11,
    color: TODAY_COLOR,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    height: CHART_H,
  },
  yAxis: {
    width: 32,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 6,
  },
  yLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  chartBody: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
  barsRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '65%',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  dayLabelsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  yAxisSpacer: {
    width: 32,
  },
  dayLabelCol: {
    flex: 1,
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  dayLabelToday: {
    color: TODAY_COLOR,
    fontWeight: '700',
  },
});
