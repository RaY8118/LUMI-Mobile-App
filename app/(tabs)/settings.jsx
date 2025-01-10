import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import CustomNotifications from "@/components/CustomNotifications";
import CreateFamily from "@/components/CreateFamily"
import { Icon } from "@/constants/Icons";


const Settings = () => {
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false)
  const [isFamilyVisible, setIsFamilyVisible] = useState(false)
  const toggleNotificationsModal = () => {
    setIsNotificationsVisible(!isNotificationsVisible)
  }
  const toggleFamilyModal = () => {
    setIsFamilyVisible(!isFamilyVisible)
  }


  return (
    <View>
      <CustomNotifications isVisible={isNotificationsVisible} setIsVisible={setIsNotificationsVisible} toggleModal={toggleNotificationsModal} ></CustomNotifications>
      {/* <Text>Settings</Text> */}
      <CreateFamily isVisible={isFamilyVisible} setIsVisible={setIsFamilyVisible} toggleModal={toggleFamilyModal}></CreateFamily>
      <View className="h-32 flex flex-col border border-black items-center justify-center">
        <Text>Custom Notifications</Text>
        <Text>Click here</Text>
        <TouchableOpacity onPress={toggleNotificationsModal}>
          <Icon library="MaterialIcons" name="edit-square" size={44} />
        </TouchableOpacity>
      </View>
      <View className="h-32 flex flex-col border border-black items-center justify-center">
        <Text>Create Family</Text>
        <Text>Click here</Text>
        <TouchableOpacity onPress={toggleFamilyModal}>
          <Icon library="MaterialIcons" name="edit-square" size={44} />
        </TouchableOpacity>
      </View>
      <View className="h-32 flex flex-col border border-black items-center justify-center">
        <Text>Add members</Text>
        <Text>Click here</Text>
        <TouchableOpacity>
          <Icon library="MaterialIcons" name="edit-square" size={44} />
        </TouchableOpacity>
      </View>
      <View className="h-32 flex flex-col border border-black items-center justify-center">
        <Text>Add patients</Text>
        <Text>Click here</Text>
        <TouchableOpacity>
          <Icon library="MaterialIcons" name="edit-square" size={44} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;
