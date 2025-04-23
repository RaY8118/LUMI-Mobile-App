import { Stack, } from "expo-router";
import { UserProvider } from "@/contexts/userContext";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react";


SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  useEffect(() => {
    const prepare = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      await SplashScreen.hideAsync()
    }
    prepare()
  }, [])

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
