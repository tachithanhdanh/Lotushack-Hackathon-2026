import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import BottomTabBar, { TabItem } from '../components/BottomTabBar';
import { LiveGreenRingContent } from './LiveGreenRingScreen';
import { JourneyContent } from './JourneyScreen';
import { ImpactsContent } from './ImpactsScreen';
import { RewardsContent } from './RewardsScreen';

type TabKey = 'Home' | 'Journey' | 'Impacts' | 'Rewards';

const TABS: TabItem[] = [
  { key: 'Home',    icon: 'home-outline',      label: 'Home' },
  { key: 'Journey', icon: 'navigation-variant', label: 'Journey' },
  { key: 'Impacts', icon: 'leaf',               label: 'Impacts' },
  { key: 'Rewards', icon: 'gift-outline',        label: 'Rewards' },
];

function RewardsPlaceholder() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Rewards coming soon</Text>
    </View>
  );
}

/**
 * Shell screen that hosts all bottom-tab content.
 * All tab panes are kept mounted; the active one is brought to front via
 * zIndex — no navigation.navigate() calls on tab switch, zero slide animations.
 */
export default function MainTabScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<TabKey>('Home');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.content}>
        {/* Home — Live Green Ring */}
        <View
          style={[styles.tabPane, { zIndex: activeTab === 'Home' ? 1 : 0 }]}
          pointerEvents={activeTab === 'Home' ? 'auto' : 'none'}
        >
          <LiveGreenRingContent />
        </View>

        {/* Journey */}
        <View
          style={[styles.tabPane, { zIndex: activeTab === 'Journey' ? 1 : 0 }]}
          pointerEvents={activeTab === 'Journey' ? 'auto' : 'none'}
        >
          <JourneyContent navigation={navigation} />
        </View>

        {/* Impacts */}
        <View
          style={[styles.tabPane, { zIndex: activeTab === 'Impacts' ? 1 : 0 }]}
          pointerEvents={activeTab === 'Impacts' ? 'auto' : 'none'}
        >
          <ImpactsContent />
        </View>

        <View
          style={[styles.tabPane, { zIndex: activeTab === 'Rewards' ? 1 : 0 }]}
          pointerEvents={activeTab === 'Rewards' ? 'auto' : 'none'}
        >
          <RewardsContent />
        </View>
      </View>

      <BottomTabBar
        tabs={TABS}
        activeKey={activeTab}
        onPress={(key) => setActiveTab(key as TabKey)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1 },
  tabPane: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
});
