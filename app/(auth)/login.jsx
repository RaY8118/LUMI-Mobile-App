import { View, TextInput, Button, Alert, Text } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const router = useRouter(); // Ensure this is imported if not already
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://192.168.0.116:5000/login", {
        email,
        password,
      });

      const userData = response.data.user
      await AsyncStorage.setItem("userData", JSON.stringify(userData) )
      setEmail("")
      setPassword("")
      Alert.alert("Success", response.data.message);
      router.push("/map"); // Redirect to home or another appropriate route
    } catch (error) {
      if (error.response && error.response.data) {
        Alert.alert("Error", error.response.data.message || "Failed to login");
      } else {
        Alert.alert("Error", "Failed to login");
      }
    }
  };

  return (
    <View className="flex-1 justify-center p-4 m-6 pt-2 border border-black rounded-xl">
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
      <Button title="Submit" onPress={handleLogin} />
      <View className="mt-4 flex-row justify-center items-center">
        <Text className="text-xl">Don't have an account? </Text>
        <Link href="/register">
          <Text className="text-blue-500 text-xl">Click here to register</Text>
        </Link>
      </View>
    </View>
  );
};

export default Login;
