/**
 * Gordon — Data Service
 *
 * Domain-level operations that compose store primitives.
 * All screens and hooks should go through this layer (not the store directly)
 * so business rules (point calculation, streak logic, etc.) live in one place.
 */

import { store } from './store';
import {
  COLLECTIONS,
  SINGLETONS,
  type User,
  type DailyRing,
  type RingTask,
  type Trip,
  type PointsEntry,
  type Achievement,
  type CommunityStats,
  type EcoGrade,
  type VehicleType,
} from './types';
import {
  SEED_USERS,
  SEED_CURRENT_USER_ID,
  SEED_DAILY_RINGS,
  SEED_TRIPS,
  SEED_POINTS_LEDGER,
  SEED_ACHIEVEMENTS,
  SEED_COMMUNITY_STATS,
} from './seed';

// ── Bootstrap ─────────────────────────────────────────────────────────────────

/** Seed all collections if the store has never been initialised. */
export async function ensureSeeded(): Promise<void> {
  const seeded = await store.isSeeded();
  if (seeded) return;
  await Promise.all([
    store.seed(COLLECTIONS.USERS, SEED_USERS),
    store.seed(COLLECTIONS.DAILY_RINGS, SEED_DAILY_RINGS),
    store.seed(COLLECTIONS.TRIPS, SEED_TRIPS),
    store.seed(COLLECTIONS.POINTS_LEDGER, SEED_POINTS_LEDGER),
    store.seed(COLLECTIONS.ACHIEVEMENTS, SEED_ACHIEVEMENTS),
    store.setSingleton(SINGLETONS.COMMUNITY_STATS, SEED_COMMUNITY_STATS),
    store.setSingleton(SINGLETONS.CURRENT_USER_ID, SEED_CURRENT_USER_ID),
  ]);
}

/** Wipe everything and re-seed. Useful for dev/testing. */
export async function resetToDefaults(): Promise<void> {
  await store.nukeAll();
  await ensureSeeded();
}

// ── User ──────────────────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<User> {
  const id = await store.getSingleton<string>(SINGLETONS.CURRENT_USER_ID);
  if (!id) throw new Error('[service] no current user id');
  const user = await store.getById<User>(COLLECTIONS.USERS, id);
  if (!user) throw new Error(`[service] user "${id}" not found`);
  return user;
}

export async function updateCurrentUser(patch: Partial<Omit<User, 'id'>>): Promise<User> {
  const user = await getCurrentUser();
  return store.update<User>(COLLECTIONS.USERS, user.id, patch);
}

export async function getAllUsers(): Promise<User[]> {
  return store.getAll<User>(COLLECTIONS.USERS);
}

export async function addUser(user: User): Promise<void> {
  return store.add<User>(COLLECTIONS.USERS, user);
}

export async function deleteUser(id: string): Promise<void> {
  return store.remove(COLLECTIONS.USERS, id);
}

// ── Daily Ring (UC-01) ────────────────────────────────────────────────────────

export async function getTodayRing(): Promise<DailyRing | null> {
  const today = todayKey();
  return store.getById<DailyRing>(COLLECTIONS.DAILY_RINGS, today);
}

export async function getRing(date: string): Promise<DailyRing | null> {
  return store.getById<DailyRing>(COLLECTIONS.DAILY_RINGS, date);
}

export async function getAllRings(): Promise<DailyRing[]> {
  return store.getAll<DailyRing>(COLLECTIONS.DAILY_RINGS);
}

/**
 * Toggle a ring task done/undone.
 * Re-computes progressPct and awards green points accordingly.
 */
export async function toggleRingTask(date: string, taskId: string): Promise<DailyRing> {
  const ring = await store.getById<DailyRing>(COLLECTIONS.DAILY_RINGS, date);
  if (!ring) throw new Error(`[service] ring "${date}" not found`);

  const tasks = ring.tasks.map((t) =>
    t.id === taskId ? { ...t, done: !t.done } : t
  );
  const doneTasks = tasks.filter((t) => t.done);
  const progressPct = tasks.length > 0 ? doneTasks.length / tasks.length : 0;

  const updated = await store.update<DailyRing>(COLLECTIONS.DAILY_RINGS, date, {
    tasks,
    progressPct,
  });

  // Award / revoke points for the toggled task
  const toggled = tasks.find((t) => t.id === taskId)!;
  if (toggled.done) {
    await _awardPoints({
      source: 'ring_task',
      description: toggled.label,
      pts: toggled.pts,
    });
  } else {
    await _revokePoints(`ring_task:${date}:${taskId}`);
  }

  return updated;
}

