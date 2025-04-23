import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  Button,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  handleFaceRecognition,
  handleObjectDetection,
} from "@/services/cameraService";
import { Icon } from "@/constants/Icons";
import CustomButton from "@/components/CustomButton";
import { useUser } from "@/hooks/useUser";
import * as Animatable from "react-native-animatable";
import FadeWrapper from "@/components/FadeWrapper";

const Camera = () => {
  const { user } = useUser();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState<boolean>(false);
  const cameraRef = useRef<CameraView>(null);
  const rotateRef = useRef<any>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center p-5 relative">
        <Text className="text-center pb-3">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    if (rotateRef.current) {
      rotateRef.current.animate("rotate", 500);
    }
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  return (
    <FadeWrapper>
      <View className="flex-1 justify-end p-5 relative bg-purple-100">
        <View className="flex-1 rounded-3xl overflow-hidden shadow-xl shadow-black">
          <CameraView
            style={{
              flex: 1,
              width: "100%",
              backgroundColor: "black",
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

        <View className="items-center my-0 flex flex-row justify-around mt-12 mb-20">
          <CustomButton
            onPress={() => handleFaceRecognition(cameraRef, user, setLoading)}
            bgcolor="bg-blue-500"
            name="face-recognition"
            library="MaterialCommunityIcons"
            size={60}
            activeOpacity={0.7}
            color="white"
            height="h-fit"
            width="w-fit"
          />

          <CustomButton
            onPress={() => handleObjectDetection(cameraRef, setLoading)}
            bgcolor="bg-green-500"
            name="object-group"
            library="FontAwesome"
            size={60}
            activeOpacity={0.7}
            color="white"
            height="h-fit"
            width="w-fit"
          />
        </View>

        {loading && (
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-white/90 flex items-center justify-center z-50">
            <View className="items-center space-y-4 animate-pulse">
              <Text className="text-2xl font-extrabold text-purple-700 tracking-wide">
                Detecting please wait...
              </Text>
            </View>
          </View>
        )}
      </View>
    </FadeWrapper>
  );
};

export default Camera;
