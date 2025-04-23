import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Composer, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import { io } from 'socket.io-client';
import { usePatient } from '@/hooks/usePatient';
import { useUser } from '@/hooks/useUser';
import { Icon } from '@/constants/Icons'
import AsyncStorage from "@react-native-async-storage/async-storage"
import FadeWrapper from '@/components/FadeWrapper';
const apiUrl = process.env.EXPO_PUBLIC_API_URL

const chat = () => {
  const { user, role } = useUser();
  const [name, setName] = useState(user?.name.split(" ")[0]);
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const { CGId, PATId } = usePatient();
  const currentUserId = role === "CG" ? CGId : PATId

  useEffect(() => {
    autoJoin()
  }, [])

  const autoJoin = async () => {
    try {
      const savedRoom = await AsyncStorage.getItem("savedRoom")
      const savedName = await AsyncStorage.getItem("savedName")
      if (savedName && savedRoom) {
        setRoom(savedRoom)
        setName(savedName)
        await handleJoinRoom(savedName, savedRoom)
      }
    } catch (error) {
      console.error("Failed to auto-join room", error);
    } finally {
      setLoading(false)
    }
  }
  const handleJoinRoom = async (savedName = name, savedRoom = room) => {
    if (!savedName || !savedRoom) {
      Alert.alert("Missing Info", "Please enter both name and room.")
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/v1/chatroom/join-room`, { room: savedRoom, name: savedName, CGId, PATId, role });
      const data = response.data;

      if (data.status === 'success') {
        await AsyncStorage.setItem("savedRoom", savedRoom);
        await AsyncStorage.setItem("savedName", savedName);
        const oldMessages = data.messages.map((msg) => ({
          _id: msg.id || Date.now() + Math.random(),
          text: msg.message,
          createdAt: new Date(msg.createdAt),
          user: { _id: msg.user, name: msg.name },
        }));

        setMessages(oldMessages.reverse());

        const newSocket = io(`${apiUrl}`, {
          transports: ['websocket'],
          withCredentials: true,
        });

        setSocket(newSocket);
        setJoined(true);

        newSocket.on('connect', () => {
          // console.log('Socket connected');
        });

        newSocket.on('message', (data) => {
          // console.log('Message received:', data);
          const newMsg = {
            _id: Date.now() + Math.random(),
            text: data.message,
            createdAt: new Date(),
            user: { _id: data.user, name: data.name, avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.name}` }
          }
          setMessages((prev) => GiftedChat.append(prev, [newMsg]));
        });

        newSocket.on('disconnect', () => {
          // console.log('Socket disconnected');
        });
      } else {
        Alert.alert(error.message)
        alert(data.message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        Alert.alert("Error", error.response.data.message);
      } else {
        Alert.alert("Error", "Something went wrong!");
      }
    }
  };

  const handleSend = (newMessages = []) => {
    if (socket && newMessages.length > 0) {
      const message = newMessages[0];
      socket.emit('message', {
        message: message.text,
        room,
        name,
        createdAt: new Date().toISOString()
      });
    }
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setMessages([]);
    setRoom('');
    setName('');
    setJoined(false);
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "#f8f8f8",
          borderTopWidth: 0,
          borderRadius: 20,
          marginHorizontal: 10,
          marginBottom: 10,
        }}
        primaryStyle={{ alignItems: "center" }} />
    )
  }

  const renderComposer = (props) => {
    <Composer
      {...props}
      textInputStyle={{
        color: "#000",
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingHorizontal: 12,
        marginTop: 5
      }} />
  }

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <Icon name="send" library="FontAwesome" size={32} color="green" />
      </Send>
    )
  }

  if (loading) return null;

  return (
    <FadeWrapper>
      <View className="flex-1 bg-purple-100">
        {!joined ? (
          <View className="flex-1 justify-center items-center p-5 bg-purple-100 shadow-lg rounded-xl ">
            <Text className="text-3xl font-bold mb-5 text-center text-gray-800">Join Chat Room</Text>
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-6">
              <Icon name="user" size={24} color="gray" library="AntDesign" />
              <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                className="flex-1 ml-3 text-base text-gray-800"
              />
            </View>
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-6">
              <Icon name="user" size={24} color="gray" library="AntDesign" />
              <TextInput
                placeholder="Room"
                value={room}
                onChangeText={setRoom}
                className="flex-1 ml-3 text-base text-gray-800"
              />
            </View>
            <TouchableOpacity
              title="Join Room"
              onPress={() => handleJoinRoom()}
              className="p-4 mt-5 bg-blue-500 rounded-3xl shadow-lg shadow-black w-full items-center justify-center"
            >
              <Text className="text-2xl font-bold text-white">Connect</Text>
            </TouchableOpacity>
            <TouchableOpacity
              title="Join Room"
              onPress={() => autoJoin()}
              className="p-4 mt-5 bg-green-500 rounded-3xl shadow-lg shadow-black w-full items-center justify-center"
            >
              <Text className="text-2xl font-bold text-white">Reconnect</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={handleLeaveRoom}
              className="bg-red-500 p-4 rounded-3xl shadow-lg shadow-black items-center justify-center w-3/4 mx-auto mt-4"
            >
              <Text className="text-xl font-bold text-white">Leave Room</Text>
            </TouchableOpacity>
            <View className="flex-1 pb-20 mb-2">
              <GiftedChat
                messages={messages}
                onSend={(msgs) => handleSend(msgs)}
                user={{ _id: currentUserId, name: name }}
                renderInputToolbar={renderInputToolbar}
                renderSend={renderSend}
                renderComposer={renderComposer}
              />
            </View>
          </>
        )}
      </View>
    </FadeWrapper >
  );
}

export default chat;
