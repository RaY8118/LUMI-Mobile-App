import React, { useState } from "react";
import {
  Modal,
  Text,
  Pressable,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import Checkbox from "expo-checkbox";
import { Icon } from "@/constants/Icons";

const AddModalComponent = ({
  addModalVisible,
  setAddModalVisible,
  title,
  setTitle,
  description,
  setDescription,
  date,
  setDate,
  time,
  setTime,
  setStatus,
  isUrgent,
  setIsUrgent,
  isImportant,
  setIsImportant,
  onSave,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
  ]);

  const onChange = (selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    console.log(currentDate);

  };

  const onTimeChange = (selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) setTime(selectedTime);
    console.log(selectedTime);

  };

  return (
    <View className="flex-1 justify-center items-center mt-6">
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => {
          setAddModalVisible(false);
        }}
      >
        <View className="flex-1 justify-center items-center mt-6">
          <View className="m-5 bg-white rounded-xl p-20 items-center shadow-md shadow-black">
            <TouchableOpacity
              className="absolute top-3 right-5"
              onPress={() => setAddModalVisible(false)}
            >
              <Icon
                name="circle-with-cross"
                size={30}
                color="black"
                library="Entypo"
              />
            </TouchableOpacity>

            <Text className="text-lg font-bold mb-5">Add new reminder</Text>

            <TextInput
              className="h-12 w-72 border border-gray-600 mb-4 px-3 rounded"
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              className="h-12 w-72 border border-gray-600 mb-4 px-3 rounded"
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />

            <DropDownPicker
              className="h-12 w-72 border border-gray-600 mb-4 px-3 rounded"
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={(callback) => {
                const selectedValue = callback(value);
                setValue(selectedValue);
                setStatus(selectedValue);
              }}
              setItems={setItems}
            />

            <TouchableOpacity
              className="h-12 w-72 border border-gray-600 mb-4 px-3 rounded justify-center"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-gray-700">
                {date ? date.toLocaleDateString() : "Pick a date"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}

            <TouchableOpacity
              className="h-12 w-72 border border-gray-600 mb-4 px-3 rounded justify-center"
              onPress={() => setShowTimePicker(true)}
            >
              <Text className="text-gray-700">
                {time instanceof Date && !isNaN(time)
                  ? time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                  : "Pick a time"}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={time instanceof Date ? time : new Date()}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}

            <View className="flex-row">
              <View className=" flex-row w-30 p-2">
                <Checkbox
                  className="m-2 mr-1"
                  value={isUrgent}
                  onValueChange={setIsUrgent}
                  color={"red"}
                />
                <Text className="m-2">Urgent</Text>
              </View>
              <View className=" flex-row w-30 p-2">
                <Checkbox
                  className="m-2 mr-1"
                  value={isImportant}
                  onValueChange={setIsImportant}
                  color={"orange"}
                />
                <Text className="m-2">Important</Text>
              </View>
            </View>
            <Pressable
              className="bg-black rounded-xl p-3 mt-3"
              onPress={() => {
                onSave();
                setAddModalVisible(false);
              }}
            >
              <Text className="text-white font-bold text-center">Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddModalComponent;
