import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useImpactsData } from '../hooks/useImpactsData';
import type { Period } from '../hooks/useImpactsData';
import Co2BarChart from '../components/Co2BarChart';
import AchievementCard from '../components/AchievementCard';

const COMMUNITY_BG = '#0B5E38';

/**
 * Content-only component — no SafeAreaView, no BottomTabBar.
 * Rendered inside MainTabScreen which owns the shell and tab bar.
 */
export function ImpactsContent() {
  const { period, setPeriod, summary, chartData, achievements, community } =
    useImpactsData();

  return (
    <View style={styles.root}>
      {/* ── Fixed header ───────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Tác động xanh của bạn</Text>
        <PeriodToggle active={period} onChange={setPeriod} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Section 1: Summary card ─────────────────── */}
        <View style={styles.card}>
          <Text style={styles.co2Big}>{summary.co2Kg.toFixed(2)}</Text>
          <Text style={styles.co2Sub}>kg CO₂ đã giảm tuần này</Text>

          <View style={styles.treePill}>
            <MaterialCommunityIcons
              name="tree-outline"
              size={16}
              color={Colors.textSecondary}
            />
            <Text style={styles.treePillText}>
              {'  '}= <Text style={styles.treePillBold}>{summary.treeEquivalent} cây xanh</Text>
              {' '}hấp thụ trong 1 ngày
            </Text>
          </View>

          <View style={styles.savingRow}>
            <MaterialCommunityIcons
              name="arrow-down"
              size={14}
              color={Colors.primary}
            />
            <Text style={styles.savingText}>
              {'  '}So với không dùng ETC: tiết kiệm thêm{' '}
              <Text style={styles.savingBold}>{summary.etcSavingKg.toFixed(2)} kg</Text>
            </Text>
          </View>
        </View>

        {/* ── Section 2: Daily CO₂ chart ────────────── */}
        <Text style={styles.sectionTitle}>CO₂ theo ngày</Text>
        <View style={styles.card}>
          <Co2BarChart data={chartData} />
          <View style={styles.divider} />
          <Text style={styles.avgText}>
            Trung bình:{' '}
            <Text style={styles.avgBold}>{summary.avgKgPerDay.toFixed(2)} kg/ngày</Text>
          </Text>
        </View>

        {/* ── Section 3: Achievements ─────────────── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Thành tích</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Xem tất cả {'>'}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.achievementsScroll}
        >
          {achievements.map((a) => (
            <AchievementCard key={a.id} item={a} />
          ))}
        </ScrollView>

        {/* ── Section 4: Community contribution ────── */}
        <Text style={styles.sectionTitle}>Đóng góp cộng đồng</Text>
        <View style={[styles.communityCard, { backgroundColor: COMMUNITY_BG }]}>
          <View style={styles.communityLabelRow}>
            <MaterialCommunityIcons
              name="account-group-outline"
              size={16}
              color="rgba(255,255,255,0.8)"
            />
            <Text style={styles.communityLabel}>
              {'  '}Cộng đồng Green Points tuần này
            </Text>
          </View>

          <Text style={styles.communityBig}>
            {community.totalCo2Kg.toLocaleString()} kg
          </Text>
          <Text style={styles.communitySub}>
            CO₂ giảm từ {community.totalTransactions.toLocaleString()} giao dịch ETC
          </Text>

          <View style={styles.goalRow}>
            <Text style={styles.goalLabel}>
              Mục tiêu tháng: {(community.monthlyGoalKg / 1000).toFixed(0)},000 kg
            </Text>
            <Text style={styles.goalPct}>
              {(community.monthlyProgressPct * 100).toFixed(1)}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${community.monthlyProgressPct * 100}%` },
              ]}
            />
          </View>

          <View style={styles.communityDivider} />

          <Text style={styles.userContrib}>
            Đóng góp của bạn:{' '}
            <Text style={styles.userContribBold}>
              {(community.userContributionPct * 100).toFixed(2)}% tổng cộng đồng
            </Text>
          </Text>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}

// ── Period toggle ─────────────────────────────────────────────────────────────

const PERIOD_LABELS: { key: Period; label: string }[] = [
  { key: 'week',  label: 'Tuần' },
  { key: 'month', label: 'Tháng' },
  { key: 'year',  label: 'Năm' },
];

function PeriodToggle({
  active,
  onChange,
}: {
  active: Period;
  onChange: (p: Period) => void;
}) {
  return (
    <View style={styles.toggleWrap}>
      {PERIOD_LABELS.map(({ key, label }) => (
        <TouchableOpacity
          key={key}
          style={[styles.toggleBtn, active === key && styles.toggleBtnActive]}
          onPress={() => onChange(key)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.toggleText,
              active === key && styles.toggleTextActive,
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: Colors.background,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    flexShrink: 1,
    marginRight: 8,
  },

  // Period toggle
  toggleWrap: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 20,
    padding: 3,
  },
  toggleBtn: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 17,
  },
  toggleBtnActive: { backgroundColor: Colors.primary },
  toggleText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: Colors.textOnPrimary,
    fontWeight: '700',
  },

  // Cards
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  // Summary card
  co2Big: {
    fontSize: 56,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
    letterSpacing: -1,
  },
  co2Sub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 14,
  },
  treePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  treePillText: { fontSize: 13, color: Colors.textSecondary },
  treePillBold: { fontWeight: '700', color: Colors.textPrimary },
  savingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingText: { fontSize: 13, color: Colors.textSecondary },
  savingBold: { fontWeight: '700', color: Colors.primary },

  // Chart card
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  avgText: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center' },
  avgBold: { fontWeight: '700', color: Colors.textPrimary },

  // Section headings
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  seeAll: { fontSize: 14, color: Colors.primary, fontWeight: '500' },

  // Achievements scroll
  achievementsScroll: {
    paddingLeft: 16,
    paddingRight: 4,
    marginBottom: 20,
  },

  // Community card
  communityCard: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
  },
  communityLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  communityLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  communityBig: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  communitySub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 16,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  goalLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  goalPct: { fontSize: 12, color: '#FFFFFF', fontWeight: '700' },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: '#FFFFFF' },
  communityDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 14,
  },
  userContrib: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  userContribBold: { fontWeight: '700', color: '#FFFFFF' },

  bottomPad: { height: 16 },
});
