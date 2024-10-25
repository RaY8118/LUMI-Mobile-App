import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";

const BACKGROUND_LOCATION_TASK = "BACKGROUND-LOCATION-TASK";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Define the background location task
TaskManager.defineTask(
  BACKGROUND_LOCATION_TASK,
  async ({ data: { locations }, error }) => {
    if (error) {
      console.error("Error in background location task:", error);
      return;
    }

    const location = locations[0].coords;

    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        console.error("User not logged in");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub.userId;

      await axios.post(`${apiUrl}/findlocation`, {
        userId,
        coords: location,
      });
    } catch (error) {
      console.error("Error in background location task:", error);
    }
  }
);

// Function to start background location tracking
const startBackgroundLocationTracking = async () => {
  await Location.requestForegroundPermissionsAsync();
  await Location.requestBackgroundPermissionsAsync(); // Request background permissions
  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: Location.Accuracy.High,
    timeInterval: 10000, // Send location every 10 seconds
    distanceInterval: 0, // No distance interval
  });
};

// Helper function to calculate distance
const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};

const LocationMap = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // User-defined safe area (you can replace these values with user inputs)
  const [safeArea, setSafeArea] = useState({
    latitude: 19.1357106, // Example latitude
    longitude: 72.9371153, // Example longitude
    radius: 2000, // Radius in meters
  });

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

      // Check if within safe area
      if (!isWithinSafeArea(coords)) {
        Alert.alert("Warning", "You are outside of the safe area!");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setErrorMsg("Failed to fetch location");
    }
  }, []);

  const isWithinSafeArea = (currentLocation) => {
    const distance = getDistanceFromLatLonInMeters(
      currentLocation.latitude,
      currentLocation.longitude,
      safeArea.latitude,
      safeArea.longitude
    );
    return distance <= safeArea.radius;
  };

  useEffect(() => {
    fetchLocation();
    startBackgroundLocationTracking(); // Start background tracking

    return () => {
      // Stop background location updates when component unmounts
      Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
    };
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
      const userId = decodedToken.sub.userId;

      await axios.post(`${apiUrl}/homelocation`, {
        userId,
        coords,
      });

      Alert.alert("Success", "Your location has been saved successfully.");
    } catch (error) {
      console.error("Error saving location:", error.message);
      setErrorMsg(
        "Failed to save location: " +
          (error.response?.data?.message || error.message)
      );
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      {location ? (
        <View>
          <Text>Your Location</Text>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
        </View>
      ) : (
        <Text>Fetching location...</Text>
      )}

      {location && (
        <MapView
          style={{ width: "100%", height: "80%" }}
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
          Save Location
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocationMap;
