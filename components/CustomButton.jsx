import { TouchableOpacity, View, Text } from "react-native";
import React from "react";
import { Icon } from "@/constants/Icons";

const CustomButton = ({
  onPress,
  bgcolor = "bg-blue-500",
  name,
  library,
  size = 24,
  color = "white",
  activeOpacity = 0.7,
  height = "h-20",
  width = "w-20",
  label,
  labelColor = "text-white",
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-3 rounded-3xl shadow-lg shadow-black items-center justify-center ${height} ${width} ${bgcolor}`}
      activeOpacity={activeOpacity}
      style={{
        transform: [{ scale: 0.98 }],
        transition: "all 0.1s ease-in-out",
      }}
    >
      <View className="flex items-center justify-center">
        <Icon name={name} library={library} size={size} color={color} />
        {label && (
          <Text className={`mt-2 ${labelColor} text-sm font-semibold`}>
            {label}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
