import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme/colors";

type RewardCategory = "All" | "VETC Toll" | "Fuel" | "EV Charging" | "Insurance";

type RewardItem = {
  id: string;
  partner: string;
  title: string;
  points: number;
  category: RewardCategory;
  voucherCode: string;
};

type BadgeItem = {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  description: string;
};

const INITIAL_POINTS = 1200;

const FILTERS: RewardCategory[] = ["All", "VETC Toll", "Fuel", "EV Charging", "Insurance"];

const REWARDS: RewardItem[] = [
  {
    id: "fuel-discount",
    partner: "Tasco x Esky Fast Charge",
    title: "20% discount for gasoline refill",
    points: 400,
    category: "Fuel",
    voucherCode: "FUEL20",
  },
  {
    id: "fast-charge-pack",
    partner: "Tasco x Esky Fast Charge",
    title: "3 free fast-charge sessions",
    points: 1300,
    category: "EV Charging",
    voucherCode: "FAST3X",
  },
  {
    id: "ev-discount",
    partner: "Tasco x Esky Fast Charge",
    title: "35% off EV charging (Tasco Auto purchases)",
    points: 650,
    category: "EV Charging",
    voucherCode: "EV35OFF",
  },
  {
    id: "fuel-next-fill",
    partner: "Petrolimex / PVOIL partner",
    title: "5% off next fuel fill-up",
    points: 250,
    category: "Fuel",
    voucherCode: "FUEL5NEXT",
  },
  {
    id: "vetc-pass",
    partner: "Tasco x VETC",
    title: "50,000 VND ETC balance bonus",
    points: 300,
    category: "VETC Toll",
    voucherCode: "VETC50K",
  },
  {
    id: "insurance-care",
    partner: "Tasco Insurance",
    title: "10% off annual motor insurance",
    points: 900,
    category: "Insurance",
    voucherCode: "SAFE10",
  },
];

const BADGES: BadgeItem[] = [
  {
    id: "streak",
    label: "Streak Leader",
    icon: "fire",
    description: "Claim rewards for 7 days in a row to keep your streak hot.",
  },
  {
    id: "carbon",
    label: "Carbon King",
    icon: "trophy-outline",
    description: "Reach the top tier of carbon-saving missions this month.",
  },
  {
    id: "active",
    label: "Active Warrior",
    icon: "run-fast",
    description: "Complete 10 green journeys and unlock active commuter perks.",
  },
  {
    id: "green",
    label: "Green Driver",
    icon: "leaf",
    description: "Maintain an eco score above 90 for three consecutive weeks.",
  },
  {
    id: "toll-master",
    label: "Toll Master",
    icon: "road-variant",
    description: "Pass through 20 ETC gates smoothly and save peak-hour time.",
  },
  {
    id: "charge-pro",
    label: "Charge Pro",
    icon: "ev-station",
    description: "Complete 8 charging sessions with Tasco partner stations.",
  },
  {
    id: "eco-family",
    label: "Eco Family",
    icon: "account-group-outline",
    description: "Invite 3 friends to join the green mobility rewards program.",
  },
];

function RewardPill({
  label,
  count,
  active,
  onPress,
}: {
  label: RewardCategory;
  count: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.filterPill, active && styles.filterPillActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>{label}</Text>
      <View style={styles.filterCountWrap}>
        <Text style={styles.filterCountText}>{count}</Text>
      </View>
    </Pressable>
  );
}

function RewardCard({
  item,
  currentPoints,
  claimed,
  onClaim,
}: {
  item: RewardItem;
  currentPoints: number;
  claimed: boolean;
  onClaim: () => void;
}) {
  const affordable = currentPoints >= item.points;
  const claimLabel = claimed
    ? "Claimed"
    : affordable
      ? "Claim Now"
      : `Need ${item.points - currentPoints} pts`;

  return (
    <View style={styles.rewardCard}>
      <View style={styles.rewardTopRow}>
        <Text style={styles.rewardPartner}>{item.partner}</Text>
        <View
          style={[
            styles.pointsPill,
            affordable ? styles.pointsPillPositive : styles.pointsPillNegative,
          ]}
        >
          <Text
            style={[
              styles.pointsPillText,
              affordable ? styles.pointsTextPositive : styles.pointsTextNegative,
            ]}
          >
            {item.points} pts
          </Text>
        </View>
      </View>

      <Text style={styles.rewardTitle}>{item.title}</Text>

      <View style={styles.rewardDivider} />

      <Pressable
        style={[
          styles.claimButton,
          claimed && styles.claimButtonClaimed,
          !claimed && !affordable && styles.claimButtonLocked,
        ]}
        onPress={onClaim}
      >
        <Text
          style={[
            styles.claimButtonText,
            claimed && styles.claimButtonTextClaimed,
            !claimed && !affordable && styles.claimButtonTextLocked,
          ]}
        >
          {claimLabel}
        </Text>
      </Pressable>
    </View>
  );
}

