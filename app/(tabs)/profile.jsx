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
import CustomButton from "@/components/CustomButton";
import * as ImagePicker from "expo-image-picker"
import { uploadProfileImg } from "@/services/userService"
import * as FileSystem from "expo-file-system"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Icon } from "@/constants/Icons";
import EditForm from "@/components/EditForm"
import axios from "axios";

const CLOUDINARY_URL = process.env.CLOUDINARY_URL
const UPLOAD_PRESET = process.env.UPLOAD_PRESET
const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER

const Profile = () => {
  const { user, setUser, isLoading } = useUser();
  const { PATId, PATName } = usePatient()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const router = useRouter();
  const userId = user?.userId || null
  const familyId = user?.familyId || "Not set"
  const [profileImg, setProfileImg] = useState("")
  const imgDir = FileSystem.documentDirectory + 'images/'
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  useEffect(() => {
    loadProfileImage()
  }, [user])


  const loadProfileImage = async () => {
    try {
      const savedImg = await AsyncStorage.getItem(`profileImg_${userId}`)
      if (savedImg) {
        setProfileImg(savedImg)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir)
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true })
    }
  }

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
    await ensureDirExists()
    const filename = new Date().getTime() + '.jpg'
    const dest = imgDir + filename
    try {
      await FileSystem.copyAsync({ from: uri, to: dest })
      await AsyncStorage.setItem(`profileImg_${userId}`, dest)
      setProfileImg(dest)
      console.log("Saved Locally:", dest)
      uplaodToCloudinary(uri, userId)
    } catch (error) {
      console.error(error)
    }
  }

  const uplaodToCloudinary = async (localUri, userId) => {
    try {
      const formData = new FormData()
      formData.append("file", {
        uri: localUri,
        type: "image/jpeg",
        name: `profileImg_${userId}.jpg`
      })
      formData.append("upload_preset", UPLOAD_PRESET)
      formData.append("folder", UPLOAD_FOLDER)
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      if (response.data.secure_url) {
        await AsyncStorage.setItem(`profileImg_${userId}`, response.data.secure_url)
        setProfileImg(response.data.secure_url)
        console.log("Uploaded to cloudinary:", response.data.secure_url)
      } else {
        throw new Error("Failed to upload image")
      }
    } catch (error) {
      console.error("Upload failed", error)
      Alert.alert("Error", "Failed to upload image to cloudinary")
    }
  }

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
    <SafeAreaView className="bg-white h-full rounded-xl">
      <View>
        <EditForm userId={userId} isVisible={isModalVisible} setIsVisible={setIsModalVisible} toggleModal={toggleModal} />
      </View>
      <View className="flex-col items-center justify-center h-40 p-5 m-4 bg-gray-100 shadow-lg shadow-black rounded-3xl">
        <View className="mt-1">
          {profileImg ? (
            <Image source={{ uri: profileImg }} style={{ width: 150, height: 150 }} className="rounded-full border-4 border-white" />
          ) : (
            <View className="rounded-full border-4 border-white h-36 w-36 bg-gray-300/40 justify-center items-center">
              <Text className="text-sm font-thin text-slate-600/60">No profile image uploaded</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => selectImage(true)} className="absolute right-1/3 bottom-0">
          <Icon library="MaterialIcons" name="add-photo-alternate" size={48} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex-row h-4/6 items-start m-3">
        <View className="flex-1 justify-start items-start pt-4 pl-4 rounded-2xl bg-gray-100 w-full h-full shadow-lg shadow-black">
          {user ? (
            <View className="flex flex-col w-full pr-5">
              <View className="flex flex-col mb-3">
                <TouchableOpacity className="absolute top-0 right-0 z-10" onPress={() => toggleModal()}>
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
                <View>
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
      </View>
      <View className="items-end  absolute bottom-2 right-4 ">
        <CustomButton
          onPress={handleLogout}
          bgcolor="bg-red-500"
          name="logout"
          library="AntDesign"
          size={40}
          activeOpacity={0.7}
          color="white"
        />
      </View>

    </SafeAreaView >
  );
};

export default Profile;
