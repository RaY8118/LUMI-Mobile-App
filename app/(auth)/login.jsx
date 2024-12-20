import {
  View,
  TextInput,
  Alert,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { router } from "expo-router";
import { Link } from "expo-router";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import images from "../../constants/images";
import {
  handleLogin,
  checkBiometricSupport,
  authenticate,
  autofill,
} from "../../utils/auth";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isAutofilled, setIsAutofilled] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const autofillCredentials = async () => {
    await autofill(setEmail, setPassword, setIsAutofilled);
  };

  // Trigger biometric support check on mount
  useEffect(() => {
    const initBiometricCheck = async () => {
      await checkBiometricSupport(async () => {
        await authenticate(autofillCredentials);
      });
    };

    initBiometricCheck(); // Initialize biometric check
  }, []);

  // Handle autofill-triggered login
  useEffect(() => {
    if (isAutofilled) {
      handleLogin(email, password, router);
      setIsAutofilled(false); // Reset to prevent repeated logins
    }
  }, [isAutofilled, email, password, router]);

  return (
    <SafeAreaView className="flex-1 justify-center p-6 pt-2 mt-14 border border-x-2 bg-custom-primary rounded-xl">
      <View>
        <Image
          source={images.loginImg}
          resizeMode="contain"
          className="self-center mb-4 w-3/4 md:w-1/2" // Responsive width
        />
      </View>
      <Text className="text-5xl py-2 mb-3 text-center font-pbold text-custom-tertiary">
        Login
      </Text>
      <Text className="text-2xl py-3 mb-4 text-center font-pmedium text-custom-tertiary">
        Sign in to continue
      </Text>

      <View className="flex-row items-center p-4">
        <Fontisto name="email" size={32} color="black" className="mr-4" />
        <TextInput
          className="h-12 flex-1 border-2 border-black px-3 rounded-3xl bg-white font-pmedium ml-4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View className="flex-row items-center p-4">
        <MaterialIcons name="password" size={32} color="black" />
        <View className="flex-row items-center flex-1 ml-4">
          <TextInput
            className="h-12 flex-1 border-2 border-black px-3 rounded-3xl bg-white font-pmedium"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={togglePasswordVisibility} className="ml-6">
            <Ionicons
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={28}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => handleLogin(email, password, router)}
        className="bg-violet-800 py-2 px-5 rounded-3xl items-center mt-2 w-32 self-center"
      >
        <Text className="text-white font-pbold text-lg">Login</Text>
      </TouchableOpacity>

      {/* Add Manual Fingerprint Authentication Button */}
      <TouchableOpacity
        onPress={() => authenticate(autofillCredentials)} // Manually trigger fingerprint authentication
        className="bg-transparent py-2 px-2 rounded-full items-center mt-4 self-center"
      >
        <FontAwesome5 name="fingerprint" size={62} color="black" />
      </TouchableOpacity>

      <View className="mt-4 flex-row justify-center items-center">
        <Text className="font-plight text-lg">Don't have an account? </Text>
        <Link href="/register">
          <Text className="text-violet-500 font-pregular text-lg">
            Register
          </Text>
        </Link>
      </View>
      <View className="mt-4 flex-row justify-center items-center">
        <Text className="font-plight text-lg">Forgot password </Text>
        <Link href="/reset">
          <Text className="text-violet-500 font-pregular text-lg">
            click here!{" "}
          </Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Login;
