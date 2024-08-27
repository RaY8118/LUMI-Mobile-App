import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const LocationMap = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [homeLocation, setHomeLocation] = useState(null);

  const fetchLocation = useCallback(async () => {
    console.log("Fetching location...");
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    try {
      let { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(coords);
      console.log(coords);
      setErrorMsg(null);
    } catch (error) {
      console.error("Error fetching location:", error);
      setErrorMsg("Failed to fetch location");
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const handleRefresh = () => {
    Alert.alert(
      "Refreshing Location",
      "Please wait while we refresh your location."
    );
    fetchLocation();
  };

  let displayText = "Waiting...";
  if (errorMsg) {
    displayText = errorMsg;
  } else if (location) {
    displayText = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
  }

  const saveLocation = useCallback(async () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    console.log("Fetching location...");
    Alert.alert("Saving Location", "Please wait while we save your location.");

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    try {
      let { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        setErrorMsg("User not logged in");
        return;
      }

      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      const userId = decodedToken.sub.userId;
      console.log(userId);
      setHomeLocation(coords);
      console.log("Current Location:", coords);
      setErrorMsg(null);

      const response = await axios.post(`${apiUrl}/homelocation`, {
        userId,
        coords,
      });

      console.log("Response:", response.data);
      Alert.alert("Success", "Your location has been saved successfully.");
    } catch (error) {
      console.error("Error saving location:", error.message);
      setErrorMsg(
        "Failed to save location: " +
          (error.response?.data?.message || error.message)
      );
    }
  }, [homeLocation]);

  return (
    <View className="flex-1 justify-center items-center p-4">
      {location ? (
        <View>
          <Text>Your Location</Text>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
        </View>
      ) : (
        <Text>Fetching location</Text>
      )}
      {location ? (
        <MapView
          className="w-full h-4/5"
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
          />
        </MapView>
      ) : (
        <Text className="text-lg">{displayText}</Text>
      )}
      <TouchableOpacity
        onPress={handleRefresh}
        style={{
          backgroundColor: "#3b82f6",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#ffffff", fontWeight: "bold" }}>Refresh</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={saveLocation}
        style={{
          backgroundColor: "#3b82f6",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
          Save location
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocationMap;
