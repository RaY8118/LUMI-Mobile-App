import axios from 'axios';
import { Alert } from 'react-native';

const apiUrl = process.env.EXPO_PUBLIC_API_URL


export const sendTokenToBackend = async (userId, token) => {
  try {
    const response = await axios.post(`${apiUrl}/store-token`, {
      token,
      userId
    })
    // console.log("Token send to backend: ", response.data.message);

  } catch (error) {
    console.error(error)
  }
}


export const fetchReminders = async (userId, setReminders, setError, setLoading, setRefreshing) => {
  try {
    const response = await axios.get(`${apiUrl}/patient/reminders`, {
      params: { userId },
      headers: { "Content-Type": "application/json" },
    });

    if (response.data.status === "success") {
      if (response.data.reminders.length > 0) {
        setReminders(response.data.reminders);
        setError(null);
      } else {
        setReminders([]);
        setError("No reminders for this user.");
      }
    } else {
      setError(response.data.message || "Unexpected response from server");
    }
  } catch (error) {
    if (error.response && error.response.status === 500) {
      setError("Internal server error: " + error.response.data.error);
    } else {
      setError("Error fetching reminders: " + error.message);
    }
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


export const postReminder = async ({
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
  onRefresh
}) => {
  try {
    if (!userId) {
      Alert.alert("Error", "Failed to retrieve user ID");
      return;
    }

    if (!title || !description || !date || !time) {
      Alert.alert("Error", "All fields must be filled out correctly");
      return;
    }

    let timeString;
    if (typeof time === "string" && time.includes(":")) {
      timeString = time;
    } else {
      timeString = new Date(time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    const formattedDate = new Date(date).toISOString().split("T")[0];

    const reminderData = {
      title,
      description,
      date: formattedDate,
      time: timeString,
      status,
      isUrgent,
      isImportant,
      userId,
    };


    const response = await axios.post(`${apiUrl}/patient/reminders`, reminderData);


    setTitle("");
    setDescription("");
    setDate(new Date());
    setTime(
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
    setStatus("pending");
    setIsUrgent(false);
    setIsImportant(false);
    Alert.alert("Success", response.data.message);
    onRefresh();
    setAddModalVisible(false);

    return response;
  } catch (error) {
    console.error("Error posting reminder: ", error.response.data.error);
    Alert.alert("Error", "Failed to save the reminder. Please try again");
  }
};



export const updateReminder = async ({
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
}) => {
  try {
    if (!selectedReminder) {
      Alert.alert("Error", "No reminder selected for update");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "Failed to retrieve user ID");
      return;
    }

    if (!title || !description || !date || !time) {
      Alert.alert("Error", "All fields must be filled out correctly");
      return;
    }

    let timeString;
    if (typeof time === "string" && time.includes(":")) {
      timeString = time;
    } else {
      timeString = new Date(time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
    const formattedDate = new Date(date).toISOString().split("T")[0];
    const reminderData = {
      title,
      description,
      date: formattedDate,
      time: timeString,
      status,
      isUrgent,
      isImportant,
      userId,
    };

    const response = await axios.put(
      `${apiUrl}/patient/reminders/${selectedReminder.remId}`,
      reminderData
    );

    if (response.status === 200) {
      Alert.alert("Success", response.data.message);
      onRefresh();
      handleEditModalClose();


    } else {
      Alert.alert("Error", response.data.message || "Failed to update the reminder");
    }
  } catch (error) {
    console.error("Error updating reminder: ", error.response?.data || error.message);
    Alert.alert("Error", "Failed to update the reminder. Please try again.");
  }
};


export const deleteReminder = async (userId, remId, onRefresh) => {
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
            const response = await axios.delete(
              `${apiUrl}/patient/reminders/${userId}/${remId}`,
            );

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
              console.error(
                "Error deleting reminder",
                error.response.data.message
              );
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




export const fetchPatientReminders = async (CGId, PATId, setReminders, setError, setLoading, setRefreshing) => {
  try {
    const response = await axios.get(`${apiUrl}/caregiver/reminders`, {
      params: { CGId, PATId },
      headers: { "Content-Type": "application/json" },
    });

    if (response.data.status === "success") {
      if (response.data.reminders.length > 0) {
        setReminders(response.data.reminders);
        setError(null);
      } else {
        setReminders([]);
        setError("No reminders for this user.");
      }
    } else {
      setError(response.data.message || "Unexpected response from server");
    }
  } catch (error) {
    if (error.response && error.response.status === 500) {
      setError("Internal server error: " + error.response.data.error);
    } else {
      setError("Error fetching reminders: " + error.message);
    }
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


export const postPatientReminder = async ({
  title,
  description,
  date,
  time,
  status,
  isUrgent,
  isImportant,
  userId,
  PATId,
  CGId,
  setTitle,
  setDescription,
  setDate,
  setTime,
  setStatus,
  setIsUrgent,
  setIsImportant,
  setAddModalVisible,
  onRefresh
}) => {
  try {
    if (!userId) {
      Alert.alert("Error", "Failed to retrieve user ID");
      return;
    }

    if (!title || !description || !date || !time) {
      Alert.alert("Error", "All fields must be filled out correctly");
      return;
    }

    let timeString;
    if (typeof time === "string" && time.includes(":")) {
      timeString = time;
    } else {
      timeString = new Date(time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    // Combine date and time into a single Date object
    const reminderTime = new Date(date);
    const [hours, minutes] = timeString.split(":");
    reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const reminderData = {
      title,
      description,
      date,
      status,
      time: timeString,
      isUrgent,
      isImportant,
      userId,
      PATId,
      CGId
    };

    const response = await axios.post(`${apiUrl}/caregiver/reminders`, reminderData);
    setTitle("");
    setDescription("");
    setDate(new Date());
    setTime(
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
    setStatus("pending");
    setIsUrgent(false);
    setIsImportant(false);
    Alert.alert("Success", response.data.message);
    onRefresh();
    setAddModalVisible(false);

    return response;
  } catch (error) {
    console.error("Error posting reminder", error.response.data.message);
    Alert.alert("Error", "Failed to save the reminder. Please try again");
  }
};


export const updatePatientReminder = async ({
  selectedReminder,
  userId,
  CGId,
  PATId,
  title,
  description,
  time,
  date,
  status,
  isUrgent,
  isImportant,
  onRefresh,
  handleEditModalClose,

}) => {
  if (!selectedReminder) {
    Alert.alert("Error", "No reminder selected for update");
    return;
  }

  try {
    if (!userId) {
      Alert.alert("Error", "Failed to retrieve user ID");
      return;
    }

    if (!title || !description || !date || !time) {
      Alert.alert("Error", "All fields must be filled out correctly");
      return;
    }

    const timeString =
      typeof time === "string"
        ? time
        : time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

    const reminderTime = new Date(date);
    const [hours, minutes] = timeString.split(":");
    reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    if (isNaN(reminderTime.getTime())) {
      Alert.alert(
        "Error",
        "Invalid date and time. Please check your inputs."
      );
      return;
    }
    const response = await axios.put(
      `${apiUrl}/caregiver/reminders/${selectedReminder.remId}`,
      {
        title,
        description,
        date: date.toISOString(),
        time: timeString,
        status,
        isUrgent,
        isImportant,
        userId,
        CGId,
        PATId
      }
    );

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


export const deletePatientReminder = async (CGId, PATId, remId, onRefresh) => {
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
            const response = await axios.delete(
              `${apiUrl}/caregiver/reminders/${CGId}/${PATId}/${remId}`,
            );

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
              console.error(
                "Error deleting reminder",
                error.response.data.message
              );
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
