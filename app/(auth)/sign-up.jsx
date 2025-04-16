import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useRouter, Link } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import { handleRegister } from "@/services/authService";
import { Icon } from "@/constants/Icons";
import Images from "@/constants/Images"
import { TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Register = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Care Giver", value: "CG" },
    { label: "Patient", value: "PAT" },
  ]);

  const handleSubmit = async () => {
    handleRegister(name, email, mobile, password, value, router);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };
  return (
    <SafeAreaView className="flex-1 p-6 bg-white rounded-xl">
      <View className="mt-auto mb-auto">
        <View>
          <Image
            source={Images.registerImg}
            resizeMode="contain"
            className="self-center mb-4 w-3/4 md:w-1/2" // Responsive width
          />
        </View>
        <Text className="text-4xl font-bold text-blue-600 text-center mb-2">
          Create New
        </Text>
        <Text className="text-4xl font-bold text-blue-600 text-center mb-2">
          Account
        </Text>
        <View className="mt-2 mb-6 flex-row justify-center items-center">
          <Text className="text-gray-600">Already registered? </Text>
          <Link href="/sign-in">
            <Text className="text-blue-600 font-medium">Sign In</Text>
          </Link>
        </View>

        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-6">
          <Icon name="user" size={24} color="gray" library="AntDesign" />
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            className="flex-1 ml-3 text-base text-gray-800"
          />
        </View>

        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-6">
          <Icon name="email" size={24} color="gray" library="Fontisto" />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="flex-1 ml-3 text-base text-gray-800"
          />
        </View>

        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-6">
          <Icon name="mobile1" size={24} color="gray" library="AntDesign" />
          <TextInput
            placeholder="Mobile No"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            className="flex-1 ml-3 text-base text-gray-800"
          />
        </View>

        <View className="flex-row items-center px-4 py-3 mb-6 bg-gray-100 rounded-xl z-50">
          <Icon name="list" size={24} color="gray" library="Entypo" />
          <View className="flex-1 ml-3">
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="Select an option"
              style={{
                borderWidth: 0,
                backgroundColor: "transparent",
              }}
              dropDownContainerStyle={{
                backgroundColor: "#f9fafb",
                borderRadius: 18,
                borderColor: "#d1d5db",
                borderWidth: 1.2,
                marginTop: 6,
                zIndex: 1000,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4,
                width: "100%"
              }}
              listItemContainerStyle={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderBottomWidth: 0.5,
                borderColor: "#e5e7eb",
                borderRadius: 12,
                marginVertical: 2,
              }}
              listItemLabelStyle={{
                fontSize: 16,
                color: "#374151",
              }}

            />
          </View>
        </View>

        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-6">
          <Icon name="password" size={24} color="gray" library="MaterialIcons" />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            className="flex-1 ml-3 text-base text-gray-800"
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={24}
              color="gray"
              library="Ionicons"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-blue-600 rounded-2xl py-3 items-center mb-4"
        >
          <Text className="text-white font-semibold text-lg">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Register;
