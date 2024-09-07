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
    <>
      <View className="flex-row items-start m-3 mt-5">
        <View className="ml-2 flex-1 border border-black pt-4 pl-4 rounded-2xl bg-cyan-300">
          <Text className="text-3xl font-pbold mb-4">Profile Page</Text>
          {user ? (
            <>
              <Text className="text-3xl font-pregular py-1 mb-5">
                Welcome, {user.name}
              </Text>
              <Text className="p-2 text-xl font-pregular">
                <Text className="text-xl font-pbold">Email:</Text> {user.email}
              </Text>
              <Text className="p-2 text-xl font-pregular">
                <Text className="text-xl font-pbold">Mobile:</Text>{" "}
                {user.mobile}
              </Text>
              <Text className="p-2 text-xl font-pregular">
                <Text className="text-xl font-pbold">Role: </Text>
                {user.role === "CG"
                  ? "Care Giver"
                  : user.role === "PAT"
                  ? "Patient"
                  : "Doctor"}
              </Text>
              {user.role === "PAT" && (
                <>
                  <Text className="text-xl font-pbold mb-2">Caregivers:</Text>
                  <FlatList
                    data={user.caregivers}
                    keyExtractor={(item) => item.CGId}
                    renderItem={({ item }) => (
                      <View className="p-4 border-b border-gray-300">
                        <Text className="font-pregular text-lg">
                          <Text className="text-xl font-pmedium">Name:</Text>{" "}
                          {item.name}
                        </Text>
                        <Text className="font-pregular text-lg">
                          <Text className="text-xl font-pmedium">Mobile:</Text>{" "}
                          {item.mobile}
                        </Text>
                      </View>
                    )}
                    ListEmptyComponent={
                      <Text className="text-gray-500">
                        No caregivers available.
                      </Text>
                    }
                  />
                </>
              )}
            </>
          ) : (
            <Text>Loading user data...</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-blue-500 p-2 m-2 rounded-md items-center"
        >
          <Text className="text-white font-pbold">Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Profile;
