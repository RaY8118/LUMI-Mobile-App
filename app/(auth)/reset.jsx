import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Fontisto from "@expo/vector-icons/Fontisto";
import axios from "axios";

const Reset = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleReset = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/reset-password`, { email });
      setEmail("");
      Alert.alert("Success", response.data.message);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.response
          ? "Unable to process your request. Please try again."
          : "Check your internet connection and try again.");
      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center p-6 bg-custom-primary rounded-xl">
      <View>
        <Text className="text-5xl py-2 mb-3 text-center font-pbold text-custom-tertiary">
          Reset Password
        </Text>
      </View>
      <View className="flex-row items-center p-4">
        <Fontisto name="email" size={32} color="black" className="mr-4" />
        <TextInput
          className="h-12 flex-1 border-2 border-black px-3 rounded-3xl bg-white font-pmedium ml-4"
          placeholder="Enter your email"
          accessibilityLabel="Email input field"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>
      <TouchableOpacity
        onPress={handleReset}
        disabled={isLoading}
        className={`${
          isLoading ? "bg-gray-400" : "bg-violet-800"
        } py-2 px-5 rounded-3xl items-center mt-2 w-32 self-center`}
      >
        <Text className="text-white font-pbold text-lg">
          {isLoading ? "Sending..." : "Send"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Reset;
