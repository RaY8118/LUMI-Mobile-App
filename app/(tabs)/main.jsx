import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AddModalComponent from "../../components/AddModalComponent";
import EditModalComponent from "../../components/EditModalComponent";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

const Main = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [AddModalVisible, setAddModalVisible] = useState(false);
  const [EditModalVisible, setEditModalVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
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
      setAddModalVisible(false);
    } catch (error) {
      console.error("Error posting reminder", error);
      Alert.alert("Error", "Failed to save the reminder. Please try again");
    }
  };

  const updateReminder = async () => {
    if (!selectedReminder) {
      Alert.alert("Error", "No reminder selected for update");
      return;
    }

    try {
      const userId = await getUserIdFromToken();
      if (!userId) {
        Alert.alert("Error", "Failed to retrieve user ID");
        return;
      }

      const response = await axios.post(`${apiUrl}/updatereminders`, {
        remId: selectedReminder.remId, // Use the remId from selectedReminder
        title,
        description,
        date: date.toISOString(),
        status,
        userId: userId, // Ensure userId is included as per backend requirement
      });

      if (response.status === 200) {
        Alert.alert("Success", response.data.message);
        onRefresh(); // Refresh the list of reminders
        handleEditModalClose(); // Close the modal and reset fields
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to update the reminder"
        );
      }
    } catch (error) {
      console.error("Error updating reminder", error);
      Alert.alert("Error", "Failed to update the reminder. Please try again");
    }
  };

  const deleteReminder = async (remId) => {
    if (!remId) {
      Alert.alert("Error", "Reminder ID is required");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/deletereminders`, {
        remId,
      });

      if (response.status === 200) {
        Alert.alert("Success", response.data.message);
        onRefresh(); // Refresh the list of reminders
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to delete the reminder"
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert("Error", "Reminder not found");
      } else {
        console.error("Error deleting reminder", error);
        Alert.alert("Error", "Failed to delete the reminder. Please try again");
      }
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData();
  }, []);

  const handleEdit = async (remId) => {
    // Find the reminder with the given remId
    const reminder = reminders.find((rem) => rem._id === remId);
    if (reminder) {
      setSelectedReminder(reminder);
      setTitle(reminder.title);
      setDescription(reminder.description);
      setDate(new Date(reminder.date));
      setStatus(reminder.status);
      setEditModalVisible(true);
    } else {
      Alert.alert("Error", "Reminder not found");
    }
  };

  const resetEditFields = () => {
    setTitle("");
    setDescription("");
    setDate(new Date());
    setStatus("");
    setSelectedReminder(null);
  };

  const handleEditModalClose = () => {
    resetEditFields();
    setEditModalVisible(false);
  };

  if (loading) {
    return <Text>Loading reminders...</Text>;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="border border-black">
        <Text className="text-3xl m-4">Reminders</Text>
        {error ? (
          <Text>{error}</Text>
        ) : (
          reminders.map((reminder) => (
            <View key={reminder._id} className="m-4 border border-black">
              <Text className="font-bold">Reminder {reminder.remId}</Text>
              <Text>{reminder.title}</Text>
              <Text>{reminder.description}</Text>
              <Text>{new Date(reminder.date).toLocaleString()}</Text>
              <Text>Status: {reminder.status}</Text>
              <TouchableOpacity onPress={() => handleEdit(reminder._id)}>
                <Feather name="edit-2" size={30} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteReminder(reminder.remId)}>
                <AntDesign name="delete" size={30} color="black" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
      <View className="mt-2">
        <View className="justify-center items-center">
          <TouchableOpacity onPress={() => setAddModalVisible(true)}>
            <Entypo name="add-to-list" size={44} color="black" />
          </TouchableOpacity>
        </View>

        <AddModalComponent
          AddModalVisible={AddModalVisible}
          setAddModalVisible={setAddModalVisible}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          date={date}
          setDate={setDate}
          setStatus={setStatus}
          onSave={postReminders}
        />

        <EditModalComponent
          editModalVisible={EditModalVisible}
          setEditModalVisible={handleEditModalClose}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          date={date}
          setDate={setDate}
          status={status}
          setStatus={setStatus}
          onSave={updateReminder}
        />
      </View>
    </ScrollView>
  );
};

export default Main;
