import React, { useState } from "react";
import { Video } from 'expo-av'
import { View, Text } from "react-native-animatable";
import { Modal, TouchableOpacity } from "react-native";
import { Icon } from "@/constants/Icons";

const Tutorials = ({ isVisible, toggleModal }) => {
  const [selectedVideo, setSelectedVideo] = useState(null)

  const TutorialVideos = [
    {
      text: "Login Tutorial",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/v1746196072/login_zk1jal.mp4",
      icon: "log-in-outline",
      library: "Ionicons",
      color: "#a5b4fc",
    },
    {
      text: "Reminders",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/v1746196087/remindercg_puytsz.mp4",
      icon: "bell",
      library: "FontAwesome5",
      color: "#86efac",
    },
    {
      text: "Reminders (Patient)",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/v1746196086/reminder_lzec3f.mp4",
      icon: "user-clock",
      library: "FontAwesome6",
      color: "#fde047",
    },
    {
      text: "Face Recognition",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/v1746196089/face_ik9fn8.mp4",
      icon: "face-recognition",
      library: "MaterialCommunityIcons",
      color: "#fdba74",
    },
    {
      text: "Object Detection",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/v1746196079/obj_jpnavu.mp4",
      icon: "eye",
      library: "Feather",
      color: "#f9a8d4",
    },
    {
      text: "Profile Handling",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/v1746196079/profile_yyzfkc.mp4",
      icon: "account-circle",
      library: "MaterialIcons",
      color: "#93c5fd",
    },
  ];

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
                      className="flex justify-center items-center h-3/5"
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
                      <Text className="text-md font-bold text-center text-gray-800">
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
          </View>
        </View>
      </Modal>
    </View>

  )

}
export default Tutorials;
