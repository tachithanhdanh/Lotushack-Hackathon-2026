import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, { Line, Path } from "react-native-svg";
import {
  CURRENT_LOCATION,
  JOURNEY_RECENTS,
  JOURNEY_SHORTCUTS,
  TASCO_JOURNEY_POIS,
  JourneyPoi,
  JourneyPoiType,
} from "../constants/mock_journey";
import { Colors } from "../theme/colors";

const POI_ICON: Record<JourneyPoiType, keyof typeof MaterialCommunityIcons.glyphMap> = {
  charging: "lightning-bolt",
  toll: "road-variant",
  parking: "parking",
};

const POI_COLOR: Record<JourneyPoiType, string> = {
  charging: Colors.info,
  toll: Colors.warning,
  parking: Colors.success,
};

const CURRENT_DOT_SIZE = 74;
const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

let cachedMapbox: any;

function getMapboxModule() {
  if (cachedMapbox !== undefined) {
    return cachedMapbox;
  }

  try {
    const mapbox = require("@rnmapbox/maps");
    if (MAPBOX_TOKEN) {
      mapbox.default?.setAccessToken?.(MAPBOX_TOKEN);
      mapbox.setAccessToken?.(MAPBOX_TOKEN);
    }
    cachedMapbox = mapbox;
  } catch {
    cachedMapbox = null;
  }

  return cachedMapbox;
}

function buildMockRoutePath(to: JourneyPoi) {
  const startX = CURRENT_LOCATION.leftPct;
  const startY = CURRENT_LOCATION.topPct;
  const midX = (startX + to.leftPct) / 2;
  const bendY = Math.min(startY, to.topPct) - 9;
  const lowerBendY = Math.max(startY, to.topPct) - 6;

  return [
    `M ${startX} ${startY}`,
    `C ${startX + 5} ${bendY}, ${midX - 7} ${bendY}, ${midX} ${(startY + to.topPct) / 2}`,
    `S ${to.leftPct - 6} ${lowerBendY}, ${to.leftPct} ${to.topPct}`,
  ].join(" ");
}

function buildRouteCoordinates(to: JourneyPoi) {
  const start = [CURRENT_LOCATION.longitude, CURRENT_LOCATION.latitude];
  const end = [to.longitude, to.latitude];
  const mid = [
    (CURRENT_LOCATION.longitude + to.longitude) / 2 - 0.003,
    (CURRENT_LOCATION.latitude + to.latitude) / 2 + 0.004,
  ];

  return [start, mid, end];
}

function buildRouteFeature(to: JourneyPoi) {
  return {
    type: "Feature" as const,
    properties: { id: `route-${to.id}` },
    geometry: {
      type: "LineString" as const,
      coordinates: buildRouteCoordinates(to),
    },
  };
}

function MockMapBackground() {
  return (
    <Svg style={StyleSheet.absoluteFillObject} viewBox="0 0 100 100">
      <Path d="M -5 17 L 110 17" stroke={Colors.border} strokeWidth="4.5" opacity="0.55" />
      <Path d="M -4 34 L 108 34" stroke={Colors.border} strokeWidth="4.5" opacity="0.5" />
      <Path d="M -6 56 L 108 56" stroke={Colors.border} strokeWidth="4.5" opacity="0.48" />
      <Path d="M -3 74 L 104 74" stroke={Colors.border} strokeWidth="4.5" opacity="0.4" />
      <Path d="M 7 -2 L 36 102" stroke={Colors.border} strokeWidth="4" opacity="0.42" />
      <Path d="M 31 -5 L 58 102" stroke={Colors.border} strokeWidth="4" opacity="0.35" />
      <Path d="M 58 -5 L 82 102" stroke={Colors.border} strokeWidth="4" opacity="0.35" />
      <Path d="M 83 -5 L 107 102" stroke={Colors.border} strokeWidth="4" opacity="0.32" />
      <Path
        d="M -4 47 C 18 34, 35 66, 54 49 S 86 22, 104 39"
        stroke={Colors.routeBlueLight}
        strokeWidth="6"
        opacity="0.4"
        fill="none"
      />
      <Path
        d="M -2 63 C 18 54, 29 87, 48 79 S 78 41, 104 59"
        stroke={Colors.routeBlueLight}
        strokeWidth="5"
        opacity="0.3"
        fill="none"
      />
      <Path
        d="M 0 83 C 18 80, 27 66, 44 63 S 73 72, 100 67"
        stroke={Colors.warning}
        strokeWidth="5"
        opacity="0.28"
        fill="none"
      />
      <Path
        d="M 61 0 C 61 19, 62 37, 61 56 C 60 72, 58 89, 58 100"
        stroke={Colors.routeBlue}
        strokeWidth="6"
        opacity="0.35"
        fill="none"
      />
      {[
        [8, 13, 14, 16],
        [28, 24, 34, 27],
        [63, 11, 69, 14],
        [76, 31, 82, 34],
        [17, 43, 23, 46],
        [53, 53, 59, 56],
        [79, 71, 85, 74],
      ].map(([x1, y1, x2, y2], index) => (
        <Line
          key={index}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={Colors.secondary}
          strokeWidth="0.7"
          opacity="0.32"
        />
      ))}
    </Svg>
  );
}

