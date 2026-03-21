/**
 * Gordon — Default Seed Data
 *
 * All mock data for the app in one place, typed against the unified model.
 * Called once on first launch via service.ensureSeeded().
 * To reset: call store.nukeAll() then service.ensureSeeded().
 */

import type {
  LeaderboardEntry,
  User,
  DailyRing,
  Trip,
  PointsEntry,
  Achievement,
  CommunityStats,
} from './types';

// ── Users ─────────────────────────────────────────────────────────────────────

export const SEED_USERS: User[] = [
  {
    id: 'USR001',
    username: 'minhminh',
    name: 'Nguyễn Ngọc Minh',
    email: 'minhminh@gmail.com',
    phone: '0911666888',
    vehicleType: 'ev',
    vehicleName: 'Zeekr 7X',
    batteryPercent: 79,
    vetcLinked: true,
    greenPoints: 120,
    streak: 7,
    savedRoute: {
      id: 'RT001',
      name: 'Nhà → Văn phòng',
      origin: 'Nhà (Q.Bình Thạnh)',
      destination: 'VNG Campus (Q.9)',
      distanceKm: 14.2,
      etcGates: 2,
    },
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'USR002',
    username: 'ngoclan',
    name: 'Ngô Ngọc Lan',
    email: 'ngoclan@gmail.com',
    phone: '0911666999',
    vehicleType: 'motorbike',
    vehicleName: 'Honda Air Blade',
    vetcLinked: false,
    greenPoints: 45,
    streak: 2,
    createdAt: '2026-02-01T09:00:00Z',
  },
];

export const SEED_CURRENT_USER_ID = 'USR001';

// ── Daily rings ───────────────────────────────────────────────────────────────

export const SEED_DAILY_RINGS: DailyRing[] = [
  {
    id: '2026-03-21',
    date: '2026-03-21',
    tasks: [
      {
        id: 'T1',
        type: 'etc_pass',
        label: 'Pass 2 ETC fee charging stations',
        pts: 15,
        sub: '0/2',
        done: false,
      },
      {
        id: 'T2',
        type: 'off_peak_depart',
        label: 'Complete full suggested trip on time',
        pts: 20,
        sub: '0/1',
        done: false,
      },
      {
        id: 'T3',
        type: 'charge',
        label: 'Use a Tasco fast-charger station',
        pts: 15,
        done: true,
      },
      {
        id: 'T4',
        type: 'use_etc_lane',
        label: 'Use ETC lane (no stopping)',
        pts: 5,
        done: true,
      },
    ],
    progressPct: 0.5,
    streakDay: 7,
    bonusAwarded: false,
  },
  {
    id: '2026-03-20',
    date: '2026-03-20',
    tasks: [
      { id: 'T1', type: 'etc_pass', label: 'Pass 2 ETC fee charging stations', pts: 15, done: true },
      { id: 'T2', type: 'off_peak_depart', label: 'Depart before 7:30 AM', pts: 20, done: true },
      { id: 'T3', type: 'parking', label: 'Park within 5 minutes', pts: 10, done: true },
    ],
    progressPct: 1.0,
    streakDay: 6,
    bonusAwarded: true,
  },
];

// ── Trips ─────────────────────────────────────────────────────────────────────

export const SEED_TRIPS: Trip[] = [
  {
    id: 'TRIP001',
    date: '2026-03-21',
    startTime: '07:15:00',
    endTime: '07:52:00',
    origin: 'Nhà (Q.Bình Thạnh)',
    destination: 'VNG Campus (Q.9)',
    distanceKm: 14.2,
    durationMin: 37,
    vehicleType: 'ev',
    co2EmittedKg: 0.28,
    co2SavedKg: 1.0,
    ecoGrade: 'A',
    etcPasses: 2,
    greenPointsEarned: 7,
    status: 'completed',
  },
  {
    id: 'TRIP002',
    date: '2026-03-20',
    startTime: '07:10:00',
    endTime: '07:48:00',
    origin: 'Nhà (Q.Bình Thạnh)',
    destination: 'VNG Campus (Q.9)',
    distanceKm: 14.2,
    durationMin: 38,
    vehicleType: 'ev',
    co2EmittedKg: 0.28,
    co2SavedKg: 0.95,
    ecoGrade: 'A',
    etcPasses: 2,
    greenPointsEarned: 7,
    status: 'completed',
  },
  {
    id: 'TRIP003',
    date: '2026-03-19',
    startTime: '07:22:00',
    endTime: '08:05:00',
    origin: 'Nhà (Q.Bình Thạnh)',
    destination: 'VNG Campus (Q.9)',
    distanceKm: 15.1,
    durationMin: 43,
    vehicleType: 'ev',
    co2EmittedKg: 0.30,
    co2SavedKg: 0.88,
    ecoGrade: 'A',
    etcPasses: 1,
    greenPointsEarned: 5,
    status: 'completed',
  },
];

