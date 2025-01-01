import { View, Text, ActivityIndicator, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { useUser } from "@/contexts/userContext";
import {
  getPatientCurrentAddress,
  getCurrentCoords,
} from "@/services/locationService";
import CustomButton from "@/components/CustomButton";

const CgMaps = () => {
  const { user } = useUser();
  const CGId = user?.userId;
  const patient = user?.patient?.[0] || null;
  const PATId = patient?.userId || null;
  const PATName = patient?.name || null;
  const [location, setLocation] = useState(null);
  const [Cglocation, setCgLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [CGId, PATId]);

  const fetchData = async () => {
    if (!refreshing) setIsLoading(true);
    try {
      // Fetch patient address and location
      await getPatientCurrentAddress(
        CGId,
        PATId,
        setLocation,
        setAddress,
        setErrorMsg
      );

      // Fetch caregiver coordinates
      await caregiverCoords();
      setErrorMsg("");
    } catch (error) {
      const errorMessage = error.message || "An unknown error occurred.";
      setErrorMsg(errorMessage);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const caregiverCoords = async () => {
    try {
      const currentCoords = await getCurrentCoords();
      setCgLocation(currentCoords);
    } catch (error) {
      console.log("Error fetching caregiver's coordinates:", error);
      setErrorMsg("Unable to fetch caregiver's coordinates.");
    }
  };

  const handleRefresh = async () => {
    setErrorMsg("Refreshing, please wait...");
    setRefreshing(true);
    await fetchData();
  };

  return (
    <SafeAreaView>
      <View className="flex justify-start items-center p-2 bg-custom-white">
        <View className="flex justify-start items-start h-24 min-h-24 min-w-full p-2 border-2 border-black rounded-lg bg-slate-200 shadow-black shadow-lg overflow-hidden">
          {errorMsg ? (
            <Text className="text-red-600 text-xl text-center">{errorMsg}</Text>
          ) : (
            <>
              <Text className="text-green-600 text-lg text-start font-bold">
                {PATName} Location
              </Text>
              <Text className="text-green-600 text-lg text-start font-bold">
                {address}
              </Text>
            </>
          )}
        </View>
        {isLoading && !refreshing ? ( // Show loader only during initial fetch
          <View className="flex h-full justify-center items-center">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading...</Text>
          </View>
        ) : (
          location &&
          Cglocation && (
            <View className="w-full h-3/4 border-2 border-black m-3 mb-2 shadow-lg shadow-black overflow-hidden rounded-3xl">
              <MapView
                className="w-full h-full"
                initialRegion={{
                  latitude: location?.latitude,
                  longitude: location?.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
                followsUserLocation={true}
              >
                <Marker
                  coordinate={{
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                  }}
                  title={`${PATName} is currently here`}
                />
                <Marker
                  coordinate={{
                    latitude: Cglocation?.latitude,
                    longitude: Cglocation?.longitude,
                  }}
                  title="You are here"
                />
              </MapView>
            </View>
          )
        )}
        <View className="items-center flex-row justify-evenly w-full mb-auto h-32">
          <CustomButton
            onPress={handleRefresh}
            bgcolor="bg-slate-200"
            name="refresh"
            library="FontAwesome"
            size={48}
          />
          {/* TODO: assign some function */}
          <CustomButton
            bgcolor="bg-cyan-400"
            name="add-location-alt"
            library="MaterialIcons"
            size={48}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CgMaps;
