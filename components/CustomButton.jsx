import { Text, TouchableOpacity } from 'react-native';
import React from 'react';

const CustomButton = ({
  text,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`${
        props.bgcolor ? props.bgcolor : 'bg-secondary'
      } rounded-xl justify-center items-center ${containerStyles} ${
        isLoading ? 'opacity-50' : ''
      }`}
      disabled={isLoading}
    >
      <Text className={`text-white font-psemibold text-lg ${textStyles}`}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
