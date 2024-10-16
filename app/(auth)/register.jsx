import {
  View,
  TextInput,
  Alert,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import axios from "axios";
import { useRouter, Link } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import images from "../../constants/images";

const Register = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Care Giver", value: "CG" },
    { label: "Patient", value: "PAT" },
    { label: "Doctor", value: "DOC" },
  ]);

  const handleSubmit = async () => {
    try {
      console.log("Submitting form with:", {
        name,
        email,
        mobile,
        password,
        value,
      });

      const response = await axios.post(`${apiUrl}/register`, {
        name,
        email,
        mobile,
        password,
        value,
      });

      setName("");
      setEmail("");
      setPassword("");
      setMobile("");

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
    <SafeAreaView className="flex-1 p-6 mt-14 border border-x-2 border-violet-400 bg-custom-primary rounded-xl">
      <Image
        source={images.registerImg}
        resizeMode="contain"
        className="self-center"
      />
      <Text className="text-5xl py-2 mb-3 text-center font-pbold text-custom-tertiary">
        Create New
      </Text>
      <Text className="text-5xl py-2 mb-3 text-center font-pbold text-custom-tertiary">
        Account
      </Text>
      <View className="mt-2 mb-6 flex-row justify-center items-center">
        <Text className="text-lg font-plight">Already registered? </Text>
        <Link href="/login">
          <Text className="text-violet-500 text-lg font-pregular">Login</Text>
        </Link>
      </View>
      <View className="flex-row items-center p-4">
        <AntDesign name="user" size={32} color="black" />
        <TextInput
          className="h-12 w-80 border-2 border-black  px-3 rounded-3xl ml-4 bg-white font-pmedium"
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View className="flex-row items-center p-4">
        <Fontisto name="email" size={32} color="black" className="mr-4" />
        <TextInput
          className="h-12 w-80 border-2 border-black px-3 rounded-3xl ml-4 bg-white font-pmedium"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View className="flex-row items-center p-4">
        <AntDesign name="mobile1" size={32} color="black" />
        <TextInput
          className="h-12 w-80 border-2 border-black px-3 rounded-3xl ml-4 bg-white font-pmedium"
          placeholder="Mobile No"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />
      </View>
      <View className="flex-row items-center p-4">
        <Entypo name="list" size={32} color="black" />
        <DropDownPicker
          className="h-12 w-80 border-2 border-gray-600 px-3 rounded-3xl ml-4 bg-white "
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Select an option"
          dropDownContainerStyle={{
            backgroundColor: "white",
            borderRadius: 15,
            borderColor: "#4A5568",
            borderWidth: 1,
            width: "84%",
            marginTop: 4,
          }}
          listItemContainerStyle={{
            borderBottomWidth: 1,
            borderColor: "#E2E8F0",
          }}
          listItemLabelStyle={{
            color: "#2D3748",
            paddingVertical: 8,
          }}
        />
      </View>

      <View className="flex-row items-center p-4">
        <MaterialIcons name="password" size={32} color="black" />
        <TextInput
          className="h-12 w-80 border-2 border-black  px-3 rounded-3xl ml-4 bg-white font-pmedium"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-violet-800 py-2 px-5 rounded-3xl items-center mt-2 w-32 self-center"
      >
        <Text className="text-white font-pbold text-lg">Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Register;
