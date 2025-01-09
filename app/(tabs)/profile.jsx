import {
  View,
  Text,
  Alert,
  FlatList,
  SafeAreaView,
  ActivityIndicator, Image,
  TouchableOpacity,
  Button
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useUser } from "@/contexts/userContext";
import CustomButton from "@/components/CustomButton";
import * as ImagePicker from "expo-image-picker"
import { uploadProfileImg } from "@/services/userService"
import * as FileSystem from "expo-file-system"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Icon } from "@/constants/Icons";
import EditForm from "@/components/EditForm"

const Profile = () => {
  const { user, setUser, isLoading } = useUser(); // Access user from context
  const [isModalVisible, setIsModalVisible] = useState(false)
  const router = useRouter();
  const userId = user?.userId
  const familyId = user?.familyId
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
    try {
      const filename = new Date().getTime() + '.jpg'
      const dest = imgDir + filename
      await FileSystem.copyAsync({ from: uri, to: dest })
      await AsyncStorage.setItem(`profileImg_${userId}`, dest)
      setProfileImg(dest)
      console.log(dest)
    } catch (error) {
      console.error(error)
    }
  }


  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      setUser(null); // Trigger conditional rendering in the layout
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
    <SafeAreaView className="bg-custom-white h-full border border-black m-2 rounded-xl">
      <View>
        <EditForm userId={userId} isVisible={isModalVisible} setIsVisible={setIsModalVisible} toggleModal={toggleModal} />
      </View>
      <View className="flex-col items-center h-40 justify-center p-3 m-4">
        <Text className="text-3xl font-bold">User Profile</Text>
        <TouchableOpacity className="absolute top-2 right-0" onPress={toggleModal}>
          <Icon library="MaterialIcons" name="edit-square" size={44} />
        </TouchableOpacity>
        <View className="">
          {profileImg ? (
            <Image source={{ uri: profileImg }} style={{ width: 160, height: 160 }} className="rounded-full" />
          ) : (
            <Text>No profile image uploaded</Text>
          )}

        </View>
        <TouchableOpacity onPress={() => selectImage(true)} className="absolute right-1/3 bottom-0">

          <Icon library="Entypo" name="circle-with-plus" size={48} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-row h-4/6 items-start m-3 ">
        <View className="flex-1 justify-start items-start border border-black pt-4 pl-4 rounded-2xl bg-white w-full h-full">
          {user ? (
            <View className="flex flex-col w-full pr-5">
              <View className=" flex flex-col ">
                <Text className="text-2xl font-bold m-1">
                  Name:</Text>
                <Text className="text-xl m-1">{user.name}</Text>
              </View>
              <View className="border-b-2 border-gray-500 my-2" />
              <View className=" flex flex-col ">
                <Text className="text-2xl font-bold m-1">
                  Email:</Text>
                <Text className="text-xl m-1">{user.email}</Text>
              </View>
              <View className="border-b-2 border-gray-500 my-2" />
              <View className=" flex flex-col  ">
                <Text className="text-2xl font-bold m-1">
                  Mobile:</Text>
                <Text className="text-xl m-1">{user.mobile}</Text>
              </View>
              <View className="border-b-2 border-gray-500 my-2" />
              <View className=" flex flex-col  ">
                <Text className="text-2xl font-bold m-1">
                  Role:</Text>
                <Text className="text-xl m-1">{user.role === "CG" ? "Care Giver" : "Patient"}</Text>
              </View>
              <View className="border-b-2 border-gray-500 my-2" />
              <View className=" flex flex-col ">
                <Text className="text-2xl font-bold m-1">
                  Family ID:</Text>
                <Text className="text-xl m-1">{user.familyId}</Text>
              </View>
              <View className="border-b-2 border-gray-500 my-2" />


              {user.role === "CG" ? (
                <View className=" flex flex-col ">
                  <Text className="text-2xl font-bold m-1">
                    Patient:</Text>
                  <Text className="text-xl m-1">{user.patient[0].name}</Text>
                  <Text className="text-xl m-1">{user.patient[0].userId}</Text>
                </View>
              ) : (<FlatList
                data={user.members}
                keyExtractor={(item) => item.userId}
                renderItem={({ item, index }) => (
                  <View>
                    <Text className="text-2xl font-bold m-1 ">Caregivers: </Text>
                    <Text className="text-2xl font-bold ml-8">
                      {(index + 1)})  Name:
                    </Text>
                    <Text className="text-xl ml-16">
                      {item.name}
                    </Text>
                  </View>
                )
                }
                ListEmptyComponent={
                  <Text>
                    No caregivers added.
                  </Text>
                } />
              )}



            </View>
          ) : (
            <Text>Loading user data...</Text>
          )}
        </View>
      </View>
      <View className="items-end  absolute bottom-4 right-4 ">
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

      {/*      <View>
      <Button title="Photo library" onPress={() => selectImage(true)} />
        <Button title="Capture image" onPress={() => selectImage(false)} />
      </View>
      */}

    </SafeAreaView>
  );
};

export default Profile;
