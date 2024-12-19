import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const SAVE_LOCATION_KEY = "savedLocation";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const LocationMap = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSafe, setIsSafe] = useState(null);
  const [savedLocation, setSavedLocation] = useState(null);

  // Function to calculate distance between two coordinates (Haversine formula)
  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // meters
  };

  // Function to fetch the saved home location
  const fetchSavedLocation = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        setErrorMsg("User not logged in");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub.userId;

      const response = await axios.get(
        `${apiUrl}/safe-location?userId=${userId}`
      );
      if (response.data.status === "success") {
        setSavedLocation(response.data.coords); // {latitude, longitude}
      } else {
        setErrorMsg("Home location not found");
      }
    } catch (error) {
      console.error("Error fetching saved location:", error.message);
      setErrorMsg("Failed to fetch saved location");
    }
  }, []);

  const getCurrentCoords = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return coords;
  };
  // Function to fetch current location
  const fetchCurrentLocation = useCallback(async () => {
    console.log("Fetching current location...");
    try {
      const coords = await getCurrentCoords();
      setLocation(coords); // Set current location on the map
    } catch (error) {
      console.error("Error fetching current location:", error.message);
      setErrorMsg("Failed to fetch location: " + error.message);
    }
  }, []);

  // Fetch location when the component mounts
  useEffect(() => {
    fetchCurrentLocation(); // Fetch location on mount
  }, [fetchCurrentLocation]);

  const saveLocation = useCallback(async () => {
    console.log("Fetching location...");
    Alert.alert("Saving Location", "Please wait while we save your location.");
    try {
      const coords = await getCurrentCoords();
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        setErrorMsg("User not logged in");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub.userId;

      await axios.post(`${apiUrl}/safe-location`, {
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

  useEffect(() => {
    let locationSubscription;

    const startLocationWatch = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
        },
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Current position:", latitude, longitude);
          compareLocations({ latitude, longitude });
        }
      );
    };

    startLocationWatch();

    return () => {
      // Clean up the subscription when the component unmounts
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [savedLocation]); // Re-run if the saved location changes

  // The compareLocations function (as defined earlier)
  const compareLocations = (currentLocation) => {
    if (!currentLocation || !savedLocation) {
      console.warn("Cannot compare locations - missing data");
      return;
    }

    const distance = getDistanceFromLatLonInMeters(
      currentLocation.latitude,
      currentLocation.longitude,
      savedLocation.latitude,
      savedLocation.longitude
    );

    if (distance > 2000) {
      Alert.alert("Warning", "You are outside the safe area!");
      setIsSafe(false);
      console.log("You are outside the safe area");
    } else {
      console.log("You are within the safe area");
      setIsSafe(true);
    }
  };

  // Fetch saved location on component mount
  useEffect(() => {
    fetchSavedLocation();
  }, [fetchSavedLocation]);

  const handleRefresh = () => {
    Alert.alert(
      "Refreshing Location",
      "Please wait while we refresh your location."
    );
    fetchSavedLocation();
    getCurrentCoords();
  };

  return (
    <View className="flex justify-start items-center p-2">
      <View className="flex justify-start items-center">
        {errorMsg ? (
          <Text className="text-red-600 text-xl text-center">{errorMsg}</Text>
        ) : isSafe === null ? (
          <Text className="text-gray-600 text-xl text-center">
            Checking if you are in a safe area...
          </Text>
        ) : isSafe ? (
          <Text className="text-green-600 text-2xl text-center font-bold">
            You are in a safe area.
          </Text>
        ) : (
          <Text className="text-red-600 text-2xl text-center font-bold">
            You are outside the safe area!
          </Text>
        )}
      </View>

      <View className="flex w-full justify-start items-center">
        {location ? (
          <View className="items-center">
            <Text className="text-sm text-center">Your Location</Text>
            <Text className="text-sm text-center">
              Latitude: {location.latitude}
            </Text>
            <Text className="text-sm text-center">
              Longitude: {location.longitude}
            </Text>
          </View>
        ) : (
          <Text className="text-gray-600 text-xl text-center">
            Fetching location...
          </Text>
        )}

        {location && (
          <MapView
            className="w-full h-4/5"
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {savedLocation && (
              <Circle
                center={{
                  latitude: savedLocation.latitude,
                  longitude: savedLocation.longitude,
                }}
                radius={2000} // 2000 meters radius
                strokeWidth={2}
                strokeColor="green"
                fillColor="rgba(0, 255, 0, 0.3)"
              />
            )}
            {location && (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="You are here"
              />
            )}
          </MapView>
        )}
      </View>

      <View className="items-center">
        <TouchableOpacity
          onPress={handleRefresh} // Reset location for refresh
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded border-b-4 border-blue-700 hover:border-blue-500 transition duration-200 ease-in-out"
        >
          <Text className="text-black font-bold text-lg">Refresh</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={saveLocation}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded border-b-4 border-blue-700 hover:border-blue-500 transition duration-200 ease-in-out"
        >
          <Text className="text-black font-bold text-lg">Save Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationMap;
