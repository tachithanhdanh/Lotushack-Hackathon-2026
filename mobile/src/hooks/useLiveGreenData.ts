import { useState, useCallback } from "react";
import {
  MOCK_VEHICLE,
  MOCK_STATS,
  MOCK_MISSIONS,
} from "../constants/mock_live_green";

// ── Shared data types ─────────────────────────────────────────────────────────

export interface VehicleInfo {
  name: string;
  status: "parking" | "driving" | "charging";
  batteryPercent?: number;
}

export interface DailyStats {
  /** 0–1 float, e.g. 0.5 = 50% */
  missionProgress: number;
  co2Kg: number;
  greenPoints: number;
}

export interface Mission {
  id: string;
  label: string;
  pts: number;
  /** Progress sub-label, e.g. "0/2" */
  sub?: string;
  done: boolean;
}

export interface LiveGreenData {
  vehicle: VehicleInfo;
  stats: DailyStats;
  missions: Mission[];
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useLiveGreenData() {
  const [data, setData] = useState<LiveGreenData>({
    vehicle: MOCK_VEHICLE,
    stats: MOCK_STATS,
    missions: MOCK_MISSIONS,
  });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    // TODO: replace with real API call when backend is ready:
    // const response = await api.getLiveGreenData();
    // setData(response);
    await new Promise<void>((r) => setTimeout(r, 500));
    setData({
      vehicle: MOCK_VEHICLE,
      stats: MOCK_STATS,
      missions: MOCK_MISSIONS,
    });
    setLoading(false);
  }, []);

  return { data, loading, refresh };
}
