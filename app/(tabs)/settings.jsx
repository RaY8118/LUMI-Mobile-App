import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import CustomNotifications from "@/components/CustomNotifications";
import CreateFamily from "@/components/CreateFamily"
import AddPatient from "@/components/AddPatient";
import AddMembers from "@/components/AddMembers"
import AddInfo from "@/components/AddInfo"
import AboutUs from "@/components/AboutUs"
import Chatbot from "@/components/Chatbot"
import { Icon } from "@/constants/Icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CreateRoom from "@/components/CreateRoom";
import FadeWrapper from "@/components/FadeWrapper";

const Settings = () => {
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false)
  const [isFamilyVisible, setIsFamilyVisible] = useState(false)
  const [isPatientVisible, setIsPatientVisible] = useState(false)
  const [isMemberVisible, setIsMemberVisible] = useState(false)
  const [isAboutVisible, setIsAboutVisible] = useState(false)
  const [isInfoVisible, setIsInfoVisible] = useState(false)
  const [isRoomVisible, setIsRoomVisible] = useState(false)
  const [isBotVisible, setIsBotVisible] = useState(false)

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
  const toogleRoomModal = () => {
    setIsRoomVisible(!isRoomVisible)
  }
  const toggleBotModal = () => {
    setIsBotVisible(!isBotVisible)
  }
  const settingsOptions = [
    {
      title: "Custom Notifications",
      onPress: toggleNotificationsModal,
      library: "MaterialIcons",
      name: "notification-important",
      color: "#FF9800"
    },
    {
      title: "Add Info",
      onPress: toggleInfoModal,
      library: "Entypo",
      name: "info",
      color: "#2196F3"
    },
    {
      title: "Manage Family",
      onPress: toggleFamilyModal,
      library: "FontAwesome6",
      name: "people-roof",
      color: "#4CAF50"
    },
    {
      title: "Add Patient",
      onPress: togglePatientModal,
      library: "Fontisto",
      name: "bed-patient",
      color: "#F44336"
    },
    {
      title: "Add Members",
      onPress: toggleMemberModal,
      library: "MaterialIcons",
      name: "people-alt",
      color: "#3F51B5"
    },
    {
      title: "Create Room",
      onPress: toogleRoomModal,
      library: "Ionicons",
      name: "chatbox",
      color: "#9C27B0"
    }, {
      title: "Chatbot",
      onPress: toggleBotModal,
      library: "Ionicons",
      name: "chatbubbles",
      color: "#FFFF4d"
    },
    {
      title: "About Us",
      onPress: toggleAboutModal,
      library: "MaterialIcons",
      name: "feedback",
      color: "#00BCD4"
    }

  ]
  return (
    <>
      <SafeAreaView className="h-full bg-purple-100">
        <FadeWrapper>
          <View className="items-center justify-center py-6 mx-4 bg-purple-400 shadow-md shadow-black rounded-3xl">
            <Text className="text-3xl font-bold text-gray-800">Settings</Text>
          </View>
          <View className="m-4 bg-white rounded-3xl shadow-md shadow-black">
            {settingsOptions.map((option, index) => (
              <React.Fragment key={index}>
                <View className="h-20 flex flex-row items-center justify-between px-6 py-3">
                  <View className="flex flex-row items-center">
                    <Icon
                      library={option.library}
                      name={option.name}
                      size={36}
                      color={option.color}
                      className="mr-5"
                    />
                    <Text className="text-xl text-gray-800 font-bold">{option.title}</Text>
                  </View>
                  <TouchableOpacity onPress={option.onPress} className="p-2">
                    <Icon
                      library="AntDesign"
                      name="arrowright"
                      size={24}
                      color="#4B5563"
                    />
                  </TouchableOpacity>
                </View>
                {index < settingsOptions.length - 1 && (
                  <View className="border-b border-gray-200 mx-4 shadow-sm shadow-black" />
                )}
              </React.Fragment>
            ))}
          </View>
        </FadeWrapper>
      </SafeAreaView>
      <CustomNotifications isVisible={isNotificationsVisible} setIsVisible={setIsNotificationsVisible} toggleModal={toggleNotificationsModal} />
      <AddInfo isVisible={isInfoVisible} setIsVisible={setIsInfoVisible} toggleModal={toggleInfoModal} />
      <CreateFamily isVisible={isFamilyVisible} setIsVisible={setIsFamilyVisible} toggleModal={toggleFamilyModal} />
      <AddPatient isVisible={isPatientVisible} setIsVisible={setIsPatientVisible} toggleModal={togglePatientModal} />
      <AddMembers isVisible={isMemberVisible} setIsVisible={setIsMemberVisible} toggleModal={toggleMemberModal} />
      <AboutUs isVisible={isAboutVisible} setIsVisible={setIsAboutVisible} toggleModal={toggleAboutModal} />
      <CreateRoom isVisible={isRoomVisible} setIsVisible={setIsRoomVisible} toggleModal={toogleRoomModal} />
      <Chatbot isVisible={isBotVisible} setIsVisible={setIsBotVisible} toggleModal={toggleBotModal} />
    </>
  );
};

export default Settings;
