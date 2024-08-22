import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AddModalComponent from "../../components/AddModalComponent";

const Main = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [status, setStatus] = useState("");
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const getUserIdFromToken = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync("token");
      if (storedToken) {
        const decodedToken = jwtDecode(storedToken);
        return decodedToken.sub.userId;
      } else {
        setError("No token found.");
        return null;
      }
    } catch (error) {
      setError("Error decoding token: " + error.message);
      return null;
    }
  };

  const fetchReminders = async (userId) => {
    try {
      const response = await axios.post(`${apiUrl}/getreminders`, {
        userId,
      });

      if (response.status === 200 && response.data.status === "success") {
        if (response.data.reminders.length > 0) {
          setReminders(response.data.reminders);
          setError(null);
        } else {
          setReminders([]);
          setError("No reminders for this user.");
        }
      } else if (response.status === 204) {
        setReminders([]);
        setError("No reminders for this user.");
      } else {
        setError(response.data.message || "Unexpected response from server");
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setError(
          "Internal server error: " +
            (error.response.data.details || "An unexpected error occurred")
        );
      } else {
        setError("Error fetching reminders: " + error.message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const postReminders = async () => {
    try {
      const userId = await getUserIdFromToken();
      if (!userId) {
        Alert.alert("Error", "Failed to retrieve user ID");
        return;
      }

      const response = await axios.post(`${apiUrl}/postreminders`, {
        title,
        description,
        date: date.toISOString(),
        status,
        userId: userId,
      });
      setTitle("");
      setDescription("");
      setDate("");
      setStatus("");
      console.log("Response", response);
      Alert.alert("Success", response.data.message);
      onRefresh();
      setModalVisible(false);
    } catch (error) {
      console.error("Error posting reminder", error);
      Alert.alert("Error", "Failed to save the reminder. Please try again");
    }
  };

  const deleteReminder = async () => {
    try {
      const response = await axios.post(`${apiUrl}/deletereminders`, {
        remId: "REMID004",
      });
      console.log(response);
      Alert.alert("Success", response.data.message);
      onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  const updateReminder = async () => {
    try {
      const response = await axios.post(`${apiUrl}/updatereminders`, {
        remId: "REMID003",
        status: "pending",
      });
      console.log("Response", response);
      Alert.alert("Success", response.data.message);
      onRefresh();
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUserData = async () => {
    const userId = await getUserIdFromToken();
    if (userId) {
      fetchReminders(userId);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [apiUrl]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData();
  }, []);

  if (loading) {
    return <Text>Loading reminders...</Text>;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        <Text className="text-3xl m-4">Reminders</Text>
        {error ? (
          <Text>{error}</Text>
        ) : (
          reminders.map((reminder) => (
            <View key={reminder._id} className="m-4">
              <Text className="font-bold">Reminder {reminder.remId}</Text>
              <Text>{reminder.title}</Text>
              <Text>{reminder.description}</Text>
              <Text>{new Date(reminder.date).toLocaleString()}</Text>
              <Text>Status: {reminder.status}</Text>
            </View>
          ))
        )}
      </View>
      <TouchableOpacity
        onPress={postReminders}
        style={{
          backgroundColor: "#3b82f6",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
          Post reminder
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={deleteReminder}
        style={{
          backgroundColor: "#3b82f6",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
          Delete reminder
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={updateReminder}
        style={{
          backgroundColor: "#3b82f6",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
          Update reminder
        </Text>
      </TouchableOpacity>
      <View></View>
      <View className="mt-2">
        <Pressable
          className="bg-blue-600 p-3 rounded-lg"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white text-center font-bold">Add Reminder</Text>
        </Pressable>

        <AddModalComponent
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          date={date}
          setDate={setDate}
          setStatus={setStatus}
          onSave={postReminders}
        />
      </View>
    </ScrollView>
  );
};

export default Main;
