import React, { useState, useEffect } from "react";
import {
  getDistanceFromLatLonInMeters,
  fetchSavedLocation,
  getCurrentCoords,
  saveCurrLocation,
  sendLocationAlert,
} from "@/services/locationService";
import { View, Text, Alert } from "react-native";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useUser } from "@/hooks/useUser";
import CustomButton from "@/components/CustomButton";
const Map = () => {
  const { user } = useUser();
  const userId = user?.userId;
  const memberId = user?.members[0].userId;

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSafe, setIsSafe] = useState(null);
  const [savedLocation, setSavedLocation] = useState(null);
  const [previousLocation, setPreviousLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [distance, setDistance] = useState(0);

  const shouldSaveLocation = (currentLocation) => {
    if (!previousLocation) return true;

    const distance = getDistanceFromLatLonInMeters(
      currentLocation.latitude,
      currentLocation.longitude,
      previousLocation.latitude,
      previousLocation.longitude
    );
    setDistance(distance);
    return distance > 50;
  };
  // Function to compare current location with the saved location
  const compareLocations = (currentLocation) => {
    if (!savedLocation) {
      setErrorMsg("No Home Location, Please save your home location first.");
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
      sendLocationAlert(memberId);
    } else {
      setIsSafe(true);
    }
    // Save current location to database only if it has changed
    if (shouldSaveLocation(currentLocation)) {
      saveCurrLocation(userId, setErrorMsg);
      setPreviousLocation(currentLocation);
    }
  };

  useEffect(() => {
    // Consolidated function to fetch required data and handle refresh
    const initializeData = async () => {
      try {
        setErrorMsg("Initializing data, please wait...");

        // Fetch saved location and current coordinates in parallel
        const [homeLocation, currentCoords] = await Promise.all([
          fetchSavedLocation(userId, setErrorMsg),
          getCurrentCoords(),
        ]);

        // Update state with fetched data
        setSavedLocation(homeLocation);
        setLocation(currentCoords);

        // Optionally reverse geocode to get the address
        const geocode = await Location.reverseGeocodeAsync(currentCoords);
        if (geocode.length > 0) {
          const { formattedAddress } = geocode[0];
          setAddress(formattedAddress);
        }

        // Save current location if necessary
        if (shouldSaveLocation(currentCoords)) {
          saveCurrLocation(userId, setErrorMsg);
          setPreviousLocation(currentCoords);
        }

        setErrorMsg(null);
      } catch (error) {
        console.error(error.message);
        setErrorMsg(error.message);
      }
    };

    initializeData();
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

  const handleRefresh = async () => {
    setErrorMsg("Refreshing, please wait...");

    try {
      // Fetch saved location and current coordinates in parallel
      const [homeLocation, currentCoords] = await Promise.all([
        fetchSavedLocation(userId, setErrorMsg),
        getCurrentCoords(),
      ]);

      // Update state with fetched data
      setSavedLocation(homeLocation);
      setLocation(currentCoords);

      // Reverse geocode the location to get the address
      try {
        setErrorMsg("Updating your current address...");
        const geocode = await Location.reverseGeocodeAsync(currentCoords);
        if (geocode.length > 0) {
          const { formattedAddress } = geocode[0];
          setAddress(formattedAddress);
        }
      } catch (error) {
        console.warn("Failed to fetch address:", error.message);
      }

      // Save the current location to the database if needed
      if (shouldSaveLocation(currentCoords)) {
        saveCurrLocation(userId, setErrorMsg);
        setPreviousLocation(currentCoords);
      }

      setErrorMsg(null); // Clear error message
    } catch (error) {
      console.error("Failed to refresh data:", error.message);
      setErrorMsg("Failed to refresh data. Please try again.");
    }
  };

  return (
    <View className="flex justify-start items-center p-2 bg-white ">
      <View className="flex justify-start items-center bg-white">
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
      <View className="flex justify-start items-start h-24 min-h-24 min-w-full p-2 bg-gray-200 rounded-lg shadow-lg shadow-black overflow-hidden">
        <Text className="text-lg">You are currently here</Text>
        <Text>{address}</Text>
        <Text className="text-green-700">
          {String(distance).slice(0, 1)} meters away from your home
        </Text>
      </View>
      {location && (
        <View className="w-full h-3/4 min-h-3/4 m-3 mb-2 shadow-xl shadow-black overflow-hidden rounded-3xl">
          <MapView provider={PROVIDER_GOOGLE}
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
      <View className="items-center flex-row justify-evenly w-full h-24 min-h-24">
        <CustomButton
          onPress={handleRefresh}
          bgcolor="bg-slate-200"
          name="refresh"
          library="FontAwesome"
          size={48}
          height="h-fit"
          width="w-1/2"
        />
      </View>
    </View>
  );
};

export default Map;
