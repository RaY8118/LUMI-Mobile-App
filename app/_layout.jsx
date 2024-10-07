import { Stack, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Moonshine-Regular": require("../assets/fonts/Moonshine-Regular.ttf"),
    "Moonshine-Bold": require("../assets/fonts/Moonshine-Bold.ttf"),
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "Dancing-Script-Bold": require("../assets/fonts/DancingScript/DancingScript-Bold.ttf"),
    "Dancing-Script-Regular": require("../assets/fonts/DancingScript/DancingScript-Regular.ttf"),
    "Dancing-Script-SemiBold": require("../assets/fonts/DancingScript/DancingScript-SemiBold.ttf"),
    "Dancing-Script-Medium": require("../assets/fonts/DancingScript/DancingScript-Medium.ttf"),
    "Playfair-Display-Bold": require("../assets/fonts/PlayfairDisplay/PlayfairDisplaySC-Bold.ttf"),
    "Playfair-Display-Regular": require("../assets/fonts/PlayfairDisplay/PlayfairDisplaySC-Regular.ttf"),
    "Playfair-Display-Black": require("../assets/fonts/PlayfairDisplay/PlayfairDisplaySC-Black.ttf"),
    "Playfair-Display-BlackItalic": require("../assets/fonts/PlayfairDisplay/PlayfairDisplaySC-BlackItalic.ttf"),
    "Playfair-Display-Italic": require("../assets/fonts/PlayfairDisplay/PlayfairDisplaySC-Italic.ttf"),
    "Playfair-Display-BoldItalic": require("../assets/fonts/PlayfairDisplay/PlayfairDisplaySC-BoldItalic.ttf"),
    "PressStart2P-Regular": require("../assets/fonts/PressStart2P-Regular.ttf"),
    "NotoSerif-Regular": require("../assets/fonts/NotoSerif/NotoSerif-Regular.ttf"),
    "NotoSerif-Bold": require("../assets/fonts/NotoSerif/NotoSerif-Bold.ttf"),
    "NotoSerif-Black": require("../assets/fonts/NotoSerif/NotoSerif-Black.ttf"),
    "NotoSerif-Thin": require("../assets/fonts/NotoSerif/NotoSerif-Thin.ttf"),
    "NotoSerif-Medium": require("../assets/fonts/NotoSerif/NotoSerif-Medium.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
