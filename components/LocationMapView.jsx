import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import MapView, { Marker, Circle } from "react-native-maps";
const LocationMapView = ({
  location,
  errorMsg,
  isSafe,
  handleRefresh,
  saveLocation,
  savedLocation,
}) => {
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

      <View className="items-center flex-row justify-center">
        <TouchableOpacity
          onPress={handleRefresh} // Reset location for refresh
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 mr-3 rounded border-b-4 border-blue-700 hover:border-blue-500 transition duration-200 ease-in-out"
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

export default LocationMapView;
