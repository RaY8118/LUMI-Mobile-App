import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useUser } from "@/contexts/userContext";
import { Icon } from "@/constants/Icons";
const Profile = () => {
  const { user, setUser, isLoading, refetch } = useUser(); // Access user from context
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    Alert.alert("Success", "Logout Successful");
    setUser(null);
    router.replace("/login");
    refetch(); // After logout refetch data to clear the user from the context
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <SafeAreaView className="bg-indigo-300 h-full">
      <View className="flex-row items-start m-3 mt-5">
        <View className="ml-2 flex-1 justify-center items-start border border-black pt-4 pl-4 rounded-2xl bg-white w-full md:w-11/12 lg:w-10/12">
          {user ? (
            <View>
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
                <Text className="text-xl font-nsblack">Family ID:</Text>{" "}
                {user.familyId}
              </Text>
              <Text className="p-2 text-xl font-nsregular">
                <Text className="text-xl font-nsblack">Role:</Text>{" "}
                {user.role === "CG"
                  ? "Care Giver"
                  : user.role === "PAT"
                  ? "Patient"
                  : "Doctor"}
              </Text>
              <View className="h-1/4">
                <FlatList
                  data={user.members}
                  keyExtractor={(item) => item.userId}
                  renderItem={({ item }) => (
                    <View className="p-4 border-b border-gray-300">
                      <Text className="font-nsblack text-lg">
                        <Text className="text-xl font-nsblack">Name:</Text>{" "}
                        {item.name}
                      </Text>
                    </View>
                  )}
                  ListEmptyComponent={
                    <Text className="text-gray-500">No members added.</Text>
                  }
                />
              </View>
            </View>
          ) : (
            <Text>Loading user data...</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={handleLogout}
        className="inline-flex items-center justify-center p-4 bg-blue-500 rounded-full border-2 border-white w-1/3"
      >
        <Icon
          name="logout"
          size={50}
          library="MaterialCommunityIcons"
          color="white"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;
