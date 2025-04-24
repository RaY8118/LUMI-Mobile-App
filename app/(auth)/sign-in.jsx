import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import { Icon } from "@/constants/Icons";
import { handleLogin, authenticateAndAutofill } from "@/services/authService";
import { useUser } from "@/hooks/useUser";
import Images from "@/constants/Images";
import Spinner from "@/components/Spinner"

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isAutofilled, setIsAutofilled] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const { refetch } = useUser();
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    const login = async () => {
      if (isAutofilled) {
        setIsLoading(true)
        await handleLogin(email, password, router, refetch);
        setIsLoading(false)
        setIsAutofilled(false);
      }
    };
    login();
  }, [isAutofilled, email, password, router]);

  const handleBiometricAuthentication = async () => {
    await authenticateAndAutofill(setEmail, setPassword, setIsAutofilled);
  };

  return (
    <SafeAreaView className="flex-1 bg-purple-100 px-6 justify-center">
      <View className="mt-auto mb-auto">
        <View>
          <Image
            source={Images.loginImg}
            resizeMode="contain"
            className="self-center mb-4 w-3/4 md:w-1/2"
          />
        </View>
        <Text className="text-4xl font-bold text-purple-600 text-center mb-2">
          Welcome Back
        </Text>
        <Text className="text-base text-gray-700 text-center mb-6">
          Sign in to continue to Lumi
        </Text>

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
          onPress={async () => {
            setIsLoading(true)
            await handleLogin(email, password, router, refetch)
            setIsLoading(false)
          }}
          className="bg-purple-600 rounded-2xl py-3 items-center mb-6"
        >
          <Text className="text-white font-semibold text-lg">Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleBiometricAuthentication}
          className="items-center mb-6"
        >
          <Icon
            name="fingerprint"
            size={58}
            color="black"
            library="FontAwesome5"
          />
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6 mb-2">
          <Text className="text-gray-600">Don't have an account? </Text>
          <Link href="/sign-up">
            <Text className="text-purple-600 font-medium">Sign Up</Text>
          </Link>
        </View>

        <View className="flex-row justify-center">
          <Text className="text-gray-600">Forgot password? </Text>
          <Link href="/forgot-password">
            <Text className="text-purple-600 font-medium">Click here</Text>
          </Link>
        </View>
      </View>

      {isLoading && <Spinner message="Signing in..." />}
    </SafeAreaView>

  );
};

export default SignIn;
