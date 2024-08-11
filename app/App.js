import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Stack />
    </View>
  );
}
