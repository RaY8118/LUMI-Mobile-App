import React from "react";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

const App = () => {
  return (
    <>
      <StatusBar backgroundColor="" style="dark" hidden={false} />
      <Stack>
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default App;
