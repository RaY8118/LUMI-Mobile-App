import React, { useState } from "react";
import { Icon } from "@/constants/Icons";
import { Modal, Text, TouchableOpacity, View, TextInput, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";
const apiUrl = process.env.EXPO_PUBLIC_API_URL

const Chatbot = ({ isVisible, toggleModal }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true)

    try {
      const response = await axios.post(`${apiUrl}/chatbot`, { message: input });
      const botReply = { role: "bot", text: response.data.reply };

      setMessages((prevMessages) => [...prevMessages, botReply]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage = { role: "bot", text: "Sorry, something went wrong." };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false)
    }
  };

  const handleToggleModal = () => {
    if (isVisible) setMessages([])
    toggleModal()
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={toggleModal}
    >
      <View className="flex-1 justify-center items-center ">
        <View className="m-5 bg-white rounded-3xl p-5 items-center shadow-md shadow-black h-2/4 w-4/5">
          <TouchableOpacity
            className="absolute top-3 right-5"
            onPress={handleToggleModal}
          >
            <Icon name="circle-with-cross" size={30} color="black" library="Entypo" />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-center mb-4 text-black">Chatbot</Text>

          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text className={`p-2 ${item.role === "user" ? "text-blue-500" : "text-green-500"}`}>
                {item.role === "user" ? "You" : "Bot"}: {item.text}
              </Text>
            )}
            className="h-48 w-full px-2"
          />
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" className="my-4" />
          ) : (
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask something..."
              className="border border-gray-300 rounded-full w-full p-4 mt-2"
            />)}

          <TouchableOpacity
            onPress={sendMessage}
            className="p-2 mt-2 bg-blue-500 rounded-3xl shadow-lg shadow-black w-full items-center justify-center"
          >
            <Text className="text-white text-center text-xl font-semibold">Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Chatbot;
