export type Period = 'week' | 'month' | 'year';

export interface ImpactSummary {
  co2Kg: number;
  treeEquivalent: number;
  etcSavingKg: number;
  avgKgPerDay: number;
}

export interface DailyBarData {
  day: string;
  co2Kg: number;
  isToday: boolean;
}

export interface Achievement {
  id: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  title: string;
  subtitle: string;
  achieved: boolean;
  progress?: number;
  progressLabel?: string;
}

export interface CommunityData {
  totalCo2Kg: number;
  totalTransactions: number;
  monthlyGoalKg: number;
  monthlyProgressPct: number;
  userContributionPct: number;
}

export const MOCK_SUMMARIES: Record<Period, ImpactSummary> = {
  week: { co2Kg: 3.24, treeEquivalent: 32, etcSavingKg: 0.42, avgKgPerDay: 0.46 },
  month: { co2Kg: 13.8, treeEquivalent: 138, etcSavingKg: 1.8, avgKgPerDay: 0.46 },
  year: { co2Kg: 168.5, treeEquivalent: 1685, etcSavingKg: 21.6, avgKgPerDay: 0.46 },
};

export const MOCK_CHART_DATA: Record<Period, DailyBarData[]> = {
  week: [
    { day: 'T2', co2Kg: 0.52, isToday: false },
    { day: 'T3', co2Kg: 0.44, isToday: false },
    { day: 'T4', co2Kg: 0.68, isToday: false },
    { day: 'T5', co2Kg: 0.55, isToday: false },
    { day: 'T6', co2Kg: 0.35, isToday: false },
    { day: 'T7', co2Kg: 0.30, isToday: false },
    { day: 'CN', co2Kg: 0.40, isToday: true },
  ],
  month: [
    { day: 'T1', co2Kg: 3.24, isToday: false },
    { day: 'T2', co2Kg: 2.80, isToday: false },
    { day: 'T3', co2Kg: 3.60, isToday: false },
    { day: 'T4', co2Kg: 4.16, isToday: true },
  ],
  year: [
    { day: 'T1', co2Kg: 12.0, isToday: false },
    { day: 'T2', co2Kg: 11.5, isToday: false },
    { day: 'T3', co2Kg: 14.2, isToday: false },
    { day: 'T4', co2Kg: 15.0, isToday: false },
    { day: 'T5', co2Kg: 13.8, isToday: false },
    { day: 'T6', co2Kg: 16.5, isToday: false },
    { day: 'T7', co2Kg: 18.2, isToday: false },
    { day: 'T8', co2Kg: 14.0, isToday: false },
    { day: 'T9', co2Kg: 12.5, isToday: false },
    { day: 'T10', co2Kg: 13.0, isToday: false },
    { day: 'T11', co2Kg: 15.8, isToday: false },
    { day: 'T12', co2Kg: 12.0, isToday: true },
  ],
};

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    icon: 'fire',
    iconBgColor: '#FFF3E0',
    iconColor: '#FF6B35',
    title: 'Streak 7 ngày',
    subtitle: 'Hoàn thành ring 7 ngày liên tiếp',
    achieved: true,
  },
  {
    id: '2',
    icon: 'tree',
    iconBgColor: '#F0F7F0',
    iconColor: '#4CAF50',
    title: 'Người trồng cây',
    subtitle: 'Giảm 10 kg CO₂ tích lũy',
    achieved: false,
    progress: 0.324,
    progressLabel: '3.24 / 10 kg',
  },
  {
    id: '3',
    icon: 'lightning-bolt',
    iconBgColor: '#FFFDE7',
    iconColor: '#FFC107',
    title: 'ETC Master',
    subtitle: 'Dùng ETC 50 lần',
    achieved: false,
    progress: 0.6,
    progressLabel: '30 / 50 lần',
  },
];

export const MOCK_COMMUNITY: CommunityData = {
  totalCo2Kg: 47200,
  totalTransactions: 23400,
  monthlyGoalKg: 200000,
  monthlyProgressPct: 0.236,
  userContributionPct: 0.0007,
};
