import { TouchableOpacity } from "react-native";
import React from "react";
import { Icon } from "@/constants/Icons";
const CustomButton = ({
  onPress,
  bgcolor,
  name,
  library,
  size,
  color,
  activeOpacity,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${bgcolor} p-3 rounded-3xl shadow-lg shadow-black items-center justify-center h-fit w-fit`}
      activeOpacity={activeOpacity}
    >
      <Icon name={name} library={library} size={size} color={color} />
    </TouchableOpacity>
  );
};

export default CustomButton;
