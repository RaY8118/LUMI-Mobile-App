import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useRouter } from "expo-router";

const Profile = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [user, setUser] = useState(null);
  const [patientId, setPatientId] = useState("");
  const router = useRouter();

  // Fetch user data function defined outside of useEffect
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

  useEffect(() => {
    fetchUserData(); // Call fetchUserData on component mount
  }, [router]);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    Alert.alert("Success", "Logout Successful");
    router.replace("/login");
  };

  const addPatient = async () => {
    try {
      console.log(patientId);
      console.log(user.userId);
      const response = await axios.post(`${apiUrl}/add-patient`, {
        PATId: patientId,
        CGId: user.userId, // Assuming the current user is a caregiver
      });
      Alert.alert("Success", response.data.message);
      onRefresh();
    } catch (error) {
      const errorMessage = error.response?.data?.error;
      console.log(errorMessage);
    }
  };

  const deletePatient = async () => {
    try {
      const response = await axios.post(`${apiUrl}/delete-patient`, {
        PATId: patientId,
        CGId: user.userId, // Assuming the current user is a caregiver
      });
      Alert.alert("Success", response.data.message);
      onRefresh();
    } catch (error) {
      const errorMessage = error.response?.data?.error;
      console.log(errorMessage);
    }
  };

  // onRefresh now correctly references fetchUserData
  const onRefresh = useCallback(() => {
    fetchUserData();
  }, []);

  return (
    <SafeAreaView className="bg-indigo-300 h-full">
      <View className="flex-row items-start m-3 mt-5">
        <View className="ml-2 flex-1 justify-center items-start border border-black pt-4 pl-4 rounded-2xl bg-white">
          {user ? (
            <>
              <Text className="text-3xl font-nsregular py-1 pl-2">
                {user.name}
              </Text>
              <Text className="p-2 text-xl font-nsregular">
                <Text className="text-xl font-nsblack">Email:</Text>{" "}
                {user.email}
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

              {/* Patient Management Section */}
              {user.role === "CG" && (
                <>
                  <Text className="text-xl font-nsblack mb-2">
                    Manage Patients:
                  </Text>
                  <TextInput
                    placeholder="Patient ID"
                    value={patientId}
                    onChangeText={setPatientId}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      marginBottom: 10,
                      padding: 10,
                    }}
                  />
                  <TouchableOpacity
                    onPress={addPatient}
                    className="bg-blue-500 p-2 rounded-md mb-2"
                  >
                    <Text className="text-white font-pbold">Add Patient</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={deletePatient}
                    className="bg-red-500 p-2 rounded-md"
                  >
                    <Text className="text-white font-pbold">
                      Delete Patient
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {user.role === "CG" && (
                <>
                  <Text className="text-xl font-nsblack mb-2">Patients:</Text>
                  <FlatList
                    data={user.patients}
                    keyExtractor={(item) => item.PATId}
                    renderItem={({ item }) => (
                      <View className="p-4 border-b border-gray-300">
                        <Text className="font-nsblack text-lg">
                          <Text className="text-xl font-nsblack">
                            Patient ID:
                          </Text>{" "}
                          {item.PATId}
                        </Text>
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
      </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-blue-500 p-2 m-4 rounded-md items-center"
        >
          <Text className="text-white font-pbold">Logout</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;