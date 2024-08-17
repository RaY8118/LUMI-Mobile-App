import { View, Text, Button, Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Main = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userData");
    Alert.alert("Sucess", "Logout Succesfull");
    router.push("/login");
  };
  return (
    <View className="flex-1 justify-center items-center p-4 ">
      <Text>Main Page</Text>
      {user ? (
        <>
          <Text className="text-3xl py-1 mb-5 text-center ">
            Welcome, {user.name}
          </Text>
          <Text className=" p-2">Email: {user.email}</Text>
          <Text className=" p-2 m-2">
            Role:{" "}
            {user.role == "CG"
              ? "Care Giver"
              : user.role == "PAT"
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
          marginTop: 10
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

export default Main;
