import { Stack, } from "expo-router";
import { UserProvider } from "@/contexts/userContext";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <UserProvider>
      <StatusBar style="dark" hidden={false} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false, animation: "slide_from_right" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false, presentation: "modal", animation: "slide_from_bottom" }} />
      </Stack>
    </UserProvider>
  );
}
