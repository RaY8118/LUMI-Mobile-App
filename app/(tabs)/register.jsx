import { View, TextInput, Button, Alert, Text } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";

const Register = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      console.log("Submitting form with:", { name, email, password });

      const response = await axios.post("http://192.168.0.104:5000/register", {
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
      <Text className="text-3xl py-2 m-6">Register</Text>
      <TextInput
        className="h-10 border border-gray-300 mb-2 px-2 m-6"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
      <Button className="m-6" title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default Register;
