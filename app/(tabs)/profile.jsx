import {
  View,
  Text,
  Button,
  Alert,
  TouchableOpacity,
  FlatList,
  SafeAreaView
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
            console.log(response.data.userData);
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
    Alert.alert("Success", "Logout Succesfull");
    router.replace("/login");
  };
  return (
    <>
    <SafeAreaView className="bg-indigo-300 h-full">
      <View className="flex-row items-start m-3 mt-5">
        <View className="ml-2 flex-1 justify-center items-start border border-black pt-4 pl-4 rounded-2xl bg-white">
          {/* <Text className="text-3xl font-pbold mb-4">Profile Page</Text> */}
          {user ? (
            <>
              <Text className="text-3xl font-nsregular py-1 pl-2">
               {user.name}
              </Text>
              <Text className="p-2 text-xl font-nsregular">
                <Text className="text-xl font-nsblack">Email:</Text> {user.email}
              </Text>
              <Text className="p-2 text-xl font-nsregular">
                <Text className="text-xl font-nsblack">Mobile:</Text>{" "}
                {user.mobile}
              </Text>
              <Text className="p-2 text-xl font-nsregular">
                <Text className="text-xl font-nsblack">Role: </Text>
                {user.role === "CG"
                  ? "Care Giver"
                  : user.role === "PAT"
                  ? "Patient"
                  : "Doctor"}
              </Text>
              {user.role === "PAT" && (
                <>
                  <Text className="text-xl font-nsblack mb-2">Caregivers:</Text>
                  <FlatList
                    data={user.caregivers}
                    keyExtractor={(item) => item.CGId}
                    renderItem={({ item }) => (
                      <View className="p-4 border-b border-gray-300">
                        <Text className="font-nsblack text-lg">
                          <Text className="text-xl font-nsblack">Name:</Text>{" "}
                          {item.name}
                        </Text>
                        <Text className="font-nsblack text-lg">
                          <Text className="text-xl font-nsblack">Mobile:</Text>{" "}
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
              {user.role === "CG" && (
                <>
                  <Text className="p-2 text-xl font-nsblack">Patients:</Text>
                  <FlatList
                    data={user.patients}
                    keyExtractor={(item) => item.PATId}
                    renderItem={({ item }) => (
                      <View className="pl-4 mb-2">
                        <Text className="font-nsmmedium text-lg">
                          <Text className="text-xl font-nsblack">Name:</Text>{" "}
                          {item.name}
                        </Text>
                        <Text className="font-nsmmedium text-lg">
                          <Text className="text-xl font-nsblack">Mobile:</Text>{" "}
                          {item.mobile}
                        </Text>
                      </View>
                    )}
                    ListEmptyComponent={
                      <Text className="text-gray-500 pl-2 mb-2">
                        No patients available.
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
      </SafeAreaView>
    </>
  );
};

export default Profile;
