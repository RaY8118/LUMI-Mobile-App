import React from "react";
import { Icon } from "@/constants/Icons";
import { Modal, Text, TouchableOpacity, View } from "react-native";

const AboutUs = ({ isVisible, toggleModal }) => {
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
            <Text className="text-lg font-bold text-center mb-4 text-black">About Us</Text>
            <Text className="text-lg font-semibold text-gray-800 mb-2">Who We Are</Text>
            <Text className="text-gray-700 text-base text-justify leading-6 mb-4">
              Lumi Digitals is dedicated to creating innovative solutions for Alzheimer's patients and their caregivers. Our app
              is designed to provide assistance with reminders, task scheduling, and facial recognition to help users reconnect
              their loved ones.
            </Text>
            <Text className="text-lg font-semibold text-gray-800 mb-2">Key Features</Text>
            <View className="mb-4 space-y-2">
              <Text className="text-gray-700 text-base leading-6">
                Smart Reminders: Get notified about important tasks.
              </Text>
              <Text className="text-gray-700 text-base leading-6">
                Facial Recognition: Helps patients recognize family and friends.
              </Text>
              <Text className="text-gray-700 text-base leading-6">
                Live Location Tracking: Ensure safety by tracking the user's location.
              </Text>
            </View>
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Contact Us
            </Text>
            <Text className="text-gray-700 text-base text-justify leading-6">
              We'd love to hear from you! If you have any questions, feedback, or need assistance,
              please reach out to us at:
            </Text>
            <Text className="text-blue-500 underline mt-2 text-center">
              support@lumidigitals.com
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default AboutUs