function BadgeCard({
  item,
  selected,
  onPress,
}: {
  item: BadgeItem;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.badgeCard} onPress={onPress}>
      <View style={[styles.badgeMedal, selected && styles.badgeMedalSelected]}>
        <View style={styles.badgeGlow} />
        <View style={styles.badgeStripe} />
        <View style={styles.badgeCore}>
          <MaterialCommunityIcons name={item.icon} size={34} color="#D8951A" />
        </View>
      </View>
      <Text style={[styles.badgeLabel, selected && styles.badgeLabelSelected]}>{item.label}</Text>
    </Pressable>
  );
}

export function RewardsContent() {
  const [selectedFilter, setSelectedFilter] = React.useState<RewardCategory>("All");
  const [points, setPoints] = React.useState(INITIAL_POINTS);
  const [claimedIds, setClaimedIds] = React.useState<string[]>([]);
  const [walletOpen, setWalletOpen] = React.useState(false);
  const [showAllBadges, setShowAllBadges] = React.useState(false);
  const [selectedBadgeId, setSelectedBadgeId] = React.useState(BADGES[0].id);
  const [statusText, setStatusText] = React.useState("Tap a reward to claim it into your wallet.");

  const selectedBadge = React.useMemo(
    () => BADGES.find((item) => item.id === selectedBadgeId) ?? BADGES[0],
    [selectedBadgeId],
  );

  const filteredRewards = React.useMemo(() => {
    if (selectedFilter === "All") {
      return REWARDS;
    }

    return REWARDS.filter((item) => item.category === selectedFilter);
  }, [selectedFilter]);

  const claimedRewards = React.useMemo(
    () => REWARDS.filter((item) => claimedIds.includes(item.id)),
    [claimedIds],
  );

  const visibleBadges = showAllBadges ? BADGES : BADGES.slice(0, 3);

  const getFilterCount = (label: RewardCategory) => {
    if (label === "All") {
      return REWARDS.length;
    }

    return REWARDS.filter((item) => item.category === label).length;
  };

  const handleClaim = (item: RewardItem) => {
    if (claimedIds.includes(item.id)) {
      setWalletOpen(true);
      setStatusText(`Voucher ${item.voucherCode} is already in your wallet.`);
      return;
    }

    if (points < item.points) {
      setStatusText(`You need ${item.points - points} more points to claim this reward.`);
      return;
    }

    setPoints((current) => current - item.points);
    setClaimedIds((current) => [...current, item.id]);
    setWalletOpen(true);
    setStatusText(`Claimed ${item.voucherCode}. Check Voucher Wallet to use it.`);
  };

  return (
    <View style={styles.root}>
      <View style={styles.glowTop} pointerEvents="none" />
      <View style={styles.glowRight} pointerEvents="none" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Rewards</Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceValue}>{points}</Text>
          <Text style={styles.balanceMeta}>
            Green Points ~ <Text style={styles.balanceMoney}>{points} VND</Text>
          </Text>

          <Pressable style={styles.walletButton} onPress={() => setWalletOpen((current) => !current)}>
            <MaterialCommunityIcons
              name="wallet-giftcard"
              size={18}
              color={Colors.textOnPrimary}
            />
            <Text style={styles.walletButtonText}>
              {walletOpen ? "Hide Voucher Wallet" : `Voucher Wallet (${claimedRewards.length})`}
            </Text>
          </Pressable>

          <Text style={styles.statusText}>{statusText}</Text>

          {walletOpen ? (
            <View style={styles.walletPanel}>
              {claimedRewards.length > 0 ? (
                claimedRewards.map((item, index) => (
                  <View
                    key={item.id}
                    style={[
                      styles.walletRow,
                      index < claimedRewards.length - 1 && styles.walletRowSpacing,
                    ]}
                  >
                    <View style={styles.walletIconWrap}>
                      <MaterialCommunityIcons
                        name="ticket-percent-outline"
                        size={18}
                        color={Colors.primary}
                      />
                    </View>
                    <View style={styles.walletTextWrap}>
                      <Text style={styles.walletVoucherTitle}>{item.title}</Text>
                      <Text style={styles.walletVoucherMeta}>Code: {item.voucherCode}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.walletEmptyText}>No vouchers yet. Claim one below.</Text>
              )}
            </View>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>Claim Rewards</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {FILTERS.map((item, index) => (
            <View key={item} style={index < FILTERS.length - 1 ? styles.filterGap : null}>
              <RewardPill
                label={item}
                count={getFilterCount(item)}
                active={selectedFilter === item}
                onPress={() => setSelectedFilter(item)}
              />
            </View>
          ))}
        </ScrollView>

        {filteredRewards.map((item) => (
          <RewardCard
            key={item.id}
            item={item}
            currentPoints={points}
            claimed={claimedIds.includes(item.id)}
            onClaim={() => handleClaim(item)}
          />
        ))}

        <View style={styles.badgesHeader}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <Pressable onPress={() => setShowAllBadges((current) => !current)}>
            <Text style={styles.viewAllText}>{showAllBadges ? "Show Less" : "View All"}</Text>
          </Pressable>
        </View>

        <View style={styles.badgesPanel}>
          <View style={styles.badgesGrid}>
            {visibleBadges.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.badgeCell,
                  index < visibleBadges.length - 3 && styles.badgeRowGap,
                ]}
              >
                <BadgeCard
                  item={item}
                  selected={selectedBadgeId === item.id}
                  onPress={() => setSelectedBadgeId(item.id)}
                />
              </View>
            ))}
          </View>

          <View style={styles.badgeInfoCard}>
            <Text style={styles.badgeInfoTitle}>{selectedBadge.label}</Text>
            <Text style={styles.badgeInfoText}>{selectedBadge.description}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  glowTop: {
    position: "absolute",
    top: -40,
    left: -24,
    width: 180,
    height: 220,
    borderRadius: 999,
    backgroundColor: Colors.haloMint,
    opacity: 0.9,
  },
  glowRight: {
    position: "absolute",
    top: 8,
    right: -42,
    width: 170,
    height: 200,
    borderRadius: 999,
    backgroundColor: Colors.routeBlueLight,
    opacity: 0.28,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.ink,
    marginBottom: 18,
  },
  balanceCard: {
    borderRadius: 18,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 4,
    marginBottom: 20,
  },
  balanceValue: {
    fontSize: 42,
    fontWeight: "800",
    color: Colors.primary,
  },
  balanceMeta: {
    marginTop: 2,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  balanceMoney: {
    color: Colors.primary,
    fontWeight: "700",
  },
  walletButton: {
    marginTop: 16,
    alignSelf: "stretch",
    borderRadius: 8,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  walletButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },
  statusText: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  walletPanel: {
    marginTop: 14,
    alignSelf: "stretch",
    borderRadius: 14,
    backgroundColor: Colors.surfaceMuted,
    padding: 12,
  },
  walletRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletRowSpacing: {
    marginBottom: 10,
  },
  walletIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  walletTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  walletVoucherTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.ink,
  },
  walletVoucherMeta: {
    marginTop: 2,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  walletEmptyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  filtersRow: {
    paddingRight: 20,
    marginBottom: 14,
  },
  filterGap: {
    marginRight: 8,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterPillActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  filterLabelActive: {
    color: Colors.primary,
  },
  filterCountWrap: {
    marginLeft: 8,
    minWidth: 22,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  filterCountText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  rewardCard: {
    borderRadius: 14,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.card,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  rewardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rewardPartner: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    marginRight: 10,
  },
  pointsPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  pointsPillPositive: {
    backgroundColor: "#E8FFF0",
    borderColor: "#B7F0C6",
  },
  pointsPillNegative: {
    backgroundColor: "#FFF0F0",
    borderColor: "#FFD0D0",
  },
  pointsPillText: {
    fontSize: 12,
    fontWeight: "700",
  },
  pointsTextPositive: {
    color: Colors.primary,
  },
  pointsTextNegative: {
    color: Colors.error,
  },
  rewardTitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: Colors.ink,
  },
  rewardDivider: {
    marginTop: 14,
    height: 1,
    backgroundColor: Colors.card,
  },
  claimButton: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  claimButtonClaimed: {
    opacity: 0.75,
  },
  claimButtonLocked: {
    opacity: 0.7,
  },
  claimButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
  },
  claimButtonTextClaimed: {
    color: Colors.textSecondary,
  },
  claimButtonTextLocked: {
    color: Colors.error,
  },
  badgesHeader: {
    marginTop: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
  badgesPanel: {
    borderRadius: 18,
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  badgeCell: {
    width: "33.33%",
    alignItems: "center",
  },
  badgeRowGap: {
    marginBottom: 18,
  },
  badgeCard: {
    width: 92,
    alignItems: "center",
  },
  badgeMedal: {
    width: 82,
    height: 102,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  badgeMedalSelected: {
    transform: [{ scale: 1.04 }],
  },
  badgeGlow: {
    position: "absolute",
    width: 82,
    height: 102,
    borderRadius: 24,
    backgroundColor: "#FFD54F",
  },
  badgeStripe: {
    position: "absolute",
    right: 8,
    width: 12,
    height: 102,
    backgroundColor: "rgba(255,235,140,0.55)",
    transform: [{ rotate: "35deg" }],
  },
  badgeCore: {
    width: 66,
    height: 84,
    borderRadius: 22,
    backgroundColor: "#FFCF40",
    borderWidth: 4,
    borderColor: "#FFE67C",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeLabel: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    color: Colors.textSecondary,
    fontWeight: "600",
    minHeight: 32,
  },
  badgeLabelSelected: {
    color: Colors.ink,
  },
  badgeInfoCard: {
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: Colors.surfaceMuted,
    padding: 14,
  },
  badgeInfoTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.ink,
  },
  badgeInfoText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
});
