import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Main = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          const decodedToken = jwtDecode(storedToken);
          const userId = decodedToken.sub.userId; 

          const response = await axios.post(`${apiUrl}/getreminders`, {
            userId,
          });

          if (response.data.status === "success") {
            if (response.data.reminders.length > 0) {
              setReminders(response.data.reminders);
            } else {
              setError("No reminders for this user.");
            }
          } else {
            setError(response.data.message);
          }
        } else {
          setError("No token found.");
        }
      } catch (error) {
        setError("Error fetching reminders: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [apiUrl]);

  if (loading) {
    return <Text>Loading reminders...</Text>;
  }

  return (
    <View>
      <Text className="text-3xl m-4">Reminders</Text>
      {reminders.length > 0 ? (
        reminders.map((reminder, index) => (
          <View key={reminder._id} className="m-4">
            <Text className="font-bold">Reminder {index + 1}</Text>
            <Text>{reminder.title}</Text>
            <Text>{reminder.description}</Text>
            <Text>{new Date(reminder.date).toLocaleString()}</Text>
            <Text>Status: {reminder.status}</Text>
          </View>
        ))
      ) : (
        <Text>No reminders found</Text>
      )}
    </View>
  );
};

export default Main;
