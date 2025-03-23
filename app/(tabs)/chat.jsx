import { Icon } from '@/constants/Icons';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import { io } from 'socket.io-client';
const apiUrl = process.env.EXPO_PUBLIC_API_URL

const chat = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);


  const handleJoinRoom = async () => {
    if (!name || !room) {
      alert('Please enter both name and room.');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/join-room`, { room, name });
      const data = response.data;

      if (data.status === 'success') {
        const oldMessages = data.messages.map((msg) => ({
          _id: msg.id || Date.now() + Math.random(),
          text: msg.message,
          createdAt: new Date(msg.createdAt),
          user: { _id: msg.name === name ? 1 : 2, name: msg.name },
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
            user: { _id: data.name === name ? 1 : 2, name: data.name },
          };
          setMessages((prev) => GiftedChat.append(prev, [newMsg]));
        });

        newSocket.on('disconnect', () => {
          console.log('Socket disconnected');
        });
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error joining room');
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
    <View className="flex-1">
      {!joined ? (
        <View className="flex-1 justify-center p-5">
          <Text className="text-2xl mb-5 text-center">Join Chat Room</Text>
          <TextInput
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            className="border border-gray-400 rounded-md my-2 p-2"
          />
          <TextInput
            placeholder="Enter room code"
            value={room}
            onChangeText={setRoom}
            autoCapitalize='characters'
            className="border border-gray-400 rounded-md my-2 p-2"
          />
          <TouchableOpacity
            title="Join Room"
            onPress={handleJoinRoom}
            className="p-3 bg-blue-400 rounded-3xl shadow-lg shadow-black items-center justify-center border-4 border-black h-fit w-fit">
            <Text className="text-xl font-bold">Join room</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity
            onPress={handleLeaveRoom}
            className="bg-red-500 p-3 rounded-3xl shadow-lg shadow-black items-center justify-center border-4 border-black mx-4 my-2">
            <Text className="text-xl font-bold text-white">Leave Room</Text>
          </TouchableOpacity>
          <GiftedChat
            messages={messages}
            onSend={(msgs) => handleSend(msgs)}
            user={{ _id: 1, name: name }}
            renderInputToolbar={renderInputToolbar}
            renderSend={renderSend}
          />
        </>
      )}
    </View>
  );
}

export default chat;
