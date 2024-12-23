const { useCallback } = require("react");
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Function to calculate distance between two coordinates (Haversine formula)
export const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
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

// Function to get current location
export const getCurrentCoords = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        throw new Error("Permission to access location was denied");
    }

    const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
    });

    return coords;
};

// Function to fetch the saved home location
export const fetchSavedLocation = async () => {
    const token = await SecureStore.getItemAsync("token");
    if (!token) throw new Error("User not logged in");

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.sub.userId;

    const response = await axios.get(`${apiUrl}/safe-location?userId=${userId}`);
    if (response.data.status === "success") {
        return response.data.coords; // {latitude, longitude}
    } else {
        throw new Error("Home location not found");
    }
};



// Function to save the current location as a safe location
export const saveLocation = async () => {
    const coords = await getCurrentCoords();
    const token = await SecureStore.getItemAsync("token");

    if (!token) throw new Error("User not logged in");

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.sub.userId;

    await axios.post(`${apiUrl}/safe-location`, {
        userId,
        coords,
    });

    return coords;
};