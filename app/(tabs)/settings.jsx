import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import CustomNotifications from "@/components/CustomNotifications";
import CreateFamily from "@/components/CreateFamily"
import AddPatient from "@/components/AddPatient";
import AddMembers from "@/components/AddMembers"
import AddInfo from "@/components/AddInfo"
import AboutUs from "@/components/AboutUs"
import { Icon } from "@/constants/Icons";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false)
  const [isFamilyVisible, setIsFamilyVisible] = useState(false)
  const [isPatientVisible, setIsPatientVisible] = useState(false)
  const [isMemberVisible, setIsMemberVisible] = useState(false)
  const [isAboutVisible, setIsAboutVisible] = useState(false)
  const [isInfoVisible, setIsInfoVisible] = useState(false)

  const toggleNotificationsModal = () => {
    setIsNotificationsVisible(!isNotificationsVisible)
  }
  const toggleFamilyModal = () => {
    setIsFamilyVisible(!isFamilyVisible)
  }
  const togglePatientModal = () => {
    setIsPatientVisible(!isPatientVisible)
  }
  const toggleMemberModal = () => {
    setIsMemberVisible(!isMemberVisible)
  }
  const toggleAboutModal = () => {
    setIsAboutVisible(!isAboutVisible)
  }
  const toggleInfoModal = () => {
    setIsInfoVisible(!isInfoVisible)
  }
  const settingsOptions = [
    {
      title: "Custom Notifications",
      onPress: toggleNotificationsModal,
      library: "MaterialIcons",
      name: "notification-important"
    },
    {
      title: "Add Info",
      onPress: toggleInfoModal,
      library: "Entypo",
      name: "info"
    },
    {
      title: "Manage Family",
      onPress: toggleFamilyModal,
      library: "FontAwesome6",
      name: "people-roof"
    },
    {
      title: "Add Patient",
      onPress: togglePatientModal,
      library: "Fontisto",
      name: "bed-patient"
    },
    {
      title: "Add Members",
      onPress: toggleMemberModal,
      library: "MaterialIcons",
      name: "people-alt"
    },
    {
      title: "About Us",
      onPress: toggleAboutModal,
      library: "MaterialIcons",
      name: "feedback"
    },

  ]
  return (
    <>
      <SafeAreaView className="h-full">
        <View className="items-center justify-center py-4">
          <Text className="text-3xl font-bold">Settings</Text>
        </View>

        <View className="m-4 border border-black rounded-xl bg-white">
          {settingsOptions.map((option, index) => (
            <React.Fragment key={index}>
              <View className="h-20 flex flex-row items-center justify-between px-4">
                <View className="flex flex-row items-center">
                  <Icon library={option.library}
                    name={option.name}
                    size={36}
                    className="mr-4" />
                  <Text className="text-xl">{option.title}</Text>
                </View>
                <TouchableOpacity onPress={option.onPress}>
                  <Icon library="AntDesign" name="arrowright" size={36} />
                </TouchableOpacity>
              </View>
              {index < settingsOptions.length - 1 && (
                <View className="border-b border-gray-300 mx-4" />
              )}
            </React.Fragment>
          ))}
        </View>
      </SafeAreaView>
      <CustomNotifications isVisible={isNotificationsVisible} setIsVisible={setIsNotificationsVisible} toggleModal={toggleNotificationsModal} />
      <AddInfo isVisible={isInfoVisible} setIsVisible={setIsInfoVisible} toggleModal={toggleInfoModal} />
      <CreateFamily isVisible={isFamilyVisible} setIsVisible={setIsFamilyVisible} toggleModal={toggleFamilyModal} />
      <AddPatient isVisible={isPatientVisible} setIsVisible={setIsPatientVisible} toggleModal={togglePatientModal} />
      <AddMembers isVisible={isMemberVisible} setIsVisible={setIsMemberVisible} toggleModal={toggleMemberModal} />
      <AboutUs isVisible={isAboutVisible} setIsVisible={setIsAboutVisible} toggleModal={toggleAboutModal} />
    </>
  );
};

export default Settings;
