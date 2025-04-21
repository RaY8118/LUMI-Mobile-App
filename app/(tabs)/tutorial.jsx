import React, { useState } from "react";
import { Video } from 'expo-av'
import { View, Text } from "react-native-animatable";
import { RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import FadeWrapper from "@/components/FadeWrapper";
import { Icon } from "@/constants/Icons";

const Tutorials = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)

  const TutorialVideos = [
    {
      text: "Login Tutorial",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/f_auto:video,q_auto/v1/Lumi/swvrxbwyflt6genskv2d",
      icon: "log-in-outline",
      library: "Ionicons",
      color: "#a5b4fc",
    },
    {
      text: "Reminders",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/f_auto:video,q_auto/v1/Lumi/swvrxbwyflt6genskv2d",
      icon: "bell",
      library: "FontAwesome5",
      color: "#86efac",
    },
    {
      text: "Reminders (Patient)",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/f_auto:video,q_auto/v1/Lumi/swvrxbwyflt6genskv2d",
      icon: "user-clock",
      library: "FontAwesome6",
      color: "#fde047",
    },
    {
      text: "Face Recognition",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/f_auto:video,q_auto/v1/Lumi/swvrxbwyflt6genskv2d",
      icon: "face-recognition",
      library: "MaterialCommunityIcons",
      color: "#fdba74",
    },
    {
      text: "Object Detection",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/f_auto:video,q_auto/v1/Lumi/swvrxbwyflt6genskv2d",
      icon: "eye",
      library: "Feather",
      color: "#f9a8d4",
    },
    {
      text: "Profile Handling",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/f_auto:video,q_auto/v1/Lumi/swvrxbwyflt6genskv2d",
      icon: "account-circle",
      library: "MaterialIcons",
      color: "#93c5fd",
    },
  ];
  const onRefresh = () => {
    setRefreshing(true)

    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }
  return (
    <FadeWrapper>
      <ScrollView
        className="bg-purple-100"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <Text className="text-2xl text-center font-semibold mt-3 mb-6 text-gray-600">
          Follow the videos below for tutorial
        </Text>

        <View className="flex flex-row flex-wrap justify-between px-4 gap-y-8 ">
          {TutorialVideos.map((option, index) => (
            <View key={index} className="w-[48%]">
              <TouchableOpacity
                className="bg-white rounded-xl shadow shadow-black/20 overflow-hidden aspect-square"
                onPress={() => setSelectedVideo(option.video)}
                activeOpacity={0.8}
              >
                <View
                  className="flex justify-center items-center h-4/5"
                  style={{ backgroundColor: option.color }}
                >
                  <Icon
                    name={option.icon}
                    library={option.library}
                    size={40}
                    color="white"
                  />
                </View>

                <View className="py-2 px-2">
                  <Text className="text-lg font-bold text-center text-gray-800">
                    {option.text}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {selectedVideo && (
          <View className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-90 p-4 z-50">
            <Video
              source={{ uri: selectedVideo }}
              useNativeControls
              shouldPlay
              resizeMode="contain"
              style={{ width: "100%", height: 300 }}
            />
            <TouchableOpacity
              className="absolute top-5 right-5 bg-red-500 p-2 rounded-full"
              onPress={() => setSelectedVideo(null)}
            >
              <Text className="text-white text-lg">X</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </FadeWrapper>
  )

}
export default Tutorials;
