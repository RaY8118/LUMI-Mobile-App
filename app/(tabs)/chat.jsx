import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import { io } from 'socket.io-client';
import { usePatient } from '@/hooks/usePatient';
import { useUser } from '@/hooks/useUser';
import { Icon } from '@/constants/Icons'
const apiUrl = process.env.EXPO_PUBLIC_API_URL

const chat = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const { CGId, PATId } = usePatient();
  const { role } = useUser();
  const currentUserId = role === "CG" ? CGId : PATId

  const handleJoinRoom = async () => {
    if (!name || !room) {
      alert('Please enter both name and room.');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/join-room`, { room, name, CGId, PATId, role });
      const data = response.data;

      if (data.status === 'success') {
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
          console.log('Socket connected');
        });

        newSocket.on('message', (data) => {
          console.log('Message received:', data);
          const newMsg = {
            _id: Date.now() + Math.random(),
            text: data.message,
            createdAt: new Date(),
            user: { _id: data.user, name: data.name, avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.name}` }
          }
          setMessages((prev) => GiftedChat.append(prev, [newMsg]));
        });

        newSocket.on('disconnect', () => {
          console.log('Socket disconnected');
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
          backgroundColor: "#e8e8e8",
          borderTopWidth: 1,
          borderTopColor: "#ccc",
          padding: 10
        }} />
    )
  }

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <Icon name="send" library="FontAwesome" size={32} color="green" />
      </Send>
    )
  }
  // useEffect(() => {
  //   return () => {
  //     if (socket) socket.disconnect();
  //   };
  // }, [socket]);

  return (
    <View className="flex-1 bg-gray-100">
      {!joined ? (
        <View className="flex-1 justify-center items-center p-5 bg-white shadow-lg rounded-xl ">
          <Text className="text-3xl font-bold mb-5 text-center text-gray-800">Join Chat Room</Text>
          <View className="w-full">
            <TextInput
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              className="border border-gray-400 rounded-md my-2 p-3 w-full text-lg"
            />
          </View>
          <TextInput
            placeholder="Enter room code"
            value={room}
            onChangeText={setRoom}
            autoCapitalize="characters"
            className="border border-gray-400 rounded-md my-2 p-3 w-full text-lg"
          />
          <TouchableOpacity
            title="Join Room"
            onPress={handleJoinRoom}
            className="p-4 mt-5 bg-blue-500 rounded-3xl shadow-lg shadow-black w-full items-center justify-center"
          >
            <Text className="text-2xl font-bold text-white">Join Room</Text>
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
          <GiftedChat
            messages={messages}
            onSend={(msgs) => handleSend(msgs)}
            user={{ _id: currentUserId, name: name }}
            renderInputToolbar={renderInputToolbar}
            renderSend={renderSend}
          />
        </>
      )}
    </View>
  );
}

export default chat;
