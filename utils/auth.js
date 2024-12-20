import axios from "axios";
import * as SecureStore from "expo-secure-store"
import * as LocalAuthentication from "expo-local-authentication"
import { Alert } from "react-native";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const handleLogin = async (email, password, router) => {
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

// Check if the device supports biometric authentication
export const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    if (compatible && enrolled) {
        authenticate(); // If biometrics are supported and set up, try authenticating the user
    }
};

// Authenticate user using fingerprint/face recognition
export const authenticate = async (autofillCredentials) => {
    const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to autofill credentials",
    });

    if (result.success) {
        if (autofillCredentials) await autofillCredentials(); // Call autofill credentials if provided
    } else {
        Alert.alert("Authentication failed. Cannot autofill credentials.");
    }
};


export const autofill = async (setEmail, setPassword, setIsAutofilled) => {
    const storedEmail = await SecureStore.getItemAsync("email");
    const storedPassword = await SecureStore.getItemAsync("password");
    if (storedEmail && storedPassword) {
        setEmail(storedEmail);
        setPassword(storedPassword);
        setIsAutofilled(true);
    }
};

export const handleRegister = async (
    name,
    email,
    mobile,
    password,
    value,
    router
) => {
    try {
        const response = await axios.post(`${apiUrl}/register`, {
            name,
            email,
            mobile,
            password,
            value,
        });
        Alert.alert("Success", response.data.message);
        router.push("/login");
    } catch (error) {
        Alert.alert("Error", error.response?.data?.message || "Failed to register")
    }

}