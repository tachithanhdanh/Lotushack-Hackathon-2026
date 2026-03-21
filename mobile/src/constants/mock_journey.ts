export type JourneyPoiType = "charging" | "toll" | "parking";

export type JourneyPoi = {
  id: string;
  name: string;
  subtitle: string;
  address: string;
  type: JourneyPoiType;
  longitude: number;
  latitude: number;
  leftPct: number;
  topPct: number;
  eta: string;
  benefit: string;
};

export type JourneyShortcut = {
  id: string;
  label: string;
  icon: string;
  poiId?: string;
};

export type JourneyRecent = {
  id: string;
  label: string;
  subtitle: string;
  poiId?: string;
};

export const CURRENT_LOCATION = {
  label: "Current Location",
  longitude: 106.7179,
  latitude: 10.7707,
  leftPct: 49,
  topPct: 34,
};

export const TASCO_JOURNEY_POIS: JourneyPoi[] = [
  {
    id: "vng-campus",
    name: "VNG Campus",
    subtitle: "Tasco destination hub",
    address: "Tan Thuan Export Processing Zone, District 7",
    type: "parking",
    longitude: 106.7244,
    latitude: 10.7289,
    leftPct: 68,
    topPct: 24,
    eta: "14 min",
    benefit: "Free parking 90 min",
  },
  {
    id: "tasco-charge-thao-dien",
    name: "Tasco Charge Thao Dien",
    subtitle: "Fast EV charging",
    address: "Xa lo Ha Noi, Thu Duc",
    type: "charging",
    longitude: 106.7421,
    latitude: 10.8019,
    leftPct: 30,
    topPct: 20,
    eta: "8 min",
    benefit: "180 kW charger",
  },
  {
    id: "tasco-etc-ham-thu-thiem",
    name: "ETC Ham Thu Thiem",
    subtitle: "Non-stop toll lane",
    address: "Mai Chi Tho Boulevard, Thu Duc",
    type: "toll",
    longitude: 106.7348,
    latitude: 10.7798,
    leftPct: 23,
    topPct: 46,
    eta: "5 min",
    benefit: "Save 7 min queue time",
  },
  {
    id: "tasco-sala-parking",
    name: "Sala Free Parking",
    subtitle: "Partner parking zone",
    address: "Nguyen Co Thach, Thu Duc",
    type: "parking",
    longitude: 106.7369,
    latitude: 10.7819,
    leftPct: 42,
    topPct: 66,
    eta: "11 min",
    benefit: "Free parking 2 hours",
  },
  {
    id: "tasco-charge-phu-my-hung",
    name: "Tasco Charge PMH",
    subtitle: "Charging and lounge",
    address: "Nguyen Luong Bang, District 7",
    type: "charging",
    longitude: 106.7066,
    latitude: 10.7299,
    leftPct: 76,
    topPct: 57,
    eta: "16 min",
    benefit: "Coffee while charging",
  },
];

export const JOURNEY_SHORTCUTS: JourneyShortcut[] = [
  { id: "office", label: "Office", icon: "briefcase-outline", poiId: "vng-campus" },
  { id: "school", label: "School", icon: "map-outline", poiId: "tasco-sala-parking" },
  { id: "more", label: "+", icon: "plus", poiId: "tasco-charge-thao-dien" },
];

export const JOURNEY_RECENTS: JourneyRecent[] = [
  {
    id: "recent-vng",
    label: "VNG Campus",
    subtitle: "Tan Thuan Export Processing Zone, District 7",
    poiId: "vng-campus",
  },
  {
    id: "recent-home",
    label: "Home",
    subtitle: "Sunrise Riverside, Nguyen Huu Tho, District 7",
  },
  {
    id: "recent-charge",
    label: "Tasco Charge Thao Dien",
    subtitle: "Xa lo Ha Noi, Thu Duc",
    poiId: "tasco-charge-thao-dien",
  },
];
