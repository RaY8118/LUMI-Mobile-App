import {
  View,
  Text,
  Button,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useRouter } from "expo-router";

const Profile = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedToken = await SecureStore.getItemAsync("token");

      if (storedToken) {
        try {
          const response = await axios.post(
            `${apiUrl}/get-userdata`,
            {},
            {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );

          if (response.data.status === "success") {
            setUser(response.data.userData);
          } else {
            console.error("Failed to fetch user data", response.data.message);
            router.replace("/login");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          router.replace("/login");
        }
      }
    };

    fetchUserData();
  }, [router]);
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    Alert.alert("Sucess", "Logout Succesfull");
    router.replace("/login");
  };
  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-2xl font-bold mb-4">Profile Page</Text>
      {user ? (
        <>
          <Text className="text-3xl py-1 mb-5 text-center">
            Welcome, {user.name}
          </Text>
          <Text className="p-2">Email: {user.email}</Text>
          <Text className="p-2">Mobile: {user.mobile}</Text>
          <Text className="p-2 m-2">
            Role:{' '}
            {user.role === 'CG'
              ? 'Care Giver'
              : user.role === 'PAT'
              ? 'Patient'
              : 'Doctor'}
          </Text>
          {user.role === 'PAT' && (
            <>
              <Text className="text-lg font-bold mb-2">Caregivers:</Text>
              <FlatList
                data={user.caregivers}
                keyExtractor={(item) => item.CGId}
                renderItem={({ item }) => (
                  <View className="p-4 border-b border-gray-300">
                    <Text>Name: {item.name}</Text>
                    <Text>Mobile: {item.mobile}</Text>
                  </View>
                )}
                ListEmptyComponent={<Text className="text-gray-500">No caregivers available.</Text>}
              />
            </>
          )}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-blue-500 py-2 px-4 rounded-md mt-4"
          >
            <Text className="text-white font-bold">Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Loading user data...</Text>
      )}
    </View>
  );
};

export default Profile;
