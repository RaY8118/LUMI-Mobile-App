import { View, Text } from "react-native";
import React, { useState } from "react";
import { sendCustomNotification } from "@/services/notificationService";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { useUser } from "@/contexts/userContext";

const Settings = () => {
  const { user } = useUser();
  const patient = user?.patient?.[0] || null;
  const PATId = patient?.userId || null;
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    await sendCustomNotification(PATId, message);
    setMessage("");
  };
  return (
    <View>
      {/* <Text>Settings</Text> */}
      <View>
        <View className="flex items-center justify-center h-10">
          <Text className="text-2xl text-emerald-500">
            Custom priority Notifications
          </Text>
        </View>
        <View className="flex-row items-center p-4">
          <CustomInput
            placeholder="Enter the message u need to send"
            value={message}
            onChangeText={setMessage}
          />
        </View>
        <View className="items-center flex flex-row justify-center m-6 ">
          <CustomButton
            name="send"
            library="FontAwesome"
            size={54}
            onPress={sendMessage}
            bgcolor="bg-pink-400"
          />
        </View>
      </View>
    </View>
  );
};

export default Settings;
