import {
  View,
  TextInput,
  Button,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from "@react-navigation/native";

// TODO: change the async storage to encrypted storage to handle the JWT authentication
const Login = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter(); // Ensure this is imported if not already
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
        routes: [{ name: "index" }], // Navigate to the main screen or tabs stack
      });
      setEmail("");
      setPassword("");
      Alert.alert("Success", response.data.message);
      router.push("/main"); // Redirect to home or another appropriate route
    } catch (error) {
      if (error.response && error.response.data) {
        Alert.alert("Error", error.response.data.message || "Failed to login");
      } else {
        Alert.alert("Error", "Failed to login");
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center p-4 m-6 pt-2 border border-black rounded-xl">
      <Text className="text-3xl py-2 mb-6 text-center font-bold">Login</Text>
      <TextInput
        className="h-12 border border-gray-600 mb-4 px-3 rounded"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        className="h-12 border border-gray-600 mb-4 px-3 rounded"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#3b82f6", // Tailwind's bg-blue-500
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#ffffff", fontWeight: "bold" }}>Submit</Text>
      </TouchableOpacity>
      <View className="mt-4 flex-row justify-center items-center">
        <Text className="text-xl">Don't have an account? </Text>
        <Link href="/register">
          <Text className="text-blue-500 text-xl">Click here to register</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Login;
