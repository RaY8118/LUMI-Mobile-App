import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FadeWrapper from "@/components/FadeWrapper";
import { Icon } from "@/constants/Icons";
import CustomNotifications from "@/components/CustomNotifications";
import CreateFamily from "@/components/CreateFamily";
import AddPatient from "@/components/AddPatient";
import AddMembers from "@/components/AddMembers";
import AddInfo from "@/components/AddInfo";
import AboutUs from "@/components/AboutUs";
import Chatbot from "@/components/Chatbot";
import CreateRoom from "@/components/CreateRoom";
import Tutorial from "@/components/Tutorial";
import { useUser } from "@/hooks/useUser";

const Settings = () => {
  const { user } = useUser();
  const [modals, setModals] = useState({
    notifications: false,
    family: false,
    patient: false,
    member: false,
    info: false,
    about: false,
    room: false,
    bot: false,
    tutorial: false,
  });

  const toggleModal = (key) => {
    setModals((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const baseOptions = [
    {
      key: "tutorial",
      title: "Tutorials",
      library: "Foundation",
      name: "play-video",
      color: "#FFA444",
      onPress: () => toggleModal("tutorial"),
    },
    {
      key: "chatbot",
      title: "Chatbot",
      library: "Ionicons",
      name: "chatbubbles",
      color: "#FFFF4d",
      onPress: () => toggleModal("bot"),
    },
    {
      key: "about",
      title: "About Us",
      library: "MaterialIcons",
      name: "feedback",
      color: "#00BCD4",
      onPress: () => toggleModal("about"),
    },
  ];

  const caregiverOptions = [
    {
      key: "notifications",
      title: "Custom Notifications",
      library: "MaterialIcons",
      name: "notification-important",
      color: "#FF9800",
      onPress: () => toggleModal("notifications"),
    },
    {
      key: "info",
      title: "Add Info",
      library: "Entypo",
      name: "info",
      color: "#2196F3",
      onPress: () => toggleModal("info"),
    },
    {
      key: "family",
      title: "Manage Family",
      library: "FontAwesome6",
      name: "people-roof",
      color: "#4CAF50",
      onPress: () => toggleModal("family"),
    },
    {
      key: "patient",
      title: "Add Patient",
      library: "Fontisto",
      name: "bed-patient",
      color: "#F44336",
      onPress: () => toggleModal("patient"),
    },
    {
      key: "member",
      title: "Add Members",
      library: "MaterialIcons",
      name: "people-alt",
      color: "#3F51B5",
      onPress: () => toggleModal("member"),
    },
    {
      key: "room",
      title: "Create Room",
      library: "Ionicons",
      name: "chatbox",
      color: "#9C27B0",
      onPress: () => toggleModal("room"),
    },
  ];

  const settingsOptions = user?.role === "CG"
    ? [...caregiverOptions, ...baseOptions]
    : baseOptions;

  return (
    <>
      <SafeAreaView className="flex-1 bg-purple-100">
        <FadeWrapper>
          <View className="items-center justify-center py-6 mx-4 bg-purple-500 shadow-md rounded-3xl mb-2">
            <Text className="text-2xl font-extrabold text-white">Settings</Text>
          </View>

          <View className="mx-4 bg-white rounded-3xl shadow-lg overflow-hidden">
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={option.key}
                onPress={option.onPress}
                className="flex-row items-center justify-between px-5 py-4 hover:bg-gray-100 active:scale-[0.98] transition-all"
              >
                <View className="flex-row items-center space-x-4">
                  <View className="p-3 rounded-full" style={{ backgroundColor: option.color + "33" }}>
                    <Icon
                      library={option.library}
                      name={option.name}
                      size={28}
                      color={option.color}
                    />
                  </View>
                  <Text className="text-lg font-semibold text-gray-800">{option.title}</Text>
                </View>
                <Icon
                  library="AntDesign"
                  name="arrowright"
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            ))}
          </View>
        </FadeWrapper>
      </SafeAreaView>

      <CustomNotifications isVisible={modals.notifications} setIsVisible={() => toggleModal("notifications")} toggleModal={() => toggleModal("notifications")} />
      <AddInfo isVisible={modals.info} setIsVisible={() => toggleModal("info")} toggleModal={() => toggleModal("info")} />
      <CreateFamily isVisible={modals.family} setIsVisible={() => toggleModal("family")} toggleModal={() => toggleModal("family")} />
      <AddPatient isVisible={modals.patient} setIsVisible={() => toggleModal("patient")} toggleModal={() => toggleModal("patient")} />
      <AddMembers isVisible={modals.member} setIsVisible={() => toggleModal("member")} toggleModal={() => toggleModal("member")} />
      <CreateRoom isVisible={modals.room} setIsVisible={() => toggleModal("room")} toggleModal={() => toggleModal("room")} />
      <Chatbot isVisible={modals.bot} setIsVisible={() => toggleModal("bot")} toggleModal={() => toggleModal("bot")} />
      <AboutUs isVisible={modals.about} setIsVisible={() => toggleModal("about")} toggleModal={() => toggleModal("about")} />
      <Tutorial isVisible={modals.tutorial} setIsVisible={() => toggleModal("tutorial")} toggleModal={() => toggleModal("tutorial")} />
    </>
  );
};

export default Settings;
