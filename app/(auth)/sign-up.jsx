import { View, ScrollView, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useRouter, Link } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import images from "../../constants/images";
import { handleRegister } from "../../services/authService";
import { Icon } from "@/constants/Icons";
import CustomInput from "@/components/CustomInput";
const Register = () => {
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
    handleRegister(name, email, mobile, password, value, router);
  };

  return (
    <ScrollView className="flex-1 p-6 mt-14 border border-x-2 border-violet-400 bg-custom-primary rounded-xl">
      <View>
        <Image
          source={images.registerImg}
          resizeMode="contain"
          className="self-center mb-4 w-3/4 md:w-1/2" // Responsive width
        />
        <Text className="text-5xl py-2 mb-3 text-center font-pbold text-custom-tertiary">
          Create New
        </Text>
        <Text className="text-5xl py-2 mb-3 text-center font-pbold text-custom-tertiary">
          Account
        </Text>
        <View className="mt-2 mb-6 flex-row justify-center items-center">
          <Text className="text-lg font-plight">Already registered? </Text>
          <Link href="/sign-in">
            <Text className="text-violet-500 text-lg font-pregular">
              Sign In
            </Text>
          </Link>
        </View>

        {/* Name Input */}
        <View className="flex-row items-center p-4">
          <Icon name="user" size={32} color="black" library="AntDesign" />
          <CustomInput placeholder="Name" value={name} onChangeText={setName} />
        </View>

        {/* Email Input */}
        <View className="flex-row items-center p-4">
          <Icon name="email" size={32} color="black" library="Fontisto" />
          <CustomInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* Mobile Input */}
        <View className="flex-row items-center p-4">
          <Icon name="mobile1" size={32} color="black" library="AntDesign" />
          <CustomInput
            placeholder="Mobile No"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
          />
        </View>

        {/* Dropdown Picker */}
        <View className="flex-row items-center p-4">
          <Icon name="list" size={32} color="black" library="Entypo" />
          <DropDownPicker
            className="h-12 w-96 flex-1 border-2 border-gray-600 px-3 rounded-3xl ml-4 bg-white"
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
              width: "100%",
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

        {/* Password Input */}
        <View className="flex-row items-center p-4">
          <Icon
            name="password"
            size={32}
            color="black"
            library="MaterialIcons"
          />
          <CustomInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-violet-800 py-2 px-5 rounded-3xl items-center mt-4 w-32 self-center"
        >
          <Text className="text-white font-pbold text-lg">Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Register;
