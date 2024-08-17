import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";

const LocationMap = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Function to fetch the current location
  const fetchLocation = useCallback(async () => {
    console.log("Fetching location..."); // Debugging statement
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
      setErrorMsg(null); // Clear any previous error messages
    } catch (error) {
      console.error("Error fetching location:", error); // Add error logging
      setErrorMsg("Failed to fetch location");
    }
  }, []);

  useEffect(() => {
    fetchLocation(); // Fetch location on component mount
  }, [fetchLocation]);

  // Handler for refreshing location
  const handleRefresh = () => {
    Alert.alert("Refreshing Location", "Please wait while we refresh your location.");
    fetchLocation();
  };

  let displayText = "Waiting...";
  if (errorMsg) {
    displayText = errorMsg;
  } else if (location) {
    displayText = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
  }

  return (
    <View className="flex-1 justify-center items-center p-4">
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
          backgroundColor: "#3b82f6", // Tailwind's bg-blue-500
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 10
        }}
      >
        <Text style={{ color: "#ffffff", fontWeight: "bold" }}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocationMap;
