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
  TextInput,
  Divider,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
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
          onPress={() => Alert.alert("Settings", "Demo icon")}
        />
      )}
    </Appbar.Header>
  );
}

function HomeScreen({ navigation }: any) {
  const [count, setCount] = React.useState(0);

  return (
    <SafeAreaView style={styles.screen}>
      <Card>
        <Card.Title title="Home" subtitle={`Count: ${count}`} />
        <Card.Content>
          <TextInput
            mode="outlined"
            label="Demo input"
            placeholder="Type something"
            value={String(count)}
            onChangeText={(t) => {
              const n = Number(t);
              if (!Number.isNaN(n)) setCount(n);
            }}
          />
        </Card.Content>
      </Card>
      <Divider />

      <View style={styles.row}>
        <Button title="+1" onPress={() => setCount((c) => c + 1)} />
        <View style={styles.spacer} />
        <Button title="Reset" color="#8b5cf6" onPress={() => setCount(0)} />
      </View>

      <View style={styles.row}>
        <Button
          title="Go to Details"
          onPress={() =>
            navigation.navigate("Details", { from: "Home", count })
          }
        />
        <View style={styles.spacer} />
        <Button
          title="Open expo.dev"
          color="#10b981"
          onPress={() => Linking.openURL("https://expo.dev")}
        />
      </View>

      <Pressable
        style={styles.cta}
        onPress={() => Alert.alert("Hello 👋", "This is a simple alert!")}
      >
        <Text style={styles.ctaText}>Show Alert</Text>
      </Pressable>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

function DetailsScreen({ navigation, route }: any) {
  const { from = "Unknown", count } = route.params || {};

  return (
    <SafeAreaView style={styles.screen}>
      <Card>
        <Card.Title title="Details" subtitle={`From: ${from}`} />
        <Card.Content>
          {typeof count === "number" && (
            <Text style={styles.subtitle}>Received count: {count}</Text>
          )}
        </Card.Content>
      </Card>

      <View style={styles.row}>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
        <View style={styles.spacer} />
        <Button
          title="Go Home"
          color="#ef4444"
          onPress={() => navigation.navigate("Home")}
        />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ header: (props) => <AppHeader {...props} /> }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
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
