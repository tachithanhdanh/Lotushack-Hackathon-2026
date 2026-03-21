import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import type { Achievement } from '../constants/mock_impacts';

interface AchievementCardProps {
  item: Achievement;
}

export default function AchievementCard({ item }: AchievementCardProps) {
  return (
    <View style={styles.card}>
      {/* Icon */}
      <View style={[styles.iconCircle, { backgroundColor: item.iconBgColor }]}>
        <MaterialCommunityIcons
          name={item.icon as any}
          size={24}
          color={item.iconColor}
        />
      </View>

      {/* Title + subtitle */}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle} numberOfLines={2}>
        {item.subtitle}
      </Text>

      {/* Achieved badge */}
      {item.achieved && (
        <View style={styles.achievedBadge}>
          <Text style={styles.achievedText}>Đã đạt</Text>
        </View>
      )}

      {/* Progress bar */}
      {!item.achieved && item.progress !== undefined && (
        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={styles.progressStatus}>Tiến độ</Text>
            <Text style={styles.progressLabel}>{item.progressLabel}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${item.progress * 100}%` }]}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
    marginBottom: 10,
  },
  achievedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  achievedText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  progressSection: {
    marginTop: 'auto' as any,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressStatus: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  progressLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.card,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
});