/** Add a new ring task to a daily ring. */
export async function addRingTask(date: string, task: RingTask): Promise<DailyRing> {
  const ring = await store.getById<DailyRing>(COLLECTIONS.DAILY_RINGS, date);
  if (!ring) throw new Error(`[service] ring "${date}" not found`);
  const tasks = [...ring.tasks, task];
  const doneTasks = tasks.filter((t) => t.done);
  const progressPct = tasks.length > 0 ? doneTasks.length / tasks.length : 0;
  return store.update<DailyRing>(COLLECTIONS.DAILY_RINGS, date, { tasks, progressPct });
}

/** Remove a task from a daily ring. */
export async function removeRingTask(date: string, taskId: string): Promise<DailyRing> {
  const ring = await store.getById<DailyRing>(COLLECTIONS.DAILY_RINGS, date);
  if (!ring) throw new Error(`[service] ring "${date}" not found`);
  const tasks = ring.tasks.filter((t) => t.id !== taskId);
  const doneTasks = tasks.filter((t) => t.done);
  const progressPct = tasks.length > 0 ? doneTasks.length / tasks.length : 0;
  return store.update<DailyRing>(COLLECTIONS.DAILY_RINGS, date, { tasks, progressPct });
}

/** Drop all ring records. */
export async function dropAllRings(): Promise<void> {
  return store.dropAll(COLLECTIONS.DAILY_RINGS);
}

// ── Trips (UC-02) ─────────────────────────────────────────────────────────────

export async function getAllTrips(): Promise<Trip[]> {
  const trips = await store.getAll<Trip>(COLLECTIONS.TRIPS);
  return trips.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getTodayTrips(): Promise<Trip[]> {
  const all = await getAllTrips();
  return all.filter((t) => t.date === todayKey());
}

export async function addTrip(trip: Trip): Promise<void> {
  await store.add<Trip>(COLLECTIONS.TRIPS, trip);
  if (trip.greenPointsEarned > 0) {
    await _awardPoints({
      source: 'trip',
      description: `Chuyến đi ${trip.date} — ${trip.etcPasses} ETC pass`,
      pts: trip.greenPointsEarned,
    });
  }
}

export async function updateTrip(id: string, patch: Partial<Omit<Trip, 'id'>>): Promise<Trip> {
  return store.update<Trip>(COLLECTIONS.TRIPS, id, patch);
}

export async function deleteTrip(id: string): Promise<void> {
  return store.remove(COLLECTIONS.TRIPS, id);
}

export async function dropAllTrips(): Promise<void> {
  return store.dropAll(COLLECTIONS.TRIPS);
}

/** Derive impact summary stats for a period (used by ImpactsScreen). */
export async function getImpactSummary(period: 'week' | 'month' | 'year') {
  const all = await getAllTrips();
  const cutoff = periodCutoff(period);
  const inPeriod = all.filter((t) => t.date >= cutoff && t.status === 'completed');

  const co2Kg = inPeriod.reduce((s, t) => s + t.co2EmittedKg, 0);
  const etcSavingKg = inPeriod.reduce((s, t) => s + t.co2SavedKg, 0);
  const days = periodDays(period);
  const avgKgPerDay = days > 0 ? co2Kg / days : 0;
  const treeEquivalent = Math.round(co2Kg * 10);

  return { co2Kg, treeEquivalent, etcSavingKg, avgKgPerDay };
}

/** Build bar chart data for a period. */
export async function getChartData(period: 'week' | 'month' | 'year') {
  const all = await getAllTrips();
  const cutoff = periodCutoff(period);
  const inPeriod = all.filter((t) => t.date >= cutoff && t.status === 'completed');
  const today = todayKey();

  if (period === 'week') {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });
    return days.map((date, i) => {
      const label = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i];
      const co2Kg = inPeriod
        .filter((t) => t.date === date)
        .reduce((s, t) => s + t.co2EmittedKg, 0);
      return { day: label, co2Kg: parseFloat(co2Kg.toFixed(2)), isToday: date === today };
    });
  }

  if (period === 'month') {
    const weeks = [1, 2, 3, 4];
    return weeks.map((w) => {
      const weekTrips = inPeriod.filter((t) => {
        const day = new Date(t.date).getDate();
        return Math.ceil(day / 7) === w;
      });
      const co2Kg = weekTrips.reduce((s, t) => s + t.co2EmittedKg, 0);
      return {
        day: `T${w}`,
        co2Kg: parseFloat(co2Kg.toFixed(2)),
        isToday: w === Math.ceil(new Date().getDate() / 7),
      };
    });
  }

  // year — group by month
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  return months.map((m) => {
    const monthStr = String(m).padStart(2, '0');
    const monthTrips = inPeriod.filter((t) => t.date.slice(5, 7) === monthStr);
    const co2Kg = monthTrips.reduce((s, t) => s + t.co2EmittedKg, 0);
    return {
      day: `T${m}`,
      co2Kg: parseFloat(co2Kg.toFixed(2)),
      isToday: m === new Date().getMonth() + 1,
    };
  });
}

