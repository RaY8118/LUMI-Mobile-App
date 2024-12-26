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
import CustomButton from "@/components/CustomButton";
const Profile = () => {
  const { user, setUser, isLoading, refetch } = useUser(); // Access user from context
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      setUser(null); // Trigger conditional rendering in the layout
      Alert.alert("Success", "Logout Successful");
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <SafeAreaView className="bg-indigo-300">
      <View className="flex-row items-center m-3 mt-5">
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
      <View className="items-end  border border-black">
        <CustomButton
          onPress={handleLogout}
          bgcolor="bg-red-500"
          name="logout"
          library="AntDesign"
          size={60}
          activeOpacity={0.7}
          color="white"
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
