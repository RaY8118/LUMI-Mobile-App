import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
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
          if (decodedToken.sub.userId) {
            router.replace("/main");
          } else {
            router.replace("/sign-in");
          }
        } else {
          router.replace("/sign-in");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.replace("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-3xl font-bold mb-4">Welcome to Lumi</Text>
      <Link href="/sign-up" className="text-blue-500 text-lg">
        Sign Up
      </Link>
      <Link href="/sign-in" className="text-blue-500 text-lg mt-4">
        Sign In
      </Link>
    </View>
  );
};

export default HomeScreen;
