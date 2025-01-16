import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { Icon } from "@/constants/Icons";
import {
  fetchPatientReminders,
  postPatientReminder,
  updatePatientReminder,
  deletePatientReminder,
} from "@/services/remindersService";
import EditModalComponent from "@/components/EditModalComponent";
import AddModalComponent from "@/components/AddModalComponent";
import { usePatient } from "@/hooks/usePatient"
const CgReminders = () => {
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
  const { CGId, PATId, PATName } = usePatient()

  const fetchPatientData = async () => {
    if (CGId && PATId) {
      fetchPatientReminders(
        CGId,
        PATId,
        setReminders,
        setError,
        setLoading,
        setRefreshing
      );
    } else {
      setLoading(false);
    }
  };

  const postPatientReminders = async () => {
    const patientReminderData = {
      title,
      description,
      date,
      time,
      status,
      isUrgent,
      isImportant,
      userId: PATId,
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
      onRefresh,
    };
    await postPatientReminder(patientReminderData);
  };
  const updatePatientReminders = async () => {
    const patientReminderData = {
      selectedReminder,
      userId: PATId,
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
    };
    await updatePatientReminder(patientReminderData);
  };

  const deletePatientReminders = async (remId) => {
    await deletePatientReminder(CGId, PATId, remId, onRefresh);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPatientData();
    resetEditFields();
  }, []);

  const handleEditModalClose = () => {
    resetEditFields();
    setEditModalVisible(false);
  };

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

  useEffect(() => {
    fetchPatientData();
  }, [CGId, PATId]);

  if (loading) {
    return <Text>Loading reminders...</Text>;
  }

  return (
    <>
      <ScrollView
        className="border border-black bg-white rounded-lg "
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-row flex-wrap justify-center items-center">
          <View className="pt-2">
            <Text className="text-3xl m-4 mt-2">{PATName} Reminders</Text>
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
                  onPress={() => deletePatientReminders(reminder.remId)}
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
            onSave={postPatientReminders}
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
            onSave={updatePatientReminders}
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

export default CgReminders;