function MockCurrentMarker() {
  return (
    <View
      style={[
        styles.currentMarkerWrap,
        {
          left: `${CURRENT_LOCATION.leftPct}%`,
          top: `${CURRENT_LOCATION.topPct}%`,
          marginLeft: -(CURRENT_DOT_SIZE / 2),
          marginTop: -(CURRENT_DOT_SIZE / 2),
        },
      ]}
      pointerEvents="none"
    >
      <View style={styles.currentPulse} />
      <View style={styles.currentMarkerOuter}>
        <View style={styles.currentMarkerInner}>
          <MaterialCommunityIcons
            name="navigation-variant"
            size={34}
            color={Colors.textOnPrimary}
            style={styles.currentMarkerIcon}
          />
        </View>
      </View>
    </View>
  );
}

function MockPoiMarker({
  poi,
  selected,
  onPress,
}: {
  poi: JourneyPoi;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.poiWrap,
        {
          left: `${poi.leftPct}%`,
          top: `${poi.topPct}%`,
          marginLeft: -18,
          marginTop: -18,
        },
      ]}
    >
      <MapPin poi={poi} selected={selected} />
    </Pressable>
  );
}

function MapPin({ poi, selected }: { poi: JourneyPoi; selected: boolean }) {
  return (
    <View style={styles.poiPinWrap}>
      <View
        style={[
          styles.poiPin,
          { backgroundColor: POI_COLOR[poi.type] },
          selected && styles.poiPinSelected,
        ]}
      >
        <MaterialCommunityIcons
          name={POI_ICON[poi.type]}
          size={18}
          color={Colors.textOnPrimary}
        />
      </View>
      <View style={[styles.poiLabel, selected && styles.poiLabelSelected]}>
        <Text
          numberOfLines={1}
          style={[styles.poiLabelText, selected && styles.poiLabelTextSelected]}
        >
          {poi.name}
        </Text>
      </View>
    </View>
  );
}

function CurrentPuck() {
  return (
    <View style={styles.currentMarkerWrap} pointerEvents="none">
      <View style={styles.currentPulse} />
      <View style={styles.currentMarkerOuter}>
        <View style={styles.currentMarkerInner}>
          <MaterialCommunityIcons
            name="navigation-variant"
            size={34}
            color={Colors.textOnPrimary}
            style={styles.currentMarkerIcon}
          />
        </View>
      </View>
    </View>
  );
}

