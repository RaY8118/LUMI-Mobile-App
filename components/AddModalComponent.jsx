import React, { useState } from "react";
import { Modal, Text, Pressable, View, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import Entypo from '@expo/vector-icons/Entypo';

const AddModalComponent = ({
  AddModalVisible,
  setAddModalVisible,
  title,
  setTitle,
  description,
  setDescription,
  date,
  setDate,
  setStatus,
  onSave,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
  ]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <View className="flex-1 justify-center items-center mt-6">
      <Modal
        animationType="slide"
        transparent={true}
        visible={AddModalVisible}
        onRequestClose={() => {
          setAddModalVisible(false);
        }}
      >
        <View className="flex-1 justify-center items-center mt-6">
          <View className="m-5 bg-white rounded-xl p-20 items-center shadow-md shadow-black">
            {/* Close Button */}
            <Pressable
              className="absolute top-3 right-5"
              onPress={() => setAddModalVisible(false)}
            >
              <Entypo name="circle-with-cross" size={30} color="black" />
            </Pressable>

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

            <Pressable
              className="h-12 w-72 border border-gray-600 mb-4 px-3 rounded justify-center"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-gray-700">
                {date ? date.toLocaleDateString() : "Pick a date"}
              </Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}

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