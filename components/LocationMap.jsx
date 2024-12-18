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

  // Function to fetch current location
  const fetchCurrentLocation = useCallback(async () => {
    console.log("Fetching current location...");

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    try {
      let { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
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

  // Function to compare current location with saved location
  const compareLocations = (currentLocation) => {
    if (!savedLocation) return;

    const distance = getDistanceFromLatLonInMeters(
      currentLocation.latitude,
      currentLocation.longitude,
      savedLocation.latitude,
      savedLocation.longitude
    );

    // Assuming a safe distance of 2000 meters
    if (distance > 2000) {
      Alert.alert("Warning", "You are outside the safe area!");
      setIsSafe(false);
      console.log("You are outside the safe area");
    } else {
      console.log("You are within the safe area");
      setIsSafe(true);
    }
  };

  // Fetch current location periodically (e.g., every 10 seconds)
  useEffect(() => {
    const interval = setInterval(async () => {
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
        setErrorMsg(null);

        compareLocations(coords); // Compare current location with saved location
      } catch (error) {
        setErrorMsg("Failed to fetch location");
      }
    }, 10000); // Fetch location every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [savedLocation]);

  // Fetch saved location on component mount
  useEffect(() => {
    fetchSavedLocation();
  }, [fetchSavedLocation]);

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : isSafe === null ? (
          <Text style={styles.infoText}>
            Checking if you are in a safe area...
          </Text>
        ) : isSafe ? (
          <Text style={styles.safeText}>You are in a safe area.</Text>
        ) : (
          <Text style={styles.dangerText}>You are outside the safe area!</Text>
        )}
      </View>

      <View style={styles.locationContainer}>
        {location ? (
          <View style={styles.locationDetails}>
            <Text style={styles.locationText}>Your Location</Text>
            <Text style={styles.locationText}>
              Latitude: {location.latitude}
            </Text>
            <Text style={styles.locationText}>
              Longitude: {location.longitude}
            </Text>
          </View>
        ) : (
          <Text style={styles.infoText}>Fetching location...</Text>
        )}

        {location && (
          <MapView
            style={styles.mapView}
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

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() => setLocation(null)} // Reset location for refresh
          style={styles.button}
        >
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={saveLocation} style={styles.button}>
          <Text style={styles.buttonText}>Save Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styling for components
const styles = {
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
  },
  statusContainer: {
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  infoText: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
  },
  safeText: {
    color: "green",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  dangerText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  locationContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  locationDetails: {
    marginBottom: 16,
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    marginVertical: 2,
    textAlign: "center",
  },
  mapView: {
    width: "100%",
    height: "80%",
  },
  actionsContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    width: "80%",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
};

export default LocationMap;
