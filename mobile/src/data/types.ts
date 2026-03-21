/**
 * Gordon — Unified Data Model
 * Single source of truth for all entities across UC-01..04.
 * Every screen reads/writes through the store using these types.
 */

// ── Enums / literals ──────────────────────────────────────────────────────────

export type VehicleType = 'motorbike' | 'car' | 'ev';
export type VehicleStatus = 'parking' | 'driving' | 'charging';
export type EcoGrade = 'A' | 'B' | 'C' | 'D' | 'F';
export type Period = 'week' | 'month' | 'year';
export type TripStatus = 'active' | 'completed' | 'cancelled';
export type PointsSource = 'ring_task' | 'streak_bonus' | 'trip' | 'referral' | 'manual';
export type RingTaskType =
  | 'etc_pass'
  | 'off_peak_depart'
  | 'parking'
  | 'eco_drive'
  | 'use_etc_lane'
  | 'charge';

// ── User (UC-01 actor) ────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: VehicleType;
  vehicleName: string;
  /** battery % for EV, undefined for ICE */
  batteryPercent?: number;
  vetcLinked: boolean;
  greenPoints: number;
  /** consecutive days ring >= 70% */
  streak: number;
  savedRoute?: SavedRoute;
  createdAt: string;
}

// ── Route (UC-01 / UC-04) ─────────────────────────────────────────────────────

export interface SavedRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distanceKm: number;
  /** number of ETC toll gates on this route */
  etcGates: number;
}

// ── Daily ring task (UC-01) ────────────────────────────────────────────────────

export interface RingTask {
  id: string;
  type: RingTaskType;
  label: string;
  pts: number;
  /** e.g. "0/2" shown under the task label */
  sub?: string;
  done: boolean;
}

// ── Daily ring (UC-01) — one document per calendar date ───────────────────────

export interface DailyRing {
  /** Primary key — YYYY-MM-DD */
  id: string;
  date: string;
  tasks: RingTask[];
  /** 0–1 float derived from tasks */
  progressPct: number;
  /** day number within current streak at ring-time */
  streakDay: number;
  /** true when full-ring 10-pt bonus was awarded */
  bonusAwarded: boolean;
}

// ── Trip / CO2 Meter (UC-02) ──────────────────────────────────────────────────

export interface Trip {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  origin: string;
  destination: string;
  distanceKm: number;
  durationMin: number;
  vehicleType: VehicleType;
  co2EmittedKg: number;
  co2SavedKg: number;
  ecoGrade: EcoGrade;
  etcPasses: number;
  greenPointsEarned: number;
  status: TripStatus;
}

// ── Green Points ledger entry ─────────────────────────────────────────────────

export interface PointsEntry {
  id: string;
  date: string;
  source: PointsSource;
  description: string;
  /** positive = credit, negative = debit */
  pts: number;
  /** running balance after this entry */
  balance: number;
}

// ── Achievement ───────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  title: string;
  subtitle: string;
  achieved: boolean;
  /** 0–1 progress toward achievement */
  progress?: number;
  progressLabel?: string;
  achievedAt?: string;
}

// ── Community stats (UC-03 aggregate) ────────────────────────────────────────

export interface CommunityStats {
  totalCo2Kg: number;
  totalTransactions: number;
  monthlyGoalKg: number;
  monthlyProgressPct: number;
  userContributionPct: number;
  lastUpdated: string;
}

// ── Smart route option (UC-04) ────────────────────────────────────────────────

export interface RouteOption {
  id: string;
  /** e.g. 'Nhanh nhất', 'Cân bằng', 'Xanh nhất' */
  label: string;
  timeMin: number;
  co2Kg: number;
  etcGates: number;
  potentialPts: number;
  greenScore: number;
  recommended: boolean;
}

// ── Collection names (keys in the store) ─────────────────────────────────────

export const COLLECTIONS = {
  USERS: 'users',
  DAILY_RINGS: 'daily_rings',
  TRIPS: 'trips',
  POINTS_LEDGER: 'points_ledger',
  ACHIEVEMENTS: 'achievements',
} as const;

export const SINGLETONS = {
  COMMUNITY_STATS: 'community_stats',
  CURRENT_USER_ID: 'current_user_id',
} as const;
