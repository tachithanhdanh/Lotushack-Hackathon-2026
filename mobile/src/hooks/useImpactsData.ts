import { useState } from 'react';
import {
  Period,
  ImpactSummary,
  DailyBarData,
  Achievement,
  CommunityData,
  MOCK_SUMMARIES,
  MOCK_CHART_DATA,
  MOCK_ACHIEVEMENTS,
  MOCK_COMMUNITY,
} from '../constants/mock_impacts';

export type { Period, ImpactSummary, DailyBarData, Achievement, CommunityData };

export function useImpactsData() {
  const [period, setPeriod] = useState<Period>('week');

  return {
    period,
    setPeriod,
    summary: MOCK_SUMMARIES[period],
    chartData: MOCK_CHART_DATA[period],
    achievements: MOCK_ACHIEVEMENTS,
    community: MOCK_COMMUNITY,
  };
}