// ── Points ledger ─────────────────────────────────────────────────────────────

export const SEED_POINTS_LEDGER: PointsEntry[] = [
  {
    id: 'PL001',
    date: '2026-03-21',
    source: 'ring_task',
    description: 'Dùng Tasco fast-charger station',
    pts: 15,
    balance: 120,
  },
  {
    id: 'PL002',
    date: '2026-03-21',
    source: 'ring_task',
    description: 'Dùng ETC lane (no stopping)',
    pts: 5,
    balance: 105,
  },
  {
    id: 'PL003',
    date: '2026-03-20',
    source: 'streak_bonus',
    description: 'Hoàn thành ring 100% — bonus streak',
    pts: 10,
    balance: 100,
  },
  {
    id: 'PL004',
    date: '2026-03-20',
    source: 'ring_task',
    description: 'Hoàn thành 3 tasks ngày 20/03',
    pts: 45,
    balance: 90,
  },
  {
    id: 'PL005',
    date: '2026-03-19',
    source: 'trip',
    description: 'Chuyến đi 19/03 — 1 ETC pass',
    pts: 5,
    balance: 45,
  },
];

// ── Achievements ──────────────────────────────────────────────────────────────

export const SEED_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ACH001',
    icon: 'fire',
    iconBgColor: '#FFF3E0',
    iconColor: '#FF6B35',
    title: 'Streak 7 ngày',
    subtitle: 'Hoàn thành ring 7 ngày liên tiếp',
    achieved: true,
    achievedAt: '2026-03-21',
  },
  {
    id: 'ACH002',
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
    id: 'ACH003',
    icon: 'lightning-bolt',
    iconBgColor: '#FFFDE7',
    iconColor: '#FFC107',
    title: 'ETC Master',
    subtitle: 'Dùng ETC 50 lần',
    achieved: false,
    progress: 0.6,
    progressLabel: '30 / 50 lần',
  },
  {
    id: 'ACH004',
    icon: 'star',
    iconBgColor: '#EDE7F6',
    iconColor: '#7E57C2',
    title: 'Green Commuter',
    subtitle: 'Hoàn thành 20 chuyến đi xanh',
    achieved: false,
    progress: 0.15,
    progressLabel: '3 / 20 chuyến',
  },
];

// ── Leaderboard ───────────────────────────────────────────────────────────────

export const SEED_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'LB001', rank: 1, name: 'Ngoc Tran',    avatarColor: '#A8D5B5', co2Kg: 12.5, badgeCount: 12 },
  { id: 'LB002', rank: 2, name: 'Minh Le',      avatarColor: '#B0BEC5', co2Kg: 10.1, badgeCount: 10 },
  { id: 'LB003', rank: 3, name: 'Thoai Tang',   avatarColor: '#FFCCBC', co2Kg: 9.0,  badgeCount: 8  },
  { id: 'LB004', rank: 4, name: 'Thuan Nguyen', avatarColor: '#C8E6C9', co2Kg: 8.9,  badgeCount: 7  },
  { id: 'LB005', rank: 5, name: 'Danh Ta',      avatarColor: '#D1C4E9', co2Kg: 8.6,  badgeCount: 6  },
  { id: 'LB006', rank: 6, name: 'Sam Tran',     avatarColor: '#FFE0B2', co2Kg: 8.2,  badgeCount: 5  },
];

// ── Community stats ───────────────────────────────────────────────────────────

export const SEED_COMMUNITY_STATS: CommunityStats = {
  totalCo2Kg: 47200,
  totalTransactions: 23400,
  monthlyGoalKg: 200000,
  monthlyProgressPct: 0.236,
  userContributionPct: 0.0007,
  lastUpdated: '2026-03-21T06:00:00Z',
};
