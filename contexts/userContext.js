import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [authState, setAuthState] = useState("unauthenticated");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUserData = async () => {
    setAuthState("authenticating");
    const storedToken = await SecureStore.getItemAsync("token");

    if (storedToken) {
      try {
        const response = await axios.post(
          `${apiUrl}/v1/auth/get-userdata`,
          {},
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          },
        );

        if (response.data.status === "success") {
          setUser(response.data.userData);
          setRole(response.data.userData.role);
          setAuthState("authenticated");
        } else {
          console.error("Failed to fetch user data", response.data.message);
          Alert.alert("Error", response.data.message);
          setAuthState("unauthenticated");
          router.push("/sign-in");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data.");
        setAuthState("unauthenticated");
        router.push("/sign-in");
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("No token found");
      setAuthState("unauthenticated");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const refetch = async () => {
    setIsLoading(true);
    await fetchUserData();
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("token");
    setUser(null);
    setAuthState("unauthenticated");
    router.push("/sign-in");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        role,
        setRole,
        authState,
        setAuthState,
        isLoading,
        refetch,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
