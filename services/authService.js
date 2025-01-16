import axios from "axios";
import * as SecureStore from "expo-secure-store"
import * as LocalAuthentication from "expo-local-authentication"
import { Alert } from "react-native";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Funtion to handle the logging of user
export const handleLogin = async (email, password, router, refetch) => {
  try {
    const response = await axios.post(`${apiUrl}/sign-in`, {
      email,
      password,
    });

    const token = response.data.token;
    await SecureStore.setItemAsync("token", token);
    // Save email and password to SecureStore for future logins
    await SecureStore.setItemAsync("email", email);
    await SecureStore.setItemAsync("password", password);
    Alert.alert("Success", response.data.message);
    router.replace("/reminders");
    await refetch()
  } catch (error) {
    if (error.response && error.response.data) {
      Alert.alert("Error", error.response.data.message || "Failed to login");
    } else {
      Alert.alert("Error", "Failed to login");
    }
  }
};

// Combined function to handle authentication and autofill
export const authenticateAndAutofill = async (setEmail, setPassword, setIsAutofilled) => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();

  if (compatible && enrolled) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to autofill credentials",
    });

    if (result.success) {
      // If authentication is successful, autofill the credentials
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
};;

// Function to handle registration of new users
export const handleRegister = async (
  name,
  email,
  mobile,
  password,
  value,
  router
) => {
  try {
    const response = await axios.post(`${apiUrl}/sign-up`, {
      name,
      email,
      mobile,
      password,
      value,
    });
    Alert.alert("Success", response.data.message);
    router.push("/sign-in");
  } catch (error) {
    Alert.alert("Error", error.response?.data?.message || "Failed to register")
  }

}

// Function to handle the password reset
export const handleReset = async (email, setIsLoading, setEmail) => {
  setIsLoading(true);
  try {
    const response = await axios.post(`${apiUrl}/reset-password`, { email });
    setEmail("");
    Alert.alert("Success", response.data.message);
  } catch (error) {
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
