import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Alert,
  Button,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  Provider as PaperProvider,
  MD3LightTheme,
  Appbar,
  Card,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

type RootStackParamList = {
  TascoHome: undefined;
  VehicleControls: undefined;
  LiveGreenRing: undefined;
  Co2Meter: undefined;
  RouteSuggestion: undefined;
  Details: { from: string; count?: number } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppHeader({ options, back, navigation }: any) {
  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={options.title ?? options.route?.name ?? "App"} />
      {!back && (
        <Appbar.Action
          icon="cog"
          onPress={() => Alert.alert("Cài đặt", "Biểu tượng demo")}
        />
      )}
    </Appbar.Header>
  );
}

// Screens are now organized under src/screens
import TascoHomeScreen from "./src/screens/TascoHomeScreen";
import VehicleControlsScreen from "./src/screens/VehicleControlsScreen";
import MainTabScreen from "./src/screens/MainTabScreen";
import Co2MeterScreen from "./src/screens/Co2MeterScreen";
import RouteSuggestionScreen from "./src/screens/RouteSuggestionScreen";
import { colors } from "./src/theme/colors";

const appTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    surface: colors.surface,
    background: colors.background,
    outline: colors.border,
  },
} as typeof MD3LightTheme;

function DetailsScreen({ navigation, route }: any) {
  const { from = "Không rõ", count } = route.params || {};

  return (
    <SafeAreaView style={styles.screen}>
      <Card>
        <Card.Title title="Chi tiết" subtitle={`Từ: ${from}`} />
        <Card.Content>
          {typeof count === "number" && (
            <Text style={styles.subtitle}>Giá trị count nhận: {count}</Text>
          )}
        </Card.Content>
      </Card>

      <View style={styles.row}>
        <Button title="Quay lại" onPress={() => navigation.goBack()} />
        <View style={styles.spacer} />
        <Button
          title="Về trang chủ"
          color="#ef4444"
          onPress={() => navigation.navigate("TascoHome")}
        />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <PaperProvider theme={appTheme}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ header: (props) => <AppHeader {...props} /> }}
          >
            <Stack.Screen
              name="TascoHome"
              component={TascoHomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="VehicleControls"
              component={VehicleControlsScreen}
              options={{ title: "Điểm dịch vụ & Điều khiển" }}
            />
            <Stack.Screen
              name="LiveGreenRing"
              component={MainTabScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Co2Meter"
              component={Co2MeterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RouteSuggestion"
              component={RouteSuggestionScreen}
              options={{ title: "Tuyến đường xanh" }}
            />
            <Stack.Screen name="Details" component={DetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  spacer: {
    width: 12,
  },
  cta: {
    marginTop: 12,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  ctaText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
