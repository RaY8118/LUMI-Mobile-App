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
  handleFaceRecognition,
  handleObjectDetection,
} from "@/services/cameraService";
import { Icon } from "@/constants/Icons";
import CustomButton from "@/components/CustomButton";
import { useUser } from "@/contexts/userContext";
import * as Animatable from "react-native-animatable";

const Camera = () => {
  const { user } = useUser();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState<boolean>(false);
  const cameraRef = useRef<CameraView>(null);
  const rotateRef = useRef<any>(null); // Reference for the rotate animation

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
    // Trigger the rotate animation
    if (rotateRef.current) {
      rotateRef.current.animate("rotate", 500);
    }

    // Toggle the camera facing
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  return (
    <View className="flex-1 justify-end p-5 relative bg-custom-white">
      {/* Parent View with rounded edges */}
      <View className="flex-1 rounded-3xl overflow-hidden shadow-xl shadow-black border-4 border-black">
        <CameraView
          style={{
            flex: 1,
            width: "100%", // Full width
            backgroundColor: "black", // Optional: Background color for camera view
          }}
          facing={facing}
          ref={cameraRef}
        >
          <View className="absolute right-6 bottom-3 my-2">
            <TouchableOpacity>
              <Animatable.View ref={rotateRef} duration={500}>
                <Icon
                  name="cameraswitch"
                  library="MaterialIcons"
                  color="white"
                  size={70}
                  onPress={toggleCameraFacing}
                  className=""
                  style={""}
                />
              </Animatable.View>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>

      <View className="items-center my-2 flex flex-row justify-around m-10">
        <CustomButton
          onPress={() => handleFaceRecognition(cameraRef, user, setLoading)}
          bgcolor="bg-blue-500"
          name="face-recognition"
          library="MaterialCommunityIcons"
          size={60}
          activeOpacity={0.7}
          color="white"
        />

        <CustomButton
          onPress={() => handleObjectDetection(cameraRef, setLoading)}
          bgcolor="bg-green-500"
          name="object-group"
          library="FontAwesome"
          size={60}
          activeOpacity={0.7}
          color="white"
        />
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
