import {
  View,
  TextInput,
  Alert,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import images from "../../constants/images";

const Login = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        email,
        password,
      });

      const token = response.data.token;
      await SecureStore.setItemAsync("token", token);
      navigation.reset({
        index: 0,
        routes: [{ name: "index" }],
      });
      setEmail("");
      setPassword("");
      Alert.alert("Success", response.data.message);
      router.push("/main");
    } catch (error) {
      if (error.response && error.response.data) {
        Alert.alert("Error", error.response.data.message || "Failed to login");
      } else {
        Alert.alert("Error", "Failed to login");
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center p-4 m-6 pt-2 mt-14 border border-x-2 border-violet-400 rounded-xl">
      <View>
        <Image
          source={images.loginImg}
          resizeMode="contain"
          className="self-center"
        />
      </View>
      <Text className="text-5xl py-2 mb-3 text-center font-bold text-violet-800">
        Login
      </Text>
      <Text className="text-xl py-3 mb-4 text-center font-bold">
        Sign in to continue
      </Text>
      <View className="flex-row items-center p-4">
        <Fontisto name="email" size={32} color="black" className="mr-4" />
        <TextInput
          className="h-12 w-80 border-2 border-black px-3 rounded-3xl ml-4 bg-white"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View className="flex-row items-center p-4">
        <MaterialIcons name="password" size={32} color="black" />
        <TextInput
          className="h-12 w-80 border-2 border-black  px-3 rounded-3xl ml-4 bg-white"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-violet-800 py-2 px-5 rounded-3xl  items-center mt-2 w-32 self-center"
      >
        <Text className="text-white font-bold text-lg">Login</Text>
      </TouchableOpacity>
      <View className="mt-4 flex-row justify-center items-center">
        <Text className="text-xl ">Don't have an account? </Text>
        <Link href="/register">
          <Text className="text-violet-500 text-xl">Register</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Login;
