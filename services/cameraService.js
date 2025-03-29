import * as ImageManipulator from "expo-image-manipulator";
import axios from "axios";
import * as Speech from "expo-speech";
import { Alert } from "react-native"
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

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

export const uploadImage = async (uri, endpoint, setLoading, isFaceRecognition = true) => {
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
      let nameMessage;
      if (isFaceRecognition) {
        // Handle face recognition response
        if (response.data.name && response.data.name.length > 0) {
          const userId = response.data.name[0];
          nameMessage = `Identified User ID: ${userId}`;

          // Fetch additional info for the identified userId
          const additionalInfo = await fetchAdditionalInfo(userId);

          if (additionalInfo) {
            nameMessage += `\nName: ${additionalInfo[0].name}\nRelation: ${additionalInfo[0].relation}\nTagline: ${additionalInfo[0].tagline}\nTrigger Memory: ${additionalInfo[0].triggerMemory}`;
          } else {
            nameMessage += "\nNo additional info found.";
          }
        } else {
          nameMessage = "No faces found.";
        }

      } else {
        // Handle object detection response
        nameMessage = response.data.name && response.data.name.length > 0
          ? `Identified Objects: ${response.data.name.join(', ')}`
          : "No objects found.";
        setTimeout(() => {
          speak(nameMessage)
        }, 2000)
      }
      Alert.alert("Response", nameMessage);
    } else {
      Alert.alert("Error", `Error: ${response.data.message}`);
    }
  } catch (error) {
    Alert.alert("Error", error.response?.data?.message);
  } finally {
    setLoading(false);
  }
};

export const handleFaceRecognition = async (cameraRef, user, setLoading) => {
  const uri = await takePicture(cameraRef);
  if (uri) {
    const resizedUri = await resizeImage(uri);
    uploadImage(resizedUri, `${apiUrl}/detect_faces/${user.familyId}`, setLoading, true);
  }
};

export const handleObjectDetection = async (cameraRef, setLoading) => {
  const uri = await takePicture(cameraRef);
  if (uri) {
    const resizedUri = await resizeImage(uri);
    uploadImage(resizedUri, `${apiUrl}/obj-detection`, setLoading, false);
  }
};

export const handleGeminiDetection = async (cameraRef, setLoading) => {
  const uri = await takePicture(cameraRef);
  if (uri) {
    const reseizedUri = await resizeImage(uri)
    uploadImage(reseizedUri, `${apiUrl}/gemini-detection`, setLoading, false)
  }
}

const speak = (text) => {
  Speech.speak(text); // Function to speak the text
};

export const fetchAdditionalInfo = async (userId) => {
  try {
    response = await axios.get(`${apiUrl}/get-additional-info?userId=${userId}`)
    if (response.data.status === "success") {
      const userInfo = response.data.userInfo
      return userInfo
    } else {
      return "No additional information found"
    }
  } catch (error) {
    console.error(error);

  }
}
