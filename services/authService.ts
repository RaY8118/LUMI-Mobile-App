import axios from "axios";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";
import { Router } from "expo-router";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type RefetchFn = () => Promise<void>;

export const handleLogin = async (email: string, password: string, router: Router, refetch: RefetchFn): Promise<void> => {
  try {
    const response = await axios.post(`${apiUrl}/v1/auth/sign-in`, {
      email,
      password,
    });

    const token = response.data.token;
    await SecureStore.setItemAsync("token", token);
    await new Promise((res) => setTimeout(res, 100));
    await SecureStore.setItemAsync("email", email);
    await SecureStore.setItemAsync("password", password);
    await refetch();
    Alert.alert("Success", response.data.message);
    router.replace("/reminders");
  } catch (error: any) {
    if (error.response && error.response.data) {
      Alert.alert("Error", error.response.data.message);
    }
  }
};

export const authenticateAndAutofill = async (
  setEmail: (email: string) => void,
  setPassword: (password: string) => void,
  setIsAutofilled: (val: boolean) => void,
) => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();

  if (compatible && enrolled) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to autofill credentials",
    });

    if (result.success) {
      const storedEmail = await SecureStore.getItemAsync("email");
      const storedPassword = await SecureStore.getItemAsync("password");
      if (storedEmail && storedPassword) {
        setEmail(storedEmail);
        setPassword(storedPassword);
        setIsAutofilled(true);
      }
    } else {
      Alert.alert("Authentication failed. Cannot autofill credentials.");
    }
  } else {
    Alert.alert("Biometric authentication is not supported or not enrolled.");
  }
};

export const handleRegister = async (
  name: string,
  email: string,
  mobile: number,
  password: string,
  value: boolean,
  router: Router,
): Promise<void> => {
  try {
    const response = await axios.post(`${apiUrl}/v1/auth/sign-up`, {
      name,
      email,
      mobile,
      password,
      value,
    });
    Alert.alert("Success", response.data.message);
    router.push("/sign-in");
  } catch (error: any) {
    Alert.alert("Error", error.response?.data?.message || "Failed to register");
  }
};

export const handleReset = async (email: string, setIsLoading: (val: boolean) => void, setEmail: (email: string) => void): Promise<void> => {
  setIsLoading(true);
  try {
    const response = await axios.post(`${apiUrl}/v1/auth/reset-password`, {
      email,
    });
    setEmail("");
    Alert.alert("Success", response.data.message);
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      (error.response
        ? "Unable to process your request. Please try again."
        : "Check your internet connection and try again.");
    Alert.alert("Error", message);
  } finally {
    setIsLoading(false);
  }
};
