import { View, Text } from "react-native";
import { Link } from "expo-router";
export default function HomeScreen() {
  return (
    <View classNmae="flex-1 justify-center p-4">
      <Text>Home</Text>
      <Link href={"register"}>Register</Link>
    </View>
  );
}
