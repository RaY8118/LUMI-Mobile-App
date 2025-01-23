import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { Icon } from "@/constants/Icons";
import { addInfo } from "@/services/userService"
import { useUser } from "@/hooks/useUser";
const AddInfo = ({ isVisible, setIsVisible, toggleModal }) => {
  const [relation, setRelation] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [triggerMemory, setTriggerMemory] = useState("");
  const { user } = useUser()
  const userId = user?.userId || null
  const handleSubmit = async () => {
    try {
      const message = await addInfo(userId, relation, tagLine, triggerMemory)
      Alert.alert("Success", message)
      setIsVisible(false)
      setRelation("")
      setTagLine("")
      setTriggerMemory("")
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
        onRequestClose={toggleModal}
      >
        <View className="flex-1 justify-center items-center mt-6">
          <View className="m-5 bg-white rounded-3xl p-20 items-center shadow-md shadow-black">
            <TouchableOpacity
              className="absolute top-3 right-5"
              onPress={toggleModal}
            >
              <Icon
                name="circle-with-cross"
                size={30}
                color="black"
                library="Entypo"
              />
            </TouchableOpacity>
            <Text className="text-lg font-bold mb-5">Add Additional Info</Text>
            <TextInput
              className="h-12 w-72 border border-gray-600 mb-4 px-3 rounded"
              placeholder="Enter ur relation with patient"
              value={relation}
              onChangeText={setRelation}
            />
            <TextInput
              className="h-12 w-72 border border-gray-600 mb-4 px-3 rounded"
              placeholder="Enter some Tag Line"
              value={tagLine}
              onChangeText={setTagLine}
            />
            <TextInput
              className="h-12 w-72 border border-gray-600 mb-4 px-3 rounded"
              placeholder="Enter some trigger memory of urs"
              value={triggerMemory}
              onChangeText={setTriggerMemory}
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

export default AddInfo;
