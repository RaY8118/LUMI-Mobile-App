import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@/constants/Icons";
import { handleReset } from "@/services/authService";
import { Link } from "expo-router";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (

    <SafeAreaView className="flex-1 justify-center p-6 pt-6 bg-purple-100 rounded-xl">
      <View className="mb-8">
        <Text className="text-4xl font-bold text-purple-600 text-center">
          Reset Password
        </Text>
        <Text className="text-center text-base text-gray-500 mt-2">
          We'll send a password reset link to your email
        </Text>
      </View>

      <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-6 shadow-sm">
        <Icon name="email" size={24} color="gray" library="Fontisto" />
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          className="flex-1 ml-3 text-base text-gray-800 font-pmedium"
          placeholderTextColor="#A0AEC0"
        />
      </View>

      <TouchableOpacity
        onPress={() => handleReset(email, setIsLoading, setEmail)}
        disabled={isLoading}
        className={`${isLoading ? "bg-gray-400" : "bg-purple-600"
          } rounded-2xl py-3 items-center mb-6`}
      >
        <Text className="text-white font-pbold text-lg">
          {isLoading ? "Sending..." : "Send"}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-600">
          Back to Sign In{" "}
        </Text>
        <Link href="/sign-in">
          <Text className="text-purple-600 font-medium">Click here</Text>
        </Link>
      </View>

    </SafeAreaView>
  );
};

export default ForgotPassword;
