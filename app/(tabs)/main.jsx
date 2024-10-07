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
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Main = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [status, setStatus] = useState("pending");
  const [isUrgent, setIsUrgent] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
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

      if (
        !title ||
        !description ||
        !date ||
        !status ||
        typeof isUrgent !== "boolean" ||
        typeof isImportant !== "boolean"
      ) {
        Alert.alert("Error", "All fields must be filled out correctly");
        return;
      }

      const response = await axios.post(`${apiUrl}/postreminders`, {
        title,
        description,
        date: date.toISOString(),
        status,
        isUrgent,
        isImportant,
        userId: userId,
      });
      setTitle("");
      setDescription("");
      setDate("");
      setStatus("");
      setIsUrgent(false);
      setIsImportant(false);
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
        remId: selectedReminder.remId,
        title,
        description,
        date: date.toISOString(),
        status,
        isUrgent,
        isImportant,
        userId: userId,
      });

      if (response.status === 200) {
        Alert.alert("Success", response.data.message);
        onRefresh();
        handleEditModalClose();
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
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this reminder?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log("Deletion cancelled"),
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const response = await axios.post(`${apiUrl}/deletereminders`, {
                remId,
              });

              if (response.status === 200) {
                Alert.alert("Success", response.data.message);
                onRefresh();
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
                Alert.alert(
                  "Error",
                  "Failed to delete the reminder. Please try again"
                );
              }
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData();
    resetEditFields();
  }, []);

  const handleEdit = async (remId) => {
    const reminder = reminders.find((rem) => rem._id === remId);
    if (reminder) {
      setSelectedReminder(reminder);
      setTitle(reminder.title);
      setDescription(reminder.description);
      setDate(new Date(reminder.date));
      setStatus(reminder.status);
      setIsUrgent(reminder.urgent);
      setIsImportant(reminder.important);
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
    setIsUrgent(null);
    setIsImportant(null);
    setSelectedReminder(null);
  };

  const handleEditModalClose = () => {
    resetEditFields();
    setEditModalVisible(false);
  };

  const getBackgroundColorClass = (urgent, important) => {
    if (urgent && important) {
      return "bg-custom-red";
    } else if (!urgent && important) {
      return "bg-custom-green";
    } else if (urgent && !important) {
      return "bg-custom-yellow";
    } else {
      return "bg-custom-white";
    }
  };

  const sortedReminders = reminders.slice().sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    if (a.status === "completed" && b.status === "pending") return 1;
    if (a.status === "pending" && b.status === "completed") return -1;
    return dateA - dateB;
  });

  if (loading) {
    return <Text>Loading reminders...</Text>;
  }

  return (
    <>
      <ScrollView
        className="border border-black bg-whiete rounded-lg"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-row flex-wrap justify-center items-center">
          <View className="pt-2">
            <Text className="text-3xl m-4 mt-6 font-ps2pregular">Reminders</Text>
          </View>
          {/* <View className="mb-4">
            <Text className="text-red-300 font-pextralight">
              Urgent and Important
            </Text>
            <Text className="text-green-300 font-pextralight">
              Not Urgent and Important
            </Text>
            <Text className="text-yellow-300 font-pextralight">
              Urgent and Not Important
            </Text>
            <Text className="text-gray-200 font-pextralight">
              Not Urgent and Not Important
            </Text>
          </View> */}
        </View>
        <View className="border border-black rounded-lg bg-white p-2 grid grid-cols-2 gap-2">
          {error ? (
            <Text className="col-span-2">{error}</Text>
          ) : (
            sortedReminders.map((reminder) => (
              <View
                key={reminder._id}
                className={`p-2 border border-black rounded-xl ${getBackgroundColorClass(
                  reminder.urgent,
                  reminder.important
                )}`}
              >
                <Text className="text-lg font-nsmmedium">{reminder.title}</Text>
                <Text className="text-lg font-nsmmedium">
                  {reminder.description}
                </Text>
                <Text className="text-lg font-nsmmedium">
                  {new Date(reminder.date).toLocaleDateString()}
                </Text>
                <Text className="text-lg font-nsmmedium">
                  {new Date(reminder.date).toLocaleTimeString()}
                </Text>
                <Text className="text-lg font-nsmmedium">
                  Status:{" "}
                  {reminder.status === "pending" ? "Pending" : "Completed"}
                </Text>
                {/* <Text className="text-lg font-pmedium">
                  Urgent: {reminder.urgent ? "Yes" : "No"}
                </Text>
                <Text className="text-lg font-pmedium">
                  Important: {reminder.important ? "Yes" : "No"}
                </Text> */}
                <TouchableOpacity
                  onPress={() => handleEdit(reminder._id)}
                  className="absolute right-14 bottom-2"
                >
                  <FontAwesome6 name="edit" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteReminder(reminder.remId)}
                  className="absolute right-4 bottom-1"
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={30}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
        <View className="mt-2">
          <AddModalComponent
            addModalVisible={addModalVisible}
            setAddModalVisible={setAddModalVisible}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            date={date}
            setDate={setDate}
            setStatus={setStatus}
            isUrgent={isUrgent}
            setIsUrgent={setIsUrgent}
            isImportant={isImportant}
            setIsImportant={setIsImportant}
            onSave={postReminders}
          />

          <EditModalComponent
            editModalVisible={editModalVisible}
            setEditModalVisible={handleEditModalClose}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            date={date}
            setDate={setDate}
            status={status}
            setStatus={setStatus}
            isUrgent={isUrgent}
            setIsUrgent={setIsUrgent}
            isImportant={isImportant}
            setIsImportant={setIsImportant}
            onSave={updateReminder}
          />
        </View>
      </ScrollView>
      <View className="justify-center items-center">
        <TouchableOpacity
          onPress={() => setAddModalVisible(true)}
          className="absolute right-6 bottom-5"
        >
          <MaterialIcons name="add-box" size={56} color="black" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Main;
