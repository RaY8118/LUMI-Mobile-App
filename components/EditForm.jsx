import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button } from 'react-native'
import { editPersonalInfo } from "@/services/userService"
const EditForm = ({ userId, isVisible, setIsVisible, toggleModal }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const handleSubmit = async () => {
    await editPersonalInfo(userId, name, setName, mobile, setMobile)
    setIsVisible(!isVisible)
  }

  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      onRequestClose={toggleModal}>

      <View>
        <View>
          <Text>Enter details</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name" />

          <TextInput
            value={mobile}
            onChangeText={setMobile}
            placeholder="Email"
            keyboardType="email-address" />

          <Button title="Submit" onPress={handleSubmit} />

          <Button title="Close" onPress={toggleModal} color="red" />
        </View>
      </View>
    </Modal>
  )
}

export default EditForm;
