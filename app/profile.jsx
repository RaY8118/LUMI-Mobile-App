import {
  View,
  Text,
  Alert,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useUser } from "@/hooks/useUser";
import { usePatient } from "@/hooks/usePatient";
import * as ImagePicker from "expo-image-picker"
import * as ImageManipulator from "expo-image-manipulator"
import { uploadProfileImg } from "@/services/userService"
import * as FileSystem from "expo-file-system"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Icon } from "@/constants/Icons";
import EditForm from "@/components/EditForm"

const CLOUDINARY_URL = process.env.EXPO_PUBLIC_CLOUDINARY_URL
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_UPLOAD_PRESET
const UPLOAD_FOLDER = process.env.EXPO_PUBLIC_UPLOAD_FOLDER

const Profile = () => {
  const { user, setUser, isLoading } = useUser();
  const { PATId, PATName } = usePatient()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const router = useRouter();
  const userId = user?.userId || null
  const familyId = user?.familyId || "Not set"
  const [profileImg, setProfileImg] = useState("")
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  useEffect(() => {
    loadProfileImage()
  }, [user])

  const loadProfileImage = async () => {
    try {
      const savedImg = await AsyncStorage.getItem(`profileImg_${userId}`);

      if (savedImg) {
        if (savedImg.startsWith("http")) {
          setProfileImg(savedImg);
          return;
        }

        const fileInfo = await FileSystem.getInfoAsync(savedImg);
        if (fileInfo.exists) {
          setProfileImg(savedImg);
        } else {
          const cloudinaryUrl = await AsyncStorage.getItem(`profileImg_${userId}_cloud`);
          if (cloudinaryUrl) {
            setProfileImg(cloudinaryUrl);
          } else {
            console.warn("No local or cloud image found");
          }
        }
      }
    } catch (error) {
      console.error("Error loading profile image:", error);
    }
  };


  const selectImage = async (useLibrary) => {
    let result;
    if (useLibrary) {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.75
      })
    } else {
      await ImagePicker.requestCameraPermissionsAsync()
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.75
      })
    }
    if (!result.canceled) {
      const uri = result.assets[0].uri
      await uploadProfileImg(uri, userId, familyId)
      await saveProfileImage(uri, userId)
    }
  }


  const saveProfileImage = async (uri, userId) => {
    try {
      const manipulated = await ImageManipulator.manipulateAsync(
        uri,
        [],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      const dest = manipulated.uri;

      await AsyncStorage.setItem(`profileImg_${userId}`, dest);
      setProfileImg(dest);
      uplaodToCloudinary(dest, userId);
    } catch (error) {
      console.error("Image Save Error:", error);
    }
  };



  const uplaodToCloudinary = async (localUri, userId) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: localUri,
        type: "image/jpeg",
        name: `profileImg_${userId}.jpg`,
      });
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", UPLOAD_FOLDER);

      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await res.json();
      if (data.secure_url) {
        await AsyncStorage.setItem(`profileImg_${userId}`, data.secure_url);
        await AsyncStorage.setItem(`profileImg_${userId}_cloud`, data.secure_url);
        setProfileImg(data.secure_url);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload failed", error);
      Alert.alert("Upload Error", "Could not upload image to Cloudinary.");
    }
  };

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      setUser(null);
      Alert.alert("Success", "Logout Successful");
      router.replace("/sign-in");
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
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-purple-200 rounded-b-xl h-80 items-center justify-center">
        <View className="flex-col items-center justify-center p-5 relative">
          <View className="mt-1">
            {profileImg ? (
              <Image source={{ uri: profileImg }} style={{ width: 150, height: 150 }} className="rounded-full border-4 border-white" />
            ) : (
              <View className="rounded-full border-4 border-white h-36 w-36 bg-gray-300/40 justify-center items-center">
                <Text className="text-sm font-thin text-slate-600/60">No profile image uploaded</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={() => selectImage(true)} className="absolute bottom-0 right-0 transform translate-x-1/2">
            <Icon library="MaterialIcons" name="add-photo-alternate" size={48} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-3 -mt-14">
        <View className="bg-gray-100 shadow-lg shadow-black rounded-3xl p-4">
          {user ? (
            <View className="flex flex-col w-full pr-2">
              <View className="flex flex-col mb-3">
                <TouchableOpacity className="absolute top-0 right-0 z-10" onPress={toggleModal}>
                  <Icon library="MaterialCommunityIcons" name="account-edit-outline" size={40} />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-gray-700 mb-1">Name:</Text>
                <Text className="text-xl text-gray-800">{user.name}</Text>
              </View>

              <View className="border-b-2 border-gray-300 my-3" />

              <View className="flex flex-col mb-3">
                <Text className="text-2xl font-bold text-gray-700 mb-1">Email:</Text>
                <Text className="text-xl text-gray-800">{user.email}</Text>
              </View>

              <View className="border-b-2 border-gray-300 my-3" />

              <View className="flex flex-col mb-3">
                <Text className="text-2xl font-bold text-gray-700 mb-1">Mobile:</Text>
                <Text className="text-xl text-gray-800">{user.mobile}</Text>
              </View>

              <View className="border-b-2 border-gray-300 my-3" />

              <View className="flex flex-col mb-3">
                <Text className="text-2xl font-bold text-gray-700 mb-1">Role:</Text>
                <Text className="text-xl text-gray-800">{user.role === "CG" ? "Care Giver" : "Patient"}</Text>
              </View>

              <View className="border-b-2 border-gray-300 my-3" />

              <View className="flex flex-col mb-3">
                <Text className="text-2xl font-bold text-gray-700 mb-1">Family ID:</Text>
                <Text className="text-xl text-gray-800">{familyId}</Text>
              </View>

              <View className="border-b-2 border-gray-300 my-3" />

              {user.role === "CG" ? (
                <View className="flex flex-col mb-3">
                  <Text className="text-2xl font-bold text-gray-700 mb-1">Patient:</Text>
                  <Text className="text-xl text-gray-800">{PATName}</Text>
                  <Text className="text-xl text-gray-800">{PATId}</Text>
                </View>
              ) : (
                <View className="mb-3">
                  <Text className="text-2xl font-bold text-gray-700 mb-1">Caregivers:</Text>
                  <FlatList
                    data={user.members}
                    keyExtractor={(item) => item.userId}
                    renderItem={({ item, index }) => (
                      <View className="flex flex-row mb-2">
                        <Text className="text-2xl font-bold text-gray-700 ml-1">{index + 1})</Text>
                        <Text className="text-xl text-gray-800 ml-2">{item.name}</Text>
                      </View>
                    )}
                    ListEmptyComponent={<Text className="text-gray-500 text-xl">No caregivers added.</Text>}
                  />
                </View>
              )}
            </View>
          ) : (
            <Text className="text-center text-xl text-gray-500">Loading user data...</Text>
          )}
        </View>

        <View className="items-center justify-center mt-5 mb-3">
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.9}>
            <View className="bg-red-600 w-full shadow-md shadow-black p-2 pl-40 pr-40 justify-center rounded-xl">
              <Icon
                name="logout"
                library="MaterialCommunityIcons"
                size={52}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <EditForm userId={userId} isVisible={isModalVisible} setIsVisible={setIsModalVisible} toggleModal={toggleModal} />
    </SafeAreaView>
  );
};

export default Profile;
