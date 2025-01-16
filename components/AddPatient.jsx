import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { Icon } from "@/constants/Icons";
import { addPatient } from "@/services/userService"
import { useUser } from "@/hooks/useUser";
const AddPatient = ({ isVisible, setIsVisible, toggleModal }) => {
  const [patientId, setPatientId] = useState("");
  const [familyId, setFamilyId] = useState("");
  const { refetch } = useUser()
  const handleSubmit = async () => {
    try {
      const message = await addPatient(patientId, familyId)
      Alert.alert("Succes", message)
      setIsVisible(false)
      setPatientId("")
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
            <Text className="text-lg font-bold mb-5">Add patient</Text>
            <TextInput
              className="h-12 w-72 border border-gray-600 mb-4 px-3 rounded"
              placeholder="Enter patient ID"
              value={patientId}
              onChangeText={setPatientId}
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

export default AddPatient;
