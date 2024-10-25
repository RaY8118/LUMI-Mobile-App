import { Camera, CameraType } from "expo-camera/legacy";
import { useState, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native"; // Assuming you're using React Navigation
import * as ImageManipulator from "expo-image-manipulator";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation(); // To detect navigation away from the screen

  useEffect(() => {
    // Cleanup function to stop camera when navigating away
    const unsubscribe = navigation.addListener("blur", () => {
      setCameraRef(null); // Clear camera reference when navigating away
    });

    return unsubscribe; // Clean up the listener when component unmounts
  }, [navigation]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  async function takePicture() {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      return photo.uri; // Return the URI for further processing
    }
  }

  async function resizeImage(uri) {
    const resizedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 816, height: 1088 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG } // Adjust compression as needed
    );

    console.log("Resized Image URI:", resizedImage.uri); // Debugging line
    console.log("Resized Image Width:", resizedImage.width); // Debugging line
    console.log("Resized Image Height:", resizedImage.height); // Debugging line

    return resizedImage.uri;
  }

  async function uploadImage(uri, endpoint) {
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

        // Show alert with the response message
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
  }

  async function handleFaceRecognition() {
    const uri = await takePicture();
    if (uri) {
      // Resize the image for face recognition
      const resizedUri = await resizeImage(uri);
      uploadImage(resizedUri, `${apiUrl}/send-name`);
    }
  }

  async function handleObjectDetection() {
    const uri = await takePicture();
    if (uri) {
      // Resize the image for object detection
      const resizedUri = await resizeImage(uri);
      uploadImage(resizedUri, `${apiUrl}/obj-detection`);
    }
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={(ref) => setCameraRef(ref)}
      />

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={handleFaceRecognition}>
          <Text style={styles.text}>Face Recognition</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={handleObjectDetection}>
          <Text style={styles.text}>Object Detection</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    paddingVertical: 20,
  },
  camera: {
    flex: 1,
    alignSelf: "center",
    width: "90%",
    marginBottom: 20,
    borderRadius: 10,
    margin: 25,
  },
  buttonWrapper: {
    alignItems: "center",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
