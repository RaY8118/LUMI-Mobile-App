import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="(tabs)/main" options={{ headerTitle: "Main" }} />
      <Stack.Screen
        name="(auth)/register"
        options={{ headerTitle: "Register" }}
      />
      <Stack.Screen name="(auth)/login" options={{ headerTitle: "Login" }} />
      <Stack.Screen name="(tabs)/map" options={{ headerTitle: "Map" }} />
    </Stack>
  );
}
