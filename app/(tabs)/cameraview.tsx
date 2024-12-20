import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import * as ImageManipulator from "expo-image-manipulator";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState<boolean>(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 justify-end p-5 relative">
        <Text className="text-center pb-3">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          return photo.uri; // Return the URI for further processing
        }
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  const resizeImage = async (uri: string) => {
    const resizedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 816, height: 1088 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return resizedImage.uri;
  };

  const uploadImage = async (uri: string, endpoint: string) => {
    const formData = new FormData();
    formData.append("image", {
      uri,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    setLoading(true); // Show loading indicator

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
      setLoading(false); // Hide loading indicator
    }
  };

  const handleFaceRecognition = async () => {
    const uri = await takePicture();
    if (uri) {
      const resizedUri = await resizeImage(uri);
      uploadImage(resizedUri, `${apiUrl}/send-name`);
    }
  };

  const handleObjectDetection = async () => {
    const uri = await takePicture();
    if (uri) {
      const resizedUri = await resizeImage(uri);
      uploadImage(resizedUri, `${apiUrl}/obj-detection`);
    }
  };

  return (
    <View className="flex-1 justify-end p-5 relative">
      <CameraView
        className="flex-1 w-full rounded-lg"
        facing={facing}
        ref={cameraRef}
      >
        {/* Camera feed is taking up the full screen */}
      </CameraView>

      <View className="items-center my-2">
        <TouchableOpacity
          className="bg-blue-500 py-4 px-8 rounded-full shadow-md"
          onPress={toggleCameraFacing}
        >
          <Text className="text-lg font-bold text-white">Flip Camera</Text>
        </TouchableOpacity>
      </View>

      <View className="items-center my-2">
        <TouchableOpacity
          className="bg-blue-500 py-4 px-8 rounded-full shadow-md"
          onPress={handleFaceRecognition}
        >
          <Text className="text-lg font-bold text-white">Face Recognition</Text>
        </TouchableOpacity>
      </View>

      <View className="items-center my-2">
        <TouchableOpacity
          className="bg-blue-500 py-4 px-8 rounded-full shadow-md"
          onPress={handleObjectDetection}
        >
          <Text className="text-lg font-bold text-white">Object Detection</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </View>
  );
}
