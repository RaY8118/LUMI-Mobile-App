import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { Icon } from "@/constants/Icons";
import { addInfo, getAddInfo } from "@/services/userService"
import { useUser } from "@/hooks/useUser";
const AddInfo = ({ isVisible, setIsVisible, toggleModal }) => {
  const [relation, setRelation] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [triggerMemory, setTriggerMemory] = useState("");
  const [info, setInfo] = useState("");
  const [isAddInfo, setIsAddInfo] = useState(true);
  const { user } = useUser()
  const userId = user?.userId || null

  const showAddInfo = async () => {
    const additionalInfo = await getAddInfo(userId);
    setInfo(additionalInfo);
    setIsAddInfo(false);
  }

  const handleSubmit = async () => {
    try {
      const message = await addInfo(userId, relation, tagLine, triggerMemory)
      Alert.alert("Success", message)
      setIsVisible(false)
      setRelation("")
      setTagLine("")
      setTriggerMemory("")
      showAddInfo();
    }
    catch (error) {
      Alert.alert("Error", error.message)
    }
  }

  useEffect(() => {
    if (userId) {
      showAddInfo();
    }
  }, [userId]);

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
            {info && info.length > 0 && (
              <View className="mb-5">
                <Text className="text-xl font-bold text-gray-700 mb-2">Info:</Text>
                <Text className="text-lg text-gray-600">Name: {info[0].name}</Text>
                <Text className="text-lg text-gray-600">Relation: {info[0].relation}</Text>
                <Text className="text-lg text-gray-600">Tagline: {info[0].tagline}</Text>
                <Text className="text-lg text-gray-600">Trigger Memory: {info[0].triggerMemory}</Text>
              </View>
            )}
            <Text className="text-lg font-bold mb-5">{info ? "Edit" : "Add"} Additional Info</Text>
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
