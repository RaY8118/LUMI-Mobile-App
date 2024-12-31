import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import AddModalComponent from "../../components/AddModalComponent";
import EditModalComponent from "../../components/EditModalComponent";
import * as Notifications from "expo-notifications"; // Added for notifications
import * as Speech from "expo-speech"; // Added for speech
import { Icon } from "@/constants/Icons";
import { useUser } from "@/contexts/userContext";
import {
  deleteReminder,
  fetchReminders,
  postReminder,
  updateReminder,
} from "@/services/remindersService";
// Notification handler setup
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Reminders = () => {
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
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [status, setStatus] = useState("pending");
  const [isUrgent, setIsUrgent] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState(""); // Added for push token
  const [notification, setNotification] = useState(undefined); // Added for notification
  const notificationListener = useRef(); // Added for notification listener
  const responseListener = useRef(); // Added for response listener
  const { user } = useUser();
  const userId = user?.userId;

  const fetchUserData = async () => {
    if (userId) {
      fetchReminders(userId, setReminders, setError, setLoading, setRefreshing);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        const title = notification.request.content.title; // Get the title from the notification

        // Add a delay of 5 seconds before speaking the title
        setTimeout(() => {
          speak(title); // Speak the title after the delay
        }, 5000); // 5000 milliseconds = 5 seconds
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Function to schedule a notification
  const scheduleNotification = async (
    reminderTitle,
    reminderBody,
    reminderTime
  ) => {
    const triggerDate = new Date(reminderTime); // Ensure it's a Date object
    const now = new Date();

    // Calculate the time difference in seconds
    const timeDifference = (triggerDate.getTime() - now.getTime()) / 1000;

    // Schedule the notification only if the time is in the future
    if (timeDifference > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: reminderTitle,
          body: reminderBody,
          data: { data: "goes here" },
        },
        trigger: { seconds: timeDifference }, // Set the trigger to the calculated time difference
      });
    } else {
      console.warn(
        "The reminder time is in the past. Notification not scheduled."
      );
    }
  };

  async function registerForPushNotificationsAsync() {
    let token = null;
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      throw new Error("Failed to get push token for push notification!");
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log(token);

    return token;
  }

  const postReminders = async () => {
    const reminderData = {
      title,
      description,
      date,
      time,
      status,
      isUrgent,
      isImportant,
      userId,
      setTitle,
      setDescription,
      setDate,
      setTime,
      setStatus,
      setIsUrgent,
      setIsImportant,
      setAddModalVisible,
      onRefresh,
    };
    await postReminder(reminderData);
    await scheduleNotification(title, description, new Date(date));
  };

  const handleUpdateReminders = async () => {
    const reminderData = {
      selectedReminder,
      userId,
      title,
      description,
      time,
      date,
      status,
      isUrgent,
      isImportant,
      onRefresh,
      handleEditModalClose,
      scheduleNotification,
    };

    await updateReminder(reminderData);
  };

  const handleDeleteReminder = async (remId) => {
    await deleteReminder(userId, remId, onRefresh);
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
      setTime(new Date(reminder.time));
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
    setTime(new Date());
    setStatus("pending");
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

  const speak = (text) => {
    Speech.speak(text); // Function to speak the text
  };

  if (loading) {
    return <Text>Loading reminders...</Text>;
  }

  return (
    <>
      <ScrollView
        className="border border-black bg-white rounded-lg"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-row flex-wrap justify-center items-center">
          <View className="pt-2">
            <Text className="text-3xl m-4 mt-2 font-ps2pregular">
              Reminders
            </Text>
          </View>
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
                <Text className="text-3xl font-agdasimar">
                  {reminder.title}
                </Text>
                <Text className="text-2xl font-agdasimar">
                  {reminder.description}
                </Text>
                <Text className="text-2xl font-agdasimar">
                  {new Date(reminder.date).toLocaleDateString()}
                </Text>
                <Text className="text-2xl font-agdasimar">{reminder.time}</Text>
                <Text className="text-2xl font-agdasimar">
                  Status:{" "}
                  {reminder.status === "pending" ? "Pending" : "Completed"}
                </Text>
                <TouchableOpacity
                  onPress={() => handleEdit(reminder._id)}
                  className="absolute right-14 bottom-2"
                >
                  <Icon
                    name="edit"
                    size={24}
                    color="black"
                    library="FontAwesome6"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteReminder(reminder.remId)}
                  className="absolute right-4 bottom-1"
                >
                  <Icon
                    name="delete-outline"
                    size={30}
                    color="black"
                    library="MaterialIcons"
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
            time={time}
            setTime={setTime}
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
            time={time}
            setTime={setTime}
            status={status}
            setStatus={setStatus}
            isUrgent={isUrgent}
            setIsUrgent={setIsUrgent}
            isImportant={isImportant}
            setIsImportant={setIsImportant}
            onSave={handleUpdateReminders}
          />
        </View>
      </ScrollView>
      <View className="justify-center items-center">
        <TouchableOpacity
          onPress={() => setAddModalVisible(true)}
          className="absolute right-6 bottom-5"
        >
          <Icon
            name="add-box"
            size={56}
            color="black"
            library="MaterialIcons"
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Reminders;
