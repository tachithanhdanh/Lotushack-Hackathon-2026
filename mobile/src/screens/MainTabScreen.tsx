import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import BottomTabBar, { TabItem } from '../components/BottomTabBar';
import { LiveGreenRingContent } from './LiveGreenRingScreen';
import { ImpactsContent } from './ImpactsScreen';

type TabKey = 'LiveGreenRing' | 'Impacts' | 'Rewards';

const TABS: TabItem[] = [
  { key: 'TascoHome',     icon: 'home-outline', label: 'Trang chủ' },
  { key: 'LiveGreenRing', icon: 'map',          label: 'Hành trình' },
  { key: 'Impacts',       icon: 'leaf',         label: 'Tác động' },
  { key: 'Rewards',       icon: 'gift-outline', label: 'Phần thưởng' },
];

/**
 * Shell screen that hosts all bottom-tab content in a single component.
 *
 * Both tab views are kept mounted at all times. The active one is brought
 * to the front via zIndex — no navigation.navigate() calls, so there are
 * zero re-renders or slide animations when switching tabs.
 *
 * "Trang chủ" is the only tab that triggers real navigation (back to the
 * TascoHome stack screen).
 */
export default function MainTabScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<TabKey>('LiveGreenRing');

  const handleTabPress = (key: string) => {
    if (key === 'TascoHome') {
      navigation.navigate('TascoHome');
      return;
    }
    if (key === 'Rewards') return; // placeholder — not yet implemented
    setActiveTab(key as TabKey);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.content}>
        {/* Hành trình tab */}
        <View
          style={[styles.tabPane, { zIndex: activeTab === 'LiveGreenRing' ? 1 : 0 }]}
          pointerEvents={activeTab === 'LiveGreenRing' ? 'auto' : 'none'}
        >
          <LiveGreenRingContent />
        </View>

        {/* Tác động tab */}
        <View
          style={[styles.tabPane, { zIndex: activeTab === 'Impacts' ? 1 : 0 }]}
          pointerEvents={activeTab === 'Impacts' ? 'auto' : 'none'}
        >
          <ImpactsContent />
        </View>
      </View>

      <BottomTabBar tabs={TABS} activeKey={activeTab} onPress={handleTabPress} />
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
});
