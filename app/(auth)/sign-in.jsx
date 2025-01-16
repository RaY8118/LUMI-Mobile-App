import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import images from "../../constants/images";
import { Icon } from "@/constants/Icons";
import { handleLogin, authenticateAndAutofill } from "@/services/authService";
import { useUser } from "@/hooks/useUser";
import CustomInput from "@/components/CustomInput";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isAutofilled, setIsAutofilled] = useState(false);
  const { refetch } = useUser();
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Handle autofill-triggered login
  useEffect(() => {
    const login = async () => {
      if (isAutofilled) {
        await handleLogin(email, password, router, refetch);
        setIsAutofilled(false); // Reset after successful login
      }
    };

    login(); // Call the async function
  }, [isAutofilled, email, password, router]);

  // Handle Biometric Authentication & Autofill Combined
  const handleBiometricAuthentication = async () => {
    await authenticateAndAutofill(setEmail, setPassword, setIsAutofilled);
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
      <Text className="text-5xl py-2 mb-3 text-center font-bold text-custom-tertiary">
        Sign In
      </Text>
      <Text className="text-2xl py-3 mb-4 text-center font-medium text-custom-tertiary">
        Sign in to continue
      </Text>

      <View className="flex-row items-center p-4">
        <Icon name="email" size={32} color="black" library="Fontisto" />
        <CustomInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View className="flex-row items-center p-4">
        <Icon name="password" size={32} color="black" library="MaterialIcons" />
        <View className="flex-row items-center flex-1 ml-4">
          <CustomInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={togglePasswordVisibility} className="ml-6">
            <Icon
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={28}
              color="black"
              library="Ionicons"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => handleLogin(email, password, router, refetch)}
        className="bg-violet-800 py-2 px-5 rounded-3xl items-center mt-2 w-32 self-center"
      >
        <Text className="text-white font-pbold text-lg">Login</Text>
      </TouchableOpacity>

      {/* Add Manual Fingerprint Authentication Button */}
      <TouchableOpacity
        onPress={() => handleBiometricAuthentication()} // Manually trigger fingerprint authentication
        className="bg-transparent py-2 px-2 rounded-full items-center mt-4 self-center"
      >
        <Icon
          name="fingerprint"
          size={62}
          color="black"
          library="FontAwesome5"
        />
      </TouchableOpacity>

      <View className="mt-4 flex-row justify-center items-center">
        <Text className="font-plight text-lg">Don't have an account? </Text>
        <Link href="/sign-up">
          <Text className="text-violet-500 font-pregular text-lg">Sign Up</Text>
        </Link>
      </View>
      <View className="mt-4 flex-row justify-center items-center">
        <Text className="font-plight text-lg">Forgot password </Text>
        <Link href="/forgot-password">
          <Text className="text-violet-500 font-pregular text-lg">
            click here!{" "}
          </Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
