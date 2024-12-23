import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  Button,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import {
  takePicture,
  resizeImage,
  uploadImage,
} from "@/services/cameraService"; // Import utility functions
import { useUser } from "@/contexts/userContext";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Camera = () => {
  const { user } = useUser();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState<boolean>(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
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

  const handleFaceRecognition = async () => {
    const uri = await takePicture(cameraRef);
    if (uri) {
      const resizedUri = await resizeImage(uri);
      uploadImage(
        resizedUri,
        `${apiUrl}/detect_faces/${user.familyId}`,
        setLoading
      );
    }
  };

  const handleObjectDetection = async () => {
    const uri = await takePicture(cameraRef);
    if (uri) {
      const resizedUri = await resizeImage(uri);
      uploadImage(resizedUri, `${apiUrl}/obj-detection`, setLoading);
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
};
export default Camera;
