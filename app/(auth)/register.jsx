import { View, TextInput, Pressable, Alert, Text } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { useRouter, Link } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";

const Register = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Care Giver", value: "CG" },
    { label: "Patient", value: "PAT" },
    { label: "Doctor", value: "DOC" },
  ]);

  const handleSubmit = async () => {
    try {
      console.log("Submitting form with:", { name, email, password, value });

      const response = await axios.post("http://192.168.0.115:5000/register", {
        name,
        email,
        password,
        value,
      });

      setName("");
      setEmail("");
      setPassword("");

      console.log("Response:", response);
      Alert.alert("Success", response.data.message);
      router.push("/(auth)/login");
    } catch (error) {
      console.error("Error:", error.response || error.message);
      if (error.response && error.response.data) {
        Alert.alert(
          "Error",
          error.response.data.message || "Failed to submit form"
        );
      } else {
        Alert.alert("Error", "Failed to submit form");
      }
    }
  };

  return (
    <View className="flex-1 justify-center p-4 m-6 pt-2 border border-black rounded-xl">
      <Text className="text-3xl py-2 mb-6 text-center font-bold">Register</Text>
      <TextInput
        className="h-12 border border-gray-600 mb-4 px-3 rounded"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="h-12 border border-gray-600 mb-4 px-3 rounded"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <DropDownPicker
        className="h-12 border border-gray-600 mb-4 px-3 rounded"
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
      />
      <TextInput
        className="h-12 border border-gray-300 mb-4 px-3 rounded"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Pressable
        onPress={handleSubmit}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
      >
        <Text className="text-center">Submit</Text>
      </Pressable>
      <View className="mt-4 flex-row justify-center items-center">
        <Text className="text-xl">Already have an account? </Text>
        <Link href="/login">
          <Text className="text-blue-500 text-xl">Click here to Login</Text>
        </Link>
      </View>
    </View>
  );
};

export default Register;
