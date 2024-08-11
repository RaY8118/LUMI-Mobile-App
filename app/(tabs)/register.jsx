import { View, TextInput, Button, Alert, Text } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { useRouter, Link } from "expo-router";

const Register = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      console.log("Submitting form with:", { name, email, password });

      const response = await axios.post("http://192.168.0.102:5000/register", {
        name,
        email,
        password,
      });

      setName("");
      setEmail("");
      setPassword("");

      console.log("Response:", response);
      Alert.alert("Success", response.data.message);
      router.push("/(tabs)/login");
    } catch (error) {
      console.error("Error:", error.response || error.message);
      if (error.response && error.response.data) {
        Alert.alert(
          "Error",
          error.response.data.message || "Failed to submit form"
        );
      } else {
        Alert.alert("Error", "Failed to submit form");
      }
    }
  };

  return (
    <View className="flex-1 justify-center p-4">
      <Text className="text-3xl py-2 mb-6 text-center">Register</Text>
      <TextInput
        className="h-12 border border-gray-300 mb-4 px-3 rounded"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="h-12 border border-gray-300 mb-4 px-3 rounded"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        className="h-12 border border-gray-300 mb-4 px-3 rounded"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button title="Submit" onPress={handleSubmit} />
      <View className="mt-4 flex-row justify-center items-center">
        <Text>Already have an account? </Text>
        <Link href="/login">
          <Text className="text-blue-500">Click here to Login</Text>
        </Link>
      </View>
    </View>
  );
};

export default Register;
