import axios from 'axios';
import { Alert } from 'react-native';

const apiUrl = process.env.EXPO_PUBLIC_API_URL


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

        // Ensure time is a string in "HH:mm" format
        let timeString;
        if (typeof time === "string" && time.includes(":")) {
            timeString = time; // Use the string as is
        } else {
            timeString = new Date(time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false, // Force 24-hour format
            });
        }

        // Combine date and time into a single Date object
        const reminderTime = new Date(date); // Create a Date object from the date
        const [hours, minutes] = timeString.split(":"); // Extract hours and minutes
        reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0); // Set hours and minutes with 0 seconds and milliseconds

        const reminderData = {
            title,
            description,
            date,
            status,
            time: timeString, // Use formatted timeString
            isUrgent,
            isImportant,
            userId,
        };

        // Make the API request to save the reminder
        const response = await axios.post(`${apiUrl}/patient/reminders`, reminderData);

        // Clear form fields and reset state
        setTitle("");
        setDescription("");
        setDate(new Date());
        setTime(
            new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false, // Force 24-hour format for consistency
            })
        );
        setStatus("pending");
        setIsUrgent(false);
        setIsImportant(false);

        // Notify success
        Alert.alert("Success", response.data.message);
        onRefresh();
        setAddModalVisible(false);

        return response;
    } catch (error) {
        console.error("Error posting reminder", error.response.data.message);
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
    scheduleNotification,
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

        // Ensure time is a string in "HH:mm" format (24-hour format)
        const timeString =
            typeof time === "string"
                ? time
                : time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                });

        // Combine date and time into a single Date object
        const reminderTime = new Date(date); // Use the date value
        const [hours, minutes] = timeString.split(":"); // Assuming time is in "HH:mm" format
        reminderTime.setHours(parseInt(hours), parseInt(minutes)); // Set hours and minutes

        // Ensure the reminderTime is valid before proceeding
        if (isNaN(reminderTime.getTime())) {
            Alert.alert(
                "Error",
                "Invalid date and time. Please check your inputs."
            );
            return;
        }
        const response = await axios.put(
            `${apiUrl}/patient/reminders/${selectedReminder.remId}`,
            {
                title,
                description,
                date: date.toISOString(),
                time: timeString, // Ensure time is sent as a string
                status,
                isUrgent,
                isImportant,
                userId
            }
        );

        // Check if the response is successful
        if (response.status === 200) {
            Alert.alert("Success", response.data.message);
            onRefresh(); // Refresh the reminders list
            handleEditModalClose(); // Close the edit modal
            // Schedule the notification for the updated reminder
            await scheduleNotification(title, description, reminderTime); // Pass the reminder time
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

        // Ensure time is a string in "HH:mm" format
        let timeString;
        if (typeof time === "string" && time.includes(":")) {
            timeString = time; // Use the string as is
        } else {
            timeString = new Date(time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false, // Force 24-hour format
            });
        }

        // Combine date and time into a single Date object
        const reminderTime = new Date(date); // Create a Date object from the date
        const [hours, minutes] = timeString.split(":"); // Extract hours and minutes
        reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0); // Set hours and minutes with 0 seconds and milliseconds

        const reminderData = {
            title,
            description,
            date,
            status,
            time: timeString, // Use formatted timeString
            isUrgent,
            isImportant,
            userId,
            PATId,
            CGId
        };

        // Make the API request to save the reminder
        const response = await axios.post(`${apiUrl}/caregiver/reminders`, reminderData);

        // Clear form fields and reset state
        setTitle("");
        setDescription("");
        setDate(new Date());
        setTime(
            new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false, // Force 24-hour format for consistency
            })
        );
        setStatus("pending");
        setIsUrgent(false);
        setIsImportant(false);

        // Notify success
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

        // Ensure time is a string in "HH:mm" format (24-hour format)
        const timeString =
            typeof time === "string"
                ? time
                : time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                });

        // Combine date and time into a single Date object
        const reminderTime = new Date(date); // Use the date value
        const [hours, minutes] = timeString.split(":"); // Assuming time is in "HH:mm" format
        reminderTime.setHours(parseInt(hours), parseInt(minutes)); // Set hours and minutes

        // Ensure the reminderTime is valid before proceeding
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
                time: timeString, // Ensure time is sent as a string
                status,
                isUrgent,
                isImportant,
                userId,
                CGId,
                PATId
            }
        );

        // Check if the response is successful
        if (response.status === 200) {
            Alert.alert("Success", response.data.message);
            onRefresh(); // Refresh the reminders list
            handleEditModalClose(); // Close the edit modal
            // Schedule the notification for the updated reminder
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