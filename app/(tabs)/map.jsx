import React, { useState, useEffect, useCallback } from "react";
import {
  getDistanceFromLatLonInMeters,
  fetchSavedLocation,
  getCurrentCoords,
  saveLocation,
} from "@/services/locationService";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
const Map = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSafe, setIsSafe] = useState(null);
  const [savedLocation, setSavedLocation] = useState(null);

  // Function to compare current location with the saved location
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
    } else {
      setIsSafe(true);
    }
  };

  const fetchCurrentLocation = useCallback(async () => {
    try {
      const coords = await getCurrentCoords();
      setLocation(coords);
    } catch (error) {
      setErrorMsg(error.message);
    }
  }, []);

  useEffect(() => {
    fetchCurrentLocation();
  }, [fetchCurrentLocation]);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const homeLocation = await fetchSavedLocation();
        setSavedLocation(homeLocation);
      } catch (error) {
        setErrorMsg(error.message);
      }
    };

    fetchLocationData();
  }, []);

  useEffect(() => {
    let locationSubscription;

    const startLocationWatch = async () => {
      try {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // Update every 5 seconds
          },
          (position) => {
            const { latitude, longitude } = position.coords;
            compareLocations({ latitude, longitude });
          }
        );
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    startLocationWatch();

    return () => {
      if (locationSubscription) locationSubscription.remove();
    };
  }, [savedLocation]);

  const handleSaveLocation = async () => {
    try {
      await saveLocation();
      Alert.alert("Success", "Your location has been saved successfully.");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleRefresh = async () => {
    try {
      const homeLocation = await fetchSavedLocation();
      setSavedLocation(homeLocation);
      const currentCoords = await getCurrentCoords();
      setLocation(currentCoords);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <View className="flex justify-start items-center p-2">
      {/* Message Section */}
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

      {/* Map Section */}
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
              radius={2000}
              strokeWidth={2}
              strokeColor="green"
              fillColor="rgba(0, 255, 0, 0.3)"
            />
          )}
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
          />
        </MapView>
      )}

      {/* Buttons */}
      <View className="items-center flex-row justify-center">
        <TouchableOpacity
          onPress={handleRefresh}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 mr-3 rounded border-b-4 border-blue-700 hover:border-blue-500 transition duration-200 ease-in-out"
        >
          <Text className="text-black font-bold text-lg">Refresh</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSaveLocation}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded border-b-4 border-blue-700 hover:border-blue-500 transition duration-200 ease-in-out"
        >
          <Text className="text-black font-bold text-lg">Save Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Map;
