import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const CustomButton = ({
  text,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  isDisabled,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`${
        props.bgcolor ? props.bgcolor : 'bg-secondary'
      } rounded-xl justify-center items-center ${containerStyles} ${
        isLoading || isDisabled ? 'opacity-50' : ''
      } flex-row`}
      disabled={isLoading || isDisabled}
    >
      <Text className={`text-white font-psemibold text-lg ${textStyles}`}>
        {text}
      </Text>
      {isLoading && (
        <ActivityIndicator
          size="small"
          color="white"
          style={{ marginLeft: 10 }}
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
