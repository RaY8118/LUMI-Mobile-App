import React, { useState, useEffect, useCallback } from "react";
import {
  getDistanceFromLatLonInMeters,
  fetchSavedLocation,
  getCurrentCoords,
  saveLocation,
  saveCurrLocation,
} from "@/services/locationService";
import { View, Text, Alert } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { useUser } from "@/contexts/userContext";
import CustomButton from "@/components/CustomButton";
const Map = () => {
  const { user } = useUser();
  const userId = user?.userId;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSafe, setIsSafe] = useState(null);
  const [savedLocation, setSavedLocation] = useState(null);
  const [previousLocation, setPreviousLocation] = useState(null);

  const shouldSaveLocation = (currentLocation) => {
    if (!previousLocation) return true;

    const distance = getDistanceFromLatLonInMeters(
      currentLocation.latitude,
      currentLocation.longitude,
      previousLocation.latitude,
      previousLocation.longitude
    );
    return distance > 50;
  };
  // Function to compare current location with the saved location
  const compareLocations = (currentLocation) => {
    if (!savedLocation) {
      setErrorMsg("No Home Location", "Please save your home location first.");
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
      console.log(isSafe);
    } else {
      setIsSafe(true);
      console.log(isSafe);
    }
    // Save current location to database only if it has changed
    if (shouldSaveLocation(currentLocation)) {
      saveCurrLocation(setErrorMsg);
      setPreviousLocation(currentLocation); // Update previous location
    }
  };

  const fetchCurrentLocation = useCallback(async () => {
    try {
      const coords = await getCurrentCoords();
      setLocation(coords);

      // Save the fetched location to the database if needed
      if (shouldSaveLocation(coords)) {
        saveCurrLocation(setErrorMsg);
        setPreviousLocation(coords); // Update previous location
      }
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
        const homeLocation = await fetchSavedLocation(userId, setErrorMsg);
        setSavedLocation(homeLocation);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchLocationData();
  }, [userId]);

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
    Alert.alert(
      "Confirm Save",
      "Are you sure you want to save your current location?",
      [
        {
          text: "Cancel",
          onPress: async () => console.log("Save location canceled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const successMessage = await saveLocation(setErrorMsg);
              Alert.alert("Success", successMessage);
            } catch (error) {
              console.error(error.message);
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleRefresh = async () => {
    try {
      setErrorMsg(null);
      setErrorMsg("Refreshing, please wait...");
      const homeLocation = await fetchSavedLocation(userId, setErrorMsg);
      setSavedLocation(homeLocation);
      const currentCoords = await getCurrentCoords();
      setLocation(currentCoords);
      if (shouldSaveLocation(currentCoords)) {
        saveCurrLocation(setErrorMsg);
        setPreviousLocation(currentCoords); // Update previous location
      }
      setErrorMsg(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

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
        <View className="w-full h-5/6 border-2 border-black m-3 shadow-lg shadow-black overflow-hidden rounded-3xl">
          <MapView
            className="w-full h-full"
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
                strokeColor={isSafe ? "green" : "red"}
                fillColor={
                  isSafe ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)"
                }
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
        </View>
      )}
      <View className="items-center flex-row justify-evenly w-full">
        <CustomButton
          onPress={handleRefresh}
          bgcolor="bg-slate-200"
          name="refresh"
          library="FontAwesome"
          size={48}
        />

        <CustomButton
          onPress={handleSaveLocation}
          bgcolor="bg-green-400"
          name="add-location-alt"
          library="MaterialIcons"
          size={48}
        />
      </View>
    </View>
  );
};

export default Map;
