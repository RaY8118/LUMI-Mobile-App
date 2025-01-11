import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { Icon } from "@/constants/Icons";
import { addMember } from "@/services/userService"
import { useUser } from "@/contexts/userContext";
const AddMembers = ({ isVisible, setIsVisible, toggleModal }) => {
  const [memberId, setMemberId] = useState("");
  const [familyId, setFamilyId] = useState("");
  const { refetch } = useUser()
  const handleSubmit = async () => {
    try {
      const message = await addMember(memberId, familyId)
      Alert.alert("Success", message)
      setIsVisible(false)
      setMemberId("")
      setFamilyId("")
      refetch()
    }
    catch (error) {
      Alert.alert("Error", error.message)
    }
  }

  return (
    <View className="flex-1 justify-center items-center mt-6">
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible()}
      >
        <View className="flex-1 justify-center items-center mt-6">
          <View className="m-5 bg-white rounded-3xl p-20 items-center shadow-md shadow-black">
            <TouchableOpacity
              className="absolute top-3 right-5"
              onPress={() => toggleModal()}
            >
              <Icon
                name="circle-with-cross"
                size={30}
                color="black"
                library="Entypo"
              />
            </TouchableOpacity>
            <Text className="text-lg font-bold mb-5">Add members</Text>
            <TextInput
              className="h-12 w-72 border border-gray-600 mb-4 px-3 rounded"
              placeholder="Enter member ID"
              value={memberId}
              onChangeText={setMemberId}
              autoCapitalize="characters"
            />
            <TextInput
              className="h-12 w-72 border border-gray-600 mb-4 px-3 rounded"
              placeholder="Enter family ID"
              value={familyId}
              onChangeText={setFamilyId}
            />


            <TouchableOpacity
              className="bg-black rounded-xl p-3 mt-3"
              onPress={handleSubmit}
            >
              <Text className="text-white font-bold text-center">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default AddMembers;