function LiveMapSurface({
  selectedPoi,
  onSelectPoi,
}: {
  selectedPoi: JourneyPoi | null;
  onSelectPoi: (poi: JourneyPoi) => void;
}) {
  const mapbox = getMapboxModule();

  if (!mapbox || !MAPBOX_TOKEN) {
    return null;
  }

  const MapView = mapbox.MapView;
  const Camera = mapbox.Camera;
  const PointAnnotation = mapbox.PointAnnotation;
  const ShapeSource = mapbox.ShapeSource;
  const LineLayer = mapbox.LineLayer;
  const StyleURL = mapbox.StyleURL;

  const centerCoordinate = selectedPoi
    ? [selectedPoi.longitude, selectedPoi.latitude]
    : [CURRENT_LOCATION.longitude, CURRENT_LOCATION.latitude];

  return (
    <MapView
      style={styles.mapFill}
      styleURL={StyleURL.Street}
      compassEnabled={false}
      scaleBarEnabled={false}
      pitchEnabled={false}
      rotateEnabled={false}
    >
      <Camera
        centerCoordinate={centerCoordinate}
        zoomLevel={selectedPoi ? 12.7 : 11.8}
        animationDuration={850}
      />

      {selectedPoi ? (
        <ShapeSource id="journey-route-source" shape={buildRouteFeature(selectedPoi)}>
          <LineLayer
            id="journey-route-line"
            style={{
              lineColor: Colors.primary,
              lineWidth: 5,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        </ShapeSource>
      ) : null}

      <PointAnnotation
        id="current-location"
        coordinate={[CURRENT_LOCATION.longitude, CURRENT_LOCATION.latitude]}
      >
        <CurrentPuck />
      </PointAnnotation>

      {TASCO_JOURNEY_POIS.map((poi) => (
        <PointAnnotation
          key={poi.id}
          id={poi.id}
          coordinate={[poi.longitude, poi.latitude]}
          onSelected={() => onSelectPoi(poi)}
        >
          <Pressable onPress={() => onSelectPoi(poi)}>
            <MapPin poi={poi} selected={selectedPoi?.id === poi.id} />
          </Pressable>
        </PointAnnotation>
      ))}
    </MapView>
  );
}

function MockMapSurface({
  selectedPoi,
  onSelectPoi,
}: {
  selectedPoi: JourneyPoi | null;
  onSelectPoi: (poi: JourneyPoi) => void;
}) {
  return (
    <View style={styles.mapFill}>
      <MockMapBackground />

      {selectedPoi ? (
        <Svg style={StyleSheet.absoluteFillObject} viewBox="0 0 100 100">
          <Path
            d={buildMockRoutePath(selectedPoi)}
            stroke={Colors.primary}
            strokeWidth="1.9"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : null}

      {!selectedPoi ? <View style={styles.discoveryHalo} pointerEvents="none" /> : null}

      <MockCurrentMarker />

      {TASCO_JOURNEY_POIS.map((poi) => (
        <MockPoiMarker
          key={poi.id}
          poi={poi}
          selected={selectedPoi?.id === poi.id}
          onPress={() => onSelectPoi(poi)}
        />
      ))}
    </View>
  );
}

function MapSurface({
  selectedPoi,
  onSelectPoi,
}: {
  selectedPoi: JourneyPoi | null;
  onSelectPoi: (poi: JourneyPoi) => void;
}) {
  const mapbox = getMapboxModule();

  if (mapbox && MAPBOX_TOKEN) {
    return <LiveMapSurface selectedPoi={selectedPoi} onSelectPoi={onSelectPoi} />;
  }

  return <MockMapSurface selectedPoi={selectedPoi} onSelectPoi={onSelectPoi} />;
}

function SearchSheet({
  onSelectPoi,
}: {
  onSelectPoi: (poi: JourneyPoi) => void;
}) {
  return (
    <View style={styles.sheet}>
      <View style={styles.sheetHandle} />

      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={32} color={Colors.textMuted} />
        <TextInput
          editable={false}
          value="Where are you going today?"
          style={styles.searchInput}
          placeholderTextColor={Colors.secondary}
        />
        <MaterialCommunityIcons
          name="microphone-outline"
          size={30}
          color={Colors.textMuted}
        />
      </View>

      <View style={styles.shortcutRow}>
        {JOURNEY_SHORTCUTS.map((item, index) => {
          const linkedPoi = TASCO_JOURNEY_POIS.find((poi) => poi.id === item.poiId);
          return (
            <Pressable
              key={item.id}
              style={[
                styles.shortcutCard,
                item.label === "+" && styles.shortcutCardSmall,
                index < JOURNEY_SHORTCUTS.length - 1 && styles.shortcutCardSpacing,
              ]}
              onPress={() => linkedPoi && onSelectPoi(linkedPoi)}
            >
              <MaterialCommunityIcons
                name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                size={26}
                color={item.label === "+" ? Colors.textPrimary : Colors.primary}
              />
              <Text style={[styles.shortcutLabel, item.label === "+" && styles.shortcutPlus]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>Recent</Text>
      {JOURNEY_RECENTS.map((item) => {
        const poi = TASCO_JOURNEY_POIS.find((entry) => entry.id === item.poiId);
        return (
          <Pressable
            key={item.id}
            style={styles.recentRow}
            onPress={() => poi && onSelectPoi(poi)}
          >
            <View style={styles.recentIconWrap}>
              <MaterialCommunityIcons name="history" size={24} color={Colors.secondary} />
            </View>
            <View style={styles.recentTextWrap}>
              <Text style={styles.recentTitle}>{item.label}</Text>
              <Text style={styles.recentSubtitle}>{item.subtitle}</Text>
            </View>
          </Pressable>
        );
      })}

      <Text style={styles.sectionLabel}>Nearby Tasco perks</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.perksRow}
      >
        {TASCO_JOURNEY_POIS.map((poi) => (
          <Pressable key={poi.id} style={styles.perkCard} onPress={() => onSelectPoi(poi)}>
            <View style={[styles.perkIcon, { backgroundColor: POI_COLOR[poi.type] }]}>
              <MaterialCommunityIcons
                name={POI_ICON[poi.type]}
                size={16}
                color={Colors.textOnPrimary}
              />
            </View>
            <Text style={styles.perkTitle}>{poi.name}</Text>
            <Text style={styles.perkMeta}>{poi.benefit}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function DirectionsCard({
  destination,
  onBack,
}: {
  destination: JourneyPoi;
  onBack: () => void;
}) {
  return (
    <View style={styles.directionsWrap}>
      <View style={styles.directionsCard}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <MaterialCommunityIcons name="arrow-left" size={30} color={Colors.secondary} />
        </Pressable>

        <View style={styles.directionLineWrap}>
          <View style={styles.directionDotStart} />
          <View style={styles.directionDashes} />
          <MaterialCommunityIcons name="map-marker" size={20} color={Colors.error} />
        </View>

        <View style={styles.directionInputs}>
          <View style={[styles.directionField, styles.directionFieldSpacing]}>
            <Text style={styles.directionFieldText}>Current Location</Text>
          </View>
          <View style={styles.directionField}>
            <Text style={styles.directionFieldText}>{destination.name}</Text>
          </View>
        </View>

        <View style={styles.directionActions}>
          <MaterialCommunityIcons name="swap-vertical" size={32} color={Colors.secondary} />
          <View style={styles.directionPlusWrap}>
            <MaterialCommunityIcons name="plus" size={22} color={Colors.secondary} />
          </View>
        </View>
      </View>

      <View style={styles.routeInfoCard}>
        <View>
          <Text style={styles.routeInfoTitle}>{destination.name}</Text>
          <Text style={styles.routeInfoSubtitle}>{destination.subtitle}</Text>
          <Text style={styles.routeInfoAddress}>{destination.address}</Text>
        </View>

        <View style={styles.routeStatsRow}>
          <View style={[styles.routeStatPill, styles.routeStatPillSpacing]}>
            <MaterialCommunityIcons name="clock-outline" size={15} color={Colors.primary} />
            <Text style={styles.routeStatText}>{destination.eta}</Text>
          </View>
          <View style={styles.routeStatPill}>
            <MaterialCommunityIcons
              name={POI_ICON[destination.type]}
              size={15}
              color={POI_COLOR[destination.type]}
            />
            <Text style={styles.routeStatText}>{destination.benefit}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function LegendPill({
  icon,
  label,
  color,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  color: string;
}) {
  return (
    <View style={styles.legendPill}>
      <View style={[styles.legendIcon, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={14} color={Colors.textOnPrimary} />
      </View>
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function MapModeBadge() {
  const isLive = Boolean(getMapboxModule() && MAPBOX_TOKEN);

  return (
    <View style={styles.modeBadge}>
      <View
        style={[styles.modeDot, { backgroundColor: isLive ? Colors.primary : Colors.warning }]}
      />
      <Text style={styles.modeBadgeText}>{isLive ? "Mapbox live" : "Mock fallback"}</Text>
    </View>
  );
}

export function JourneyContent({ navigation }: any) {
  const [selectedPoiId, setSelectedPoiId] = React.useState<string | null>(null);

  const selectedPoi = React.useMemo(
    () => TASCO_JOURNEY_POIS.find((poi) => poi.id === selectedPoiId) ?? null,
    [selectedPoiId],
  );

  return (
    <View style={styles.root}>
      <MapSurface selectedPoi={selectedPoi} onSelectPoi={(poi) => setSelectedPoiId(poi.id)} />

      <Text style={styles.pageTitle}>Journey</Text>
      <MapModeBadge />

      {!selectedPoi ? (
        <View style={styles.legendRow}>
          <LegendPill icon="lightning-bolt" label="Charging" color={POI_COLOR.charging} />
          <LegendPill icon="road-variant" label="ETC" color={POI_COLOR.toll} />
          <LegendPill icon="parking" label="Free parking" color={POI_COLOR.parking} />
        </View>
      ) : null}

      {selectedPoi ? (
        <DirectionsCard destination={selectedPoi} onBack={() => setSelectedPoiId(null)} />
      ) : (
        <SearchSheet onSelectPoi={(poi) => setSelectedPoiId(poi.id)} />
      )}

      {selectedPoi ? (
        <Pressable
          style={styles.startJourneyButton}
          onPress={() => navigation.navigate("Co2Meter")}
        >
          <Text style={styles.startJourneyButtonText}>Start Journey</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surfaceMuted,
    overflow: "hidden",
  },
  mapFill: {
    ...StyleSheet.absoluteFillObject,
  },
  pageTitle: {
    position: "absolute",
    top: 14,
    left: 22,
    fontSize: 24,
    fontWeight: "800",
    color: Colors.ink,
  },
  modeBadge: {
    position: "absolute",
    top: 22,
    right: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: Colors.glassStrong,
  },
  modeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  modeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.ink,
  },
  discoveryHalo: {
    position: "absolute",
    left: "13%",
    top: "11%",
    width: "66%",
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: Colors.haloMint,
  },
  currentMarkerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  currentPulse: {
    position: "absolute",
    width: 206,
    height: 206,
    borderRadius: 999,
    backgroundColor: Colors.haloMint,
  },
  currentMarkerOuter: {
    width: CURRENT_DOT_SIZE,
    height: CURRENT_DOT_SIZE,
    borderRadius: CURRENT_DOT_SIZE / 2,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 5,
  },
  currentMarkerInner: {
    width: CURRENT_DOT_SIZE - 8,
    height: CURRENT_DOT_SIZE - 8,
    borderRadius: (CURRENT_DOT_SIZE - 8) / 2,
    backgroundColor: Colors.mapGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  currentMarkerIcon: {
    marginTop: 3,
    marginLeft: 3,
  },
  poiWrap: {
    position: "absolute",
    maxWidth: 120,
  },
  poiPinWrap: {
    alignItems: "center",
    maxWidth: 120,
  },
  poiPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.surface,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  poiPinSelected: {
    transform: [{ scale: 1.08 }],
  },
  poiLabel: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: Colors.glassStrong,
  },
  poiLabelSelected: {
    backgroundColor: Colors.ink,
  },
  poiLabelText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.ink,
  },
  poiLabelTextSelected: {
    color: Colors.textOnPrimary,
  },
  legendRow: {
    position: "absolute",
    top: 108,
    right: 16,
  },
  legendPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.glassStrong,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
  legendIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.ink,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: "43%",
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 34,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  sheetHandle: {
    width: 96,
    height: 6,
    borderRadius: 999,
    backgroundColor: Colors.border,
    alignSelf: "center",
    marginBottom: 18,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 20,
    color: Colors.secondary,
    marginHorizontal: 10,
  },
  shortcutRow: {
    flexDirection: "row",
    marginTop: 18,
  },
  shortcutCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  shortcutCardSmall: {
    flex: 0,
    width: 88,
  },
  shortcutCardSpacing: {
    marginRight: 12,
  },
  shortcutLabel: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "600",
    color: Colors.ink,
  },
  shortcutPlus: {
    marginLeft: 8,
    fontSize: 22,
  },
  sectionLabel: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 16,
    color: Colors.textMuted,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  recentIconWrap: {
    width: 34,
    alignItems: "center",
    paddingTop: 2,
  },
  recentTextWrap: {
    flex: 1,
    marginLeft: 14,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.ink,
  },
  recentSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textMuted,
  },
  perksRow: {
    paddingRight: 12,
  },
  perkCard: {
    width: 170,
    marginRight: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: Colors.surfaceMuted,
  },
  perkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  perkTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.ink,
  },
  perkMeta: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  directionsWrap: {
    position: "absolute",
    top: 26,
    left: 16,
    right: 16,
  },
  directionsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 26,
    paddingHorizontal: 14,
    paddingVertical: 16,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 6,
  },
  backButton: {
    width: 46,
    alignItems: "center",
  },
  directionLineWrap: {
    alignItems: "center",
    width: 28,
    marginRight: 12,
  },
  directionDotStart: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 4,
    borderColor: Colors.success,
    backgroundColor: Colors.primaryLight,
  },
  directionDashes: {
    width: 3,
    height: 34,
    borderRadius: 999,
    backgroundColor: Colors.border,
    marginVertical: 7,
  },
  directionInputs: {
    flex: 1,
  },
  directionField: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  directionFieldSpacing: {
    marginBottom: 10,
  },
  directionFieldText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.ink,
  },
  directionActions: {
    width: 42,
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  directionPlusWrap: {
    marginTop: 18,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  routeInfoCard: {
    marginTop: 14,
    marginLeft: 62,
    marginRight: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: Colors.glassStrong,
  },
  routeInfoTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.ink,
  },
  routeInfoSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  routeInfoAddress: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: Colors.textMuted,
  },
  routeStatsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  routeStatPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.surfaceMuted,
  },
  routeStatPillSpacing: {
    marginRight: 8,
    marginBottom: 8,
  },
  routeStatText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "600",
    color: Colors.ink,
  },
  startJourneyButton: {
    position: "absolute",
    bottom: 92,
    alignSelf: "center",
    minWidth: 186,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 5,
  },
  startJourneyButtonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textOnPrimary,
  },
});
