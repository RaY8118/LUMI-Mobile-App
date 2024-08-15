import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-2xl font-bold mb-4">Welcome to Lumi</Text>
      <Link href="/register" className="text-blue-500 text-lg">
        Register
      </Link>
      <Link href="/login" className="text-blue-500 text-lg">
        Login
      </Link>
      <Link href="/map" className="text-blue-500 text-lg">
        Map
      </Link>
    </View>
  );
}
