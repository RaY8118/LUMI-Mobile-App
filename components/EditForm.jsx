import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native'
import { editPersonalInfo } from "@/services/userService"
import { Icon } from "@/constants/Icons";
import { useUser } from "@/hooks/useUser"


const EditForm = ({ userId, isVisible, setIsVisible, toggleModal }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const { refetch } = useUser()
  const handleSubmit = async () => {
    await editPersonalInfo(userId, name, setName, mobile, setMobile)
    await refetch()
    setIsVisible(!isVisible)
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
            <Text className="text-lg font-bold mb-5">Edit Personal Info</Text>
            <TextInput
              className="h-12 w-72 border border-gray-600 mb-4 px-3 rounded"
              placeholder="Enter name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              className="h-12 w-72 border border-gray-600 mb-4 px-3 rounded"
              placeholder="Enter Mobile No"
              value={mobile}
              onChangeText={setMobile}
            />

            <TouchableOpacity
              className="bg-black rounded-xl p-3 mt-3"
              onPress={handleSubmit}
            >
              <Text className="text-white font-bold text-center">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default EditForm;