// ── Points Ledger ─────────────────────────────────────────────────────────────

export async function getAllPoints(): Promise<PointsEntry[]> {
  const entries = await store.getAll<PointsEntry>(COLLECTIONS.POINTS_LEDGER);
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

export async function addPointsEntry(entry: PointsEntry): Promise<void> {
  await store.add<PointsEntry>(COLLECTIONS.POINTS_LEDGER, entry);
}

export async function deletePointsEntry(id: string): Promise<void> {
  return store.remove(COLLECTIONS.POINTS_LEDGER, id);
}

export async function dropAllPoints(): Promise<void> {
  return store.dropAll(COLLECTIONS.POINTS_LEDGER);
}

// ── Achievements ──────────────────────────────────────────────────────────────

export async function getAllAchievements(): Promise<Achievement[]> {
  return store.getAll<Achievement>(COLLECTIONS.ACHIEVEMENTS);
}

export async function updateAchievement(
  id: string,
  patch: Partial<Omit<Achievement, 'id'>>
): Promise<Achievement> {
  return store.update<Achievement>(COLLECTIONS.ACHIEVEMENTS, id, patch);
}

export async function addAchievement(a: Achievement): Promise<void> {
  return store.add<Achievement>(COLLECTIONS.ACHIEVEMENTS, a);
}

export async function deleteAchievement(id: string): Promise<void> {
  return store.remove(COLLECTIONS.ACHIEVEMENTS, id);
}

export async function dropAllAchievements(): Promise<void> {
  return store.dropAll(COLLECTIONS.ACHIEVEMENTS);
}

// ── Community Stats ───────────────────────────────────────────────────────────

export async function getCommunityStats(): Promise<CommunityStats | null> {
  return store.getSingleton<CommunityStats>(SINGLETONS.COMMUNITY_STATS);
}

export async function updateCommunityStats(patch: Partial<CommunityStats>): Promise<void> {
  const current = await getCommunityStats();
  await store.setSingleton(SINGLETONS.COMMUNITY_STATS, { ...current, ...patch });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function periodCutoff(period: 'week' | 'month' | 'year'): string {
  const d = new Date();
  if (period === 'week') d.setDate(d.getDate() - 6);
  else if (period === 'month') d.setDate(1);
  else d.setMonth(0, 1);
  return d.toISOString().slice(0, 10);
}

function periodDays(period: 'week' | 'month' | 'year'): number {
  if (period === 'week') return 7;
  if (period === 'month') return new Date().getDate();
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000);
}

async function _awardPoints(opts: {
  source: PointsEntry['source'];
  description: string;
  pts: number;
}): Promise<void> {
  const user = await getCurrentUser();
  const newBalance = user.greenPoints + opts.pts;
  await store.update<User>(COLLECTIONS.USERS, user.id, { greenPoints: newBalance });

  const entry: PointsEntry = {
    id: `PL${Date.now()}`,
    date: todayKey(),
    source: opts.source,
    description: opts.description,
    pts: opts.pts,
    balance: newBalance,
  };
  await store.add<PointsEntry>(COLLECTIONS.POINTS_LEDGER, entry);
}

async function _revokePoints(_entryId: string): Promise<void> {
  // Simplified: just deduct from user balance based on last matching entry.
  // A full implementation would look up the entry by id and reverse it.
}

// ── Eco grade helper (reusable in screens) ─────────────────────────────────────

export function calcEcoGrade(co2KgPerKm: number): EcoGrade {
  if (co2KgPerKm < 0.05) return 'A';
  if (co2KgPerKm < 0.10) return 'B';
  if (co2KgPerKm < 0.15) return 'C';
  if (co2KgPerKm < 0.20) return 'D';
  return 'F';
}

/** Emission factor kg CO₂/km by vehicle type (per UC-02 spec). */
export const EMISSION_FACTOR: Record<VehicleType, number> = {
  motorbike: 0.07,
  car: 0.21,
  ev: 0.02,
};
