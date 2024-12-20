import React, { useState, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import LocationMapView from "../components/LocationMapView";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import { Alert } from "react-native";

const LocationMapContainer = () => {
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
    <LocationMapView
      location={location}
      errorMsg={errorMsg}
      isSafe={isSafe}
      savedLocation={savedLocation}
      handleRefresh={handleRefresh}
      saveLocation={saveLocation}
    />
  );
};

export default LocationMapContainer;
