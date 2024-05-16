import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';

const FormDisplayField = ({ text, value, otherStyles, ...props }) => {
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-600 font-pmedium">{text}</Text>
      <View className="focus:border-2 bg-white w-full h-16 px-4 rounded-2xl focus:border-secondary items-center flex-row shadow-lg shadow-gray-200">
        <Text
          className="font-medium text-base flex-1 text-gray-400"
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

export default FormDisplayField;
