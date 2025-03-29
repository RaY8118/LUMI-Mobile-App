import React from "react";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

const App = () => {
  return (
    <>
      <StatusBar style="dark" hidden={false} />
      <Stack>
        <Stack.Screen
          name="sign-up"
          options={{ headerShown: false, animation: "fade_from_bottom" }}
        />
        <Stack.Screen
          name="sign-in"
          options={{ headerShown: false, animation: "fade_from_bottom" }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{ headerShown: false, animation: "ios" }}
        />
      </Stack>
    </>
  );
};

export default App;
