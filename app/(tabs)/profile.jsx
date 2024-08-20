import { View, Text, Button, Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          setUser(decoded);
          setToken(storedToken);
        } catch (error) {
          console.error("Token decoding error:", error);
          router.replace("/login");
        }
      } else {
        router.replace("/login");
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    Alert.alert("Sucess", "Logout Succesfull");
    router.replace("/login");
  };
  return (
    <View className="flex-1 justify-center items-center p-4 ">
      <Text>Profile Page</Text>
      {user ? (
        <>
          <Text className="text-3xl py-1 mb-5 text-center ">
            Welcome, {user.sub.name}
          </Text>
          <Text className=" p-2">Email: {user.sub.email}</Text>
          <Text className=" p-2">Mobile: {user.sub.mobile}</Text>
          <Text className=" p-2 m-2">
            Role:{" "}
            {user.sub.role === "CG"
              ? "Care Giver"
              : user.role === "PAT"
              ? "Patient"
              : "Doctor"}
          </Text>
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: "#3b82f6", // Tailwind's bg-blue-500
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "#ffffff", fontWeight: "bold" }}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Loading user data...</Text>
      )}
    </View>
  );
};

export default Profile;
