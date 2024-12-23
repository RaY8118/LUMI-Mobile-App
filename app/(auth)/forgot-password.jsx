import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Fontisto from "@expo/vector-icons/Fontisto";
import { handleReset } from "@/services/authService";
import { Link } from "expo-router";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        onPress={() => handleReset(email, setIsLoading, setEmail)}
        disabled={isLoading}
        className={`${
          isLoading ? "bg-gray-400" : "bg-violet-800"
        } py-2 px-5 rounded-3xl items-center mt-2 w-32 self-center`}
      >
        <Text className="text-white font-pbold text-lg">
          {isLoading ? "Sending..." : "Send"}
        </Text>
      </TouchableOpacity>

      <View className="mt-4 flex-row justify-center items-center">
        <Text className="font-plight text-lg">Back to Login </Text>
        <Link href="/login">
          <Text className="text-violet-500 font-pregular text-lg">
            click here!{" "}
          </Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
