import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await AsyncStorage.getItem('userData');
      setLoading(false); // Stop loading after checking storage
      if (userData) {
        // Redirect to the main screen if user data exists
        router.replace('/main');
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
