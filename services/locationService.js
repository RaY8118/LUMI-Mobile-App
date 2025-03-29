import * as Location from "expo-location";
import axios from "axios";
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
export const fetchSavedLocation = async (userId, setErrorMsg) => {
  try {
    if (!userId) {
      const message = "User ID is not available.";
      setErrorMsg(message);
      throw new Error(message);
    }

    const response = await axios.get(`${apiUrl}/safe-location?userId=${userId}`);

    if (response.data?.status === "success") {
      return response.data.coords; // Return the coordinates
    } else {
      const message = response.data?.message;
      setErrorMsg(message);
      throw new Error(message);
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
    setErrorMsg(errorMessage);
    throw new Error(errorMessage);
  }
};



// Function to save the current location as a safe location
export const saveLocation = async (userId, setErrorMsg) => {
  try {
    const coords = await getCurrentCoords();
    const response = await axios.post(`${apiUrl}/safe-location`, {
      userId,
      coords,
    });

    if (response.data?.status === "success") {
      return response.data.message;
    } else {
      const message = response.data?.message || "Failed to save location.";
      setErrorMsg(message);
      throw new Error(message);
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
    setErrorMsg(errorMessage);
    throw new Error(errorMessage);
  }
};

export const savePatientLocation = async (CGId, PATId, setErrorMsg) => {
  try {
    const coords = await getCurrentCoords();
    const response = await axios.post(`${apiUrl}/caregiver/safe-location`, {
      CGId,
      PATId,
      coords,
    });

    if (response.data?.status === "success") {
      return response.data.message;
    } else {
      const message = response.data?.message || "Failed to save location.";
      setErrorMsg(message);
      throw new Error(message);
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
    setErrorMsg(errorMessage);
    throw new Error(errorMessage);
  }
}

export const saveCurrLocation = async (userId, setErrorMsg) => {
  try {
    const coords = await getCurrentCoords();
    const response = await axios.post(`${apiUrl}/curr-location`, {
      userId,
      coords,
    });

    if (response.data?.status === "success") {
      return response.data.message;
    } else {
      const message = response.data?.message || "Failed to save location.";
      setErrorMsg(message);
      throw new Error(message);
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
    setErrorMsg(errorMessage);
    throw new Error(errorMessage);
  }


};


export const getPatientCurrentLocation = async (CGId, PATId, setLocation, setErrorMsg) => {
  try {
    if (!CGId || !PATId) {
      const message = "Cargiver ID or Patient ID is not available"
      setErrorMsg(message)
      throw new Error(message)
    }

    const response = await axios.get(`${apiUrl}/curr-location?CGId=${CGId}&PATId=${PATId}`)

    if (response.data?.status === "success") {
      setLocation(response.data.coords)
    } else {
      const message = response.data?.message
      setErrorMsg(message)
      throw new Error(message)
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message
    setErrorMsg(errorMessage)
    throw new Error(errorMessage)
  }
}



export const getPatientCurrentAddress = async (
  CGId,
  PATId,
  setLocation,
  setAddress,
  setErrorMsg
) => {
  try {
    if (!CGId || !PATId) {
      const message = "Caregiver ID or Patient ID is not available";
      setErrorMsg(message);
      throw new Error(message);
    }

    const response = await axios.get(
      `${apiUrl}/curr-location?CGId=${CGId}&PATId=${PATId}`
    );

    if (response.data?.status === "success") {
      const patientCoords = response.data.coords;
      setLocation(patientCoords);

      const patientLocLatitude = patientCoords?.latitude;
      const patientLocLongitude = patientCoords?.longitude;

      if (patientLocLatitude && patientLocLongitude) {
        const geocode = await Location.reverseGeocodeAsync({
          latitude: patientLocLatitude,
          longitude: patientLocLongitude,
        });

        if (geocode.length > 0) {
          const { formattedAddress } = geocode[0];
          setAddress(formattedAddress);
        }
      }
      setErrorMsg("");
    } else {
      const errorMessage = response.data.message || "Failed to fetch data.";
      setErrorMsg(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage = error.message || "An unknown error occurred.";
    setErrorMsg(errorMessage);
    throw new Error(errorMessage);
  }
};


export const sendLocationAlert = async (userId) => {
  try {
    response = await axios.get(`${apiUrl}/get-user-token?userId=${userId}`)
    const token = response.data.token
    console.log(token);
    if (token) {
      try {
        response = await axios.post("https://exp.host/--/api/v2/push/send", {
          to: token,
          title: "Important message",
          body: "Patient out of safe area",
          sound: "default"
        })
      }
      catch (error) {
        console.error(error)
      }
    }

  } catch (error) {
    console.log(error);

  }
}
