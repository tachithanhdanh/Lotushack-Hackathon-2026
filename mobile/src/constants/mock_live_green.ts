import type { VehicleInfo, DailyStats, Mission } from "../hooks/useLiveGreenData";

export const MOCK_VEHICLE: VehicleInfo = {
  name: "Zeekr 7X",
  status: "parking",
  batteryPercent: 79,
};

export const MOCK_STATS: DailyStats = {
  missionProgress: 0.5,
  co2Kg: 0.4,
  greenPoints: 120,
};

export const MOCK_MISSIONS: Mission[] = [
  {
    id: "1",
    label: "Pass 2 ETC fee charging stations",
    pts: 15,
    sub: "0/2",
    done: false,
  },
  {
    id: "2",
    label: "Complete full suggested trip on time",
    pts: 20,
    sub: "0/1",
    done: false,
  },
  {
    id: "3",
    label: "Use a Tasco fast-charger station",
    pts: 15,
    done: true,
  },
  {
    id: "4",
    label: "Use ETC lane (no stopping)",
    pts: 5,
    done: true,
  },
];

// 64-frame 360° spin images (Honda CDN, clockwise)
export const MOCK_CAR_360_IMAGES: string[] = Array.from(
  { length: 64 },
  (_, i) =>
    `https://cdn.honda.com.vn/automobile-versions/Image360/October2024/1729591947/${i}.png`
);
