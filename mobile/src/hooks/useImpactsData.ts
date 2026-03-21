import { useState, useCallback, useEffect } from 'react';
import {
  ensureSeeded,
  getImpactSummary,
  getChartData,
  getAllAchievements,
  getCommunityStats,
} from '../data/service';
import type { Achievement, CommunityStats } from '../data/types';

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

export type { Achievement, CommunityStats };

interface ImpactsState {
  summary: ImpactSummary;
  chartData: DailyBarData[];
  achievements: Achievement[];
  community: CommunityStats;
}

const EMPTY_SUMMARY: ImpactSummary = {
  co2Kg: 0,
  treeEquivalent: 0,
  etcSavingKg: 0,
  avgKgPerDay: 0,
};

const EMPTY_COMMUNITY: CommunityStats = {
  totalCo2Kg: 0,
  totalTransactions: 0,
  monthlyGoalKg: 1,
  monthlyProgressPct: 0,
  userContributionPct: 0,
  lastUpdated: '',
};

export function useImpactsData() {
  const [period, setPeriod] = useState<Period>('week');
  const [state, setState] = useState<ImpactsState | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p: Period) => {
    setLoading(true);
    await ensureSeeded();
    const [summary, chartData, achievements, community] = await Promise.all([
      getImpactSummary(p),
      getChartData(p),
      getAllAchievements(),
      getCommunityStats(),
    ]);
    setState({
      summary,
      chartData,
      achievements,
      community: community ?? EMPTY_COMMUNITY,
    });
    setLoading(false);
  }, []);

  useEffect(() => { load(period); }, [period, load]);

  const fallback: ImpactsState = {
    summary: EMPTY_SUMMARY,
    chartData: [],
    achievements: [],
    community: EMPTY_COMMUNITY,
  };

  const s = state ?? fallback;

  return {
    period,
    setPeriod,
    loading,
    summary: s.summary,
    chartData: s.chartData,
    achievements: s.achievements,
    community: s.community,
  };
}
