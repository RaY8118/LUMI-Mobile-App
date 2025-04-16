import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

const HomeScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          if (decodedToken.sub) {
            router.replace("/reminders");
          } else {
            router.replace("/sign-in");
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-4xl font-bold text-blue-600 mb-3">Welcome to Lumi</Text>
      <Text className="text-base text-gray-700 text-center mb-8">
        Your personal assistant for reminders, safety, and more.
      </Text>

      <Link href="/sign-up" asChild>
        <TouchableOpacity className="bg-blue-600 rounded-2xl px-6 py-3 w-full mb-4">
          <Text className="text-white text-center text-lg font-semibold">Get Started</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/sign-in" asChild>
        <TouchableOpacity className="border border-blue-600 rounded-2xl px-6 py-3 w-full">
          <Text className="text-blue-600 text-center text-lg font-semibold">Already have an account?</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default HomeScreen;
