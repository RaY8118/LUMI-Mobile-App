import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
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
            router.replace("/login");
          }
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.replace("/login");
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
      <Link href="/register" className="text-blue-500 text-lg">
        Register
      </Link>
      <Link href="/login" className="text-blue-500 text-lg mt-4">
        Login
      </Link>
    </View>
  );
};

export default HomeScreen;
