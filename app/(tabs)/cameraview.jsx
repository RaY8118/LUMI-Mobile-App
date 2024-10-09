import { Camera, CameraType } from "expo-camera/legacy";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert, // Import Alert
} from "react-native";
import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const [loading, setLoading] = useState(false);

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

  async function uploadImage(uri, endpoint) {
    const formData = new FormData();
    formData.append("image", {
      uri,
      type: "image/jpeg", // or the correct MIME type
      name: "photo.jpg",
    });

    setLoading(true); // Show loading indicator

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle the response
      if (response.data.status === "success") {
        const nameMessage = response.data.name
          ? `Identified Name: ${response.data.name}`
          : "Found nothing.";
        
        // Show alert with the response message
        Alert.alert("Response", nameMessage);
        
        setTimeout(() => {
          // Optionally clear any state after some time if needed
        }, 5000); // Clear message after 5 seconds (not needed for alert)
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
      uploadImage(uri, `${apiUrl}/send-name`);
    }
  }

  async function handleObjectDetection() {
    const uri = await takePicture();
    if (uri) {
      uploadImage(uri, `${apiUrl}/obj-detection`);
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
    paddingVertical:20
  },
  camera: {
    flex: 1,
    alignSelf: "center",
    width: "90%",
    marginBottom:20,
    borderRadius:10,
    margin:25
  },
  buttonWrapper: {
    alignItems: 'center', // Center each button horizontally
    marginVertical: 10, // Add space between buttons vertically
  },
  button: {
    backgroundColor: '#007BFF', // Button background color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    elevation: 3, // For Android shadow effect
    shadowColor: '#000', // For iOS shadow effect
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
