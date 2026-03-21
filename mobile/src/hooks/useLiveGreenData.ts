import { useState, useCallback, useEffect } from 'react';
import { ensureSeeded, getCurrentUser, getTodayRing, toggleRingTask } from '../data/service';
import type { User, DailyRing } from '../data/types';

// Re-export types screens depend on (backwards-compatible)
export type { VehicleStatus } from '../data/types';

export interface VehicleInfo {
  name: string;
  status: 'parking' | 'driving' | 'charging';
  batteryPercent?: number;
}

export interface DailyStats {
  missionProgress: number;
  co2Kg: number;
  greenPoints: number;
}

export interface Mission {
  id: string;
  label: string;
  pts: number;
  sub?: string;
  done: boolean;
}

export interface LiveGreenData {
  vehicle: VehicleInfo;
  stats: DailyStats;
  missions: Mission[];
}

function toVehicleInfo(user: User): VehicleInfo {
  return {
    name: user.vehicleName,
    status: 'parking',
    batteryPercent: user.batteryPercent,
  };
}

function toStats(user: User, ring: DailyRing | null): DailyStats {
  const doneTasks = ring?.tasks.filter((t) => t.done) ?? [];
  const co2Kg = doneTasks.length * 0.2; // rough per-task estimate
  return {
    missionProgress: ring?.progressPct ?? 0,
    co2Kg,
    greenPoints: user.greenPoints,
  };
}

function toMissions(ring: DailyRing | null): Mission[] {
  return (ring?.tasks ?? []).map((t) => ({
    id: t.id,
    label: t.label,
    pts: t.pts,
    sub: t.sub,
    done: t.done,
  }));
}

export function useLiveGreenData() {
  const [data, setData] = useState<LiveGreenData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    await ensureSeeded();
    const [user, ring] = await Promise.all([getCurrentUser(), getTodayRing()]);
    setData({
      vehicle: toVehicleInfo(user),
      stats: toStats(user, ring),
      missions: toMissions(ring),
    });
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const refresh = useCallback(async () => { await load(); }, [load]);

  const toggleMission = useCallback(async (id: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const updatedRing = await toggleRingTask(today, id);
    const user = await getCurrentUser();
    setData({
      vehicle: toVehicleInfo(user),
      stats: toStats(user, updatedRing),
      missions: toMissions(updatedRing),
    });
  }, []);

  // Provide a fallback empty state while loading so callers don't need null checks
  const fallback: LiveGreenData = {
    vehicle: { name: '…', status: 'parking' },
    stats: { missionProgress: 0, co2Kg: 0, greenPoints: 0 },
    missions: [],
  };

  return { data: data ?? fallback, loading, refresh, toggleMission };
}
