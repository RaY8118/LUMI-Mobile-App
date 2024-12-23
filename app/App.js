import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { UserProvider } from "@/contexts/userContext"
export default function App() {
  return (
    <UserProvider>
      <View style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <Stack />
      </View>
    </UserProvider>
  );
}
