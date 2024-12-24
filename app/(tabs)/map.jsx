import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  getDistanceFromLatLonInMeters,
  fetchSavedLocation,
  getCurrentCoords,
  saveLocation,
} from "@/services/locationService";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { Icon } from "@/constants/Icons";
import { useUser } from "@/contexts/userContext";
const Map = () => {
  const { user } = useUser();
  const userId = user.userId;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSafe, setIsSafe] = useState(null);
  const [savedLocation, setSavedLocation] = useState(null);

  // Function to compare current location with the saved location
  const compareLocations = (currentLocation) => {
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
    try {
      const successMessage = await saveLocation(setErrorMsg);
      Alert.alert("Success", successMessage);
    } catch (error) {
      console.error(error.message);
      Alert.alert("Error", error.message);
    }
  };

  const handleRefresh = async () => {
    try {
      setErrorMsg(null);
      Alert.alert("Refresh", "Refreshing, please wait...");
      const homeLocation = await fetchSavedLocation(userId, setErrorMsg);
      setSavedLocation(homeLocation);
      const currentCoords = await getCurrentCoords();
      setLocation(currentCoords);
      setErrorMsg(null);
    } catch (error) {
      console.error(error.message);
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
        </View>
      )}

      {/* Buttons */}
      <View className="items-center flex-row justify-center space-x-6">
        <TouchableOpacity
          onPress={handleRefresh}
          className="bg-slate-200 p-4 rounded-3xl shadow-lg shadow-black items-center justify-center border-4 border-black h-fit w-fit"
        >
          <Icon name="refresh" library="FontAwesome" size={48} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSaveLocation}
          className="bg-green-500 p-4 rounded-3xl shadow-lg shadow-black items-center justify-center border-4 border-black h-fit w-fit"
        >
          <Icon name="add-location-alt" library="MaterialIcons" size={48} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Map;
