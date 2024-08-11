import { View, TextInput, Button, Alert, Text } from "react-native";
import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://192.168.0.104:5000/login", {
        email,
        password,
      });

      Alert.alert("Success", response.data.message);
    } catch (error) {
      if (error.response && error.response.data) {
        Alert.alert("Error", error.response.data.message || "Failed to login");
      } else {
        Alert.alert("Error", "Failed to login");
      }
    }
    router.push("/");
  };
  return (
    <View className="flex-1 justify-center p-4">
      <Text className="text-3xl py-2 m-6">Login </Text>
      <TextInput
        className="h-10 border border-gray-300 mb-2 px-2 m-6"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="h-10 border border-gray-300 mb-2 px-2 m-6"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button className="m-6" title="Submit" onPress={handleLogin} />
    </View>
  );
};

export default Login;
