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
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication"; // For local authentication
import { useNavigation } from "@react-navigation/native";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import images from "../../constants/images";

const Login = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isAutofilled, setIsAutofilled] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    checkBiometricSupport(); // Check for biometrics and attempt autofill on mount
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        email,
        password,
      });

      const token = response.data.token;
      await SecureStore.setItemAsync("token", token);

      // Save email and password to SecureStore for future logins
      await SecureStore.setItemAsync("email", email);
      await SecureStore.setItemAsync("password", password);

      navigation.reset({
        index: 0,
        routes: [{ name: "index" }],
      });
      setEmail("");
      setPassword("");
      Alert.alert("Success", response.data.message);
      router.push("/main");
    } catch (error) {
      if (error.response && error.response.data) {
        Alert.alert("Error", error.response.data.message || "Failed to login");
      } else {
        Alert.alert("Error", "Failed to login");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Check if the device supports biometric authentication
  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    if (compatible && enrolled) {
      authenticateUser(); // If biometrics are supported and set up, try authenticating the user
    } else {
      Alert.alert("Biometric authentication not available or set up.");
    }
  };

  // Authenticate user using fingerprint/face recognition
  const authenticateUser = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to autofill credentials",
    });

    if (result.success) {
      autofillCredentials(); // If authentication succeeds, autofill credentials
    } else {
      Alert.alert("Authentication failed. Cannot autofill credentials.");
    }
  };

  // Autofill email and password if stored
  useEffect(() => {
    if (isAutofilled) {
      handleLogin();
      setIsAutofilled(false); // Reset after handling login
    }
  }, [isAutofilled]);

  const autofillCredentials = async () => {
    const storedEmail = await SecureStore.getItemAsync("email");
    const storedPassword = await SecureStore.getItemAsync("password");

    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setIsAutofilled(true); // Trigger login attempt
    }
  };

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
        onPress={handleLogin}
        className="bg-violet-800 py-2 px-5 rounded-3xl items-center mt-2 w-32 self-center"
      >
        <Text className="text-white font-pbold text-lg">Login</Text>
      </TouchableOpacity>

      {/* Add Manual Fingerprint Authentication Button */}
      <TouchableOpacity
        onPress={authenticateUser} // Manually trigger fingerprint authentication
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
    </SafeAreaView>
  );
};

export default Login;
