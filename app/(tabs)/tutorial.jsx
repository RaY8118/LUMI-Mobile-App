import React, { useState } from "react";
import { Video } from 'expo-av'
import { View, Text } from "react-native-animatable";
import { Image, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
const Psettings = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const TutorialVideos = [
    {
      text: "Login Tutorial",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/f_auto:video,q_auto/v1/Lumi/swvrxbwyflt6genskv2d",
      thumbnail: "https://res.cloudinary.com/dkyzhoqpb/image/upload/f_auto,q_auto/v1/samples/dessert-on-a-plate"
    },
    {
      text: "Reminders",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/f_auto:video,q_auto/v1/Lumi/swvrxbwyflt6genskv2d",
      thumbnail: "https://res.cloudinary.com/dkyzhoqpb/image/upload/f_auto,q_auto/v1/samples/dessert-on-a-plate"
    },
    {
      text: "Reminders (Patient)",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/f_auto:video,q_auto/v1/Lumi/swvrxbwyflt6genskv2d",
      thumbnail: "https://res.cloudinary.com/dkyzhoqpb/image/upload/f_auto,q_auto/v1/samples/dessert-on-a-plate"
    },
    {
      text: "Face Recognition",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/f_auto:video,q_auto/v1/Lumi/swvrxbwyflt6genskv2d",
      thumbnail: "https://res.cloudinary.com/dkyzhoqpb/image/upload/f_auto,q_auto/v1/samples/dessert-on-a-plate"
    },
    {
      text: "Object Detection",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/f_auto:video,q_auto/v1/Lumi/swvrxbwyflt6genskv2d",
      thumbnail: "https://res.cloudinary.com/dkyzhoqpb/image/upload/f_auto,q_auto/v1/samples/dessert-on-a-plate"
    },
    {
      text: "Profile Handling",
      video: "https://res.cloudinary.com/dkyzhoqpb/video/upload/f_auto:video,q_auto/v1/Lumi/swvrxbwyflt6genskv2d",
      thumbnail: "https://res.cloudinary.com/dkyzhoqpb/image/upload/f_auto,q_auto/v1/samples/dessert-on-a-plate"
    }
  ]
  const onRefresh = () => {
    setRefreshing(true)

    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} className="bg-gray-100" />}>
      <Text className="text-2xl text-center font-semibold mt-3 mb-6 text-gray-600">Follow the videos below for tutorial</Text>
      <View className="flex flex-row flex-wrap justify-between">
        {TutorialVideos.map((option, index) => (
          <View key={index} className="w-1/2 p-2">
            <TouchableOpacity className="bg-white rounded-lg  shadow shadow-black overflow-hidden" onPress={() => setSelectedVideo(option.video)}>
              <Image source={{ uri: option.thumbnail }} className="w-full aspect-square" />
              <Text className="text-xl font-semibold text-center text-gray-800">
                {option.text}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {selectedVideo && (
        <View className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-90 p-4">
          <Video source={{ uri: selectedVideo }}
            useNativeControls
            shouldPlay
            resizeMode="contain"
            style={{ width: "100%", height: 300 }}
          />
          <TouchableOpacity className="absolute top-5 right-5 bg-red-500 p-2 rounded-full" onPress={() => setSelectedVideo(null)}>
            <Text className="text-white text-lg">X</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>)
}
export default Psettings;
