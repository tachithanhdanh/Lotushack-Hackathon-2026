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
import type { Period, LeaderboardEntry } from '../hooks/useImpactsData';

const COMMUNITY_BG = '#1A7A4A';

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({
  name,
  color,
  size,
  ringColor,
  ringWidth = 3,
}: {
  name: string;
  color: string;
  size: number;
  ringColor?: string;
  ringWidth?: number;
}) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View
      style={[
        styles.avatarOuter,
        ringColor
          ? { width: size + ringWidth * 2, height: size + ringWidth * 2, borderRadius: (size + ringWidth * 2) / 2, borderWidth: ringWidth, borderColor: ringColor }
          : { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <View
        style={[
          styles.avatarInner,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        ]}
      >
        <Text style={[styles.avatarText, { fontSize: size * 0.34 }]}>{initials}</Text>
      </View>
    </View>
  );
}

// ── Podium top-3 ──────────────────────────────────────────────────────────────

const RING_COLORS: Record<number, string> = {
  1: '#F5C518',  // gold
  2: '#9E9E9E',  // silver
  3: '#E07C39',  // bronze
};

const BADGE_BG: Record<number, string> = {
  1: '#FFF8E1',
  2: '#F5F5F5',
  3: '#FFF3E0',
};

function PodiumEntry({
  entry,
  elevated,
}: {
  entry: LeaderboardEntry;
  elevated?: boolean;
}) {
  const ringColor = RING_COLORS[entry.rank];
  const badgeBg = BADGE_BG[entry.rank];
  const avatarSize = entry.rank === 1 ? 64 : 52;

  return (
    <View style={[styles.podiumEntry, elevated && styles.podiumEntryElevated]}>
      {/* Rank badge on avatar */}
      <View style={{ position: 'relative', alignItems: 'center' }}>
        <Avatar
          name={entry.name}
          color={entry.avatarColor}
          size={avatarSize}
          ringColor={ringColor}
          ringWidth={entry.rank === 1 ? 4 : 3}
        />
        <View style={[styles.rankBadge, { backgroundColor: ringColor }]}>
          <Text style={styles.rankBadgeText}>{entry.rank}</Text>
        </View>
      </View>

      <Text style={styles.podiumName} numberOfLines={1}>{entry.name}</Text>
      <Text style={[styles.podiumKg, entry.rank === 1 && styles.podiumKgGold]}>
        {entry.co2Kg} kg
      </Text>

      {/* Badge count card */}
      <View style={[styles.badgeCard, { backgroundColor: badgeBg }]}>
        <MaterialCommunityIcons name="medal-outline" size={16} color={ringColor} />
        <Text style={[styles.badgeCardText, { color: ringColor }]}>
          {entry.badgeCount} badges
        </Text>
      </View>
    </View>
  );
}

// ── List row (ranks 4+) ───────────────────────────────────────────────────────

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <View style={styles.lbRow}>
      <Text style={styles.lbRowRank}>{entry.rank}</Text>
      <Avatar name={entry.name} color={entry.avatarColor} size={36} />
      <Text style={styles.lbRowName}>{entry.name}</Text>
      <Text style={styles.lbRowKg}>{entry.co2Kg} kg</Text>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

/**
 * Content-only component — no SafeAreaView, no BottomTabBar.
 * Rendered inside MainTabScreen which owns the shell and tab bar.
 */
export function ImpactsContent() {
  const { period, setPeriod, summary, community, leaderboard } = useImpactsData();

  const top3 = leaderboard.filter((e) => e.rank <= 3);
  // Podium order: rank2 left, rank1 centre, rank3 right
  const podiumOrder = [
    top3.find((e) => e.rank === 2),
    top3.find((e) => e.rank === 1),
    top3.find((e) => e.rank === 3),
  ].filter(Boolean) as LeaderboardEntry[];

  const rest = leaderboard.filter((e) => e.rank > 3);
  const totalCount = 355; // community total — replace with real count when available

  return (
    <View style={styles.root}>
      {/* ── Header ─────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Impacts</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Period toggle ───────────────────────────── */}
        <View style={styles.toggleCard}>
          <PeriodToggle active={period} onChange={setPeriod} />
        </View>

        {/* ── Summary card ────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.co2Big}>{summary.co2Kg.toFixed(2)}</Text>
          <Text style={styles.co2Sub}>kg of CO₂ has been saved</Text>

          <View style={styles.treePill}>
            <MaterialCommunityIcons name="tree-outline" size={15} color={Colors.primary} />
            <Text style={styles.treePillText}>
              {'  '}= <Text style={styles.treePillBold}>{summary.treeEquivalent} trees</Text> absorb a day
            </Text>
          </View>
        </View>

        {/* ── Leaderboard ─────────────────────────────── */}
        <Text style={styles.sectionTitle}>Leaderboard</Text>
        <View style={styles.card}>
          {/* Podium */}
          <View style={styles.podiumRow}>
            {podiumOrder.map((entry) => (
              <PodiumEntry
                key={entry.id}
                entry={entry}
                elevated={entry.rank === 1}
              />
            ))}
          </View>

          {/* Divider */}
          {rest.length > 0 && <View style={styles.divider} />}

          {/* Ranks 4+ */}
          {rest.map((entry, idx) => (
            <View key={entry.id}>
              <LeaderboardRow entry={entry} />
              {idx < rest.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}

          {/* View all */}
          <TouchableOpacity style={styles.viewAllBtn} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All ({totalCount})</Text>
          </TouchableOpacity>
        </View>

        {/* ── Community ───────────────────────────────── */}
        <Text style={styles.sectionTitle}>Community</Text>
        <View style={[styles.communityCard, { backgroundColor: COMMUNITY_BG }]}>
          <View style={styles.communityLabelRow}>
            <MaterialCommunityIcons name="account-group-outline" size={15} color="rgba(255,255,255,0.85)" />
            <Text style={styles.communityLabel}>{'  '}Green Points Community</Text>
          </View>

          <Text style={styles.communityBig}>
            {community.totalCo2Kg.toLocaleString()} kg
          </Text>
          <Text style={styles.communitySub}>
            kg of CO₂ reduced from {community.totalTransactions.toLocaleString()} ETC transactions
          </Text>

          <View style={styles.goalRow}>
            <Text style={styles.goalLabel}>
              Goal: {(community.monthlyGoalKg / 1000).toFixed(0)},000 kg
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
            Your contribution:{' '}
            <Text style={styles.userContribBold}>
              {(community.userContributionPct * 100).toFixed(2)}% of the total.
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
  { key: 'day',   label: 'Day' },
  { key: 'week',  label: 'Week' },
  { key: 'month', label: 'Month' },
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
          <Text style={[styles.toggleText, active === key && styles.toggleTextActive]}>
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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
    backgroundColor: Colors.background,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  // Period toggle
  toggleCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  toggleWrap: {
    flexDirection: 'row',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: Colors.primary },
  toggleText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Generic card
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
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 14,
  },
  treePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#EBF7EF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  treePillText: { fontSize: 13, color: Colors.textSecondary },
  treePillBold: { fontWeight: '700', color: Colors.textPrimary },

  // Section headings
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginHorizontal: 16,
    marginBottom: 10,
  },

  // Dividers
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginVertical: 14,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: 56,
  },

  // Podium
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingTop: 8,
    paddingBottom: 4,
  },
  podiumEntry: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  podiumEntryElevated: {
    marginBottom: 16,
  },
  podiumName: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  podiumKg: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  podiumKgGold: {
    color: '#D4A017',
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeCardText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },

  // Avatar
  avatarOuter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  rankBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  rankBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Leaderboard list rows
  lbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  lbRowRank: {
    width: 22,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMuted,
    textAlign: 'center',
    marginRight: 10,
  },
  lbRowName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 10,
  },
  lbRowKg: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  // View all
  viewAllBtn: {
    marginTop: 14,
    alignItems: 'center',
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
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
  communityLabel: { fontSize: 13, color: 'rgba(255,255,255,0.85)' },
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
  goalLabel: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
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
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginVertical: 14,
  },
  userContrib: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  userContribBold: { fontWeight: '700', color: '#FFFFFF' },

  bottomPad: { height: 24 },
});
