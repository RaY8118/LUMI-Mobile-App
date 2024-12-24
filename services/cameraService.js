import * as ImageManipulator from "expo-image-manipulator";
import axios from "axios";
import { Alert } from "react-native";

export const takePicture = async (cameraRef) => {
  if (cameraRef.current) {
    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        return photo.uri;
      }
    } catch (error) {
      console.error("Error taking picture:", error);
    }
  }
};

export const resizeImage = async (uri) => {
  const resizedImage = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 816, height: 1088 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
  return resizedImage.uri;
};

export const uploadImage = async (uri, endpoint, setLoading) => {
  const formData = new FormData();
  formData.append("image", {
    uri,
    type: "image/jpeg",
    name: "photo.jpg",
  });

  setLoading(true);

  try {
    const response = await axios.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.status === "success") {
      const nameMessage = response.data.name
        ? `Identified Name: ${response.data.name}`
        : "Found nothing.";
      Alert.alert("Response", nameMessage);
    } else {
      Alert.alert("Error", `Error: ${response.data.message}`);
    }
  } catch (error) {
    console.error("Upload failed:", error);
    Alert.alert("Error", "Upload failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

export const handleFaceRecognition = async (cameraRef, user, setLoading, apiUrl) => {
  const uri = await takePicture(cameraRef);
  if (uri) {
    const resizedUri = await resizeImage(uri);
    uploadImage(resizedUri, `${apiUrl}/detect_faces/${user.familyId}`, setLoading);
  }
};

export const handleObjectDetection = async (cameraRef, setLoading, apiUrl) => {
  const uri = await takePicture(cameraRef);
  if (uri) {
    const resizedUri = await resizeImage(uri);
    uploadImage(resizedUri, `${apiUrl}/obj-detection`, setLoading);
  }
};