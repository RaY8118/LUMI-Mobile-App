import { TextInput } from "react-native";
import React from "react";

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry,
}) => {
  return (
    <TextInput
      className="h-12 flex-1 border-2 border-black px-3 rounded-3xl bg-white font-pmedium ml-4"
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
    />
  );
};

export default CustomInput;
