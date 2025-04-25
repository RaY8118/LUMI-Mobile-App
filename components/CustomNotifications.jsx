import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Icon } from "@/constants/Icons";
import { sendCustomNotification } from "@/services/notificationService"
import { usePatient } from "@/hooks/usePatient"
import Spinner from "./Spinner";

const CustomNotification = ({ isVisible, setIsVisible, toggleModal }) => {
  const { PATId } = usePatient()
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true)
    await sendCustomNotification(PATId, message)
    setLoading(false)
    setIsVisible(!isVisible)
    setMessage("")
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
            <Text className="text-lg font-bold mb-5">Custom Notification</Text>
            <TextInput
              className="h-12 w-72 border border-gray-600 mb-4 px-3 rounded"
              placeholder="Enter Message"
              value={message}
              onChangeText={setMessage}
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
      {loading && <Spinner message="Sending message.Please wait..." />}
    </View>
  )
}

export default CustomNotification;
