import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';

const FormDisplayField = ({ text, value, otherStyles, ...props }) => {
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-600 font-pmedium">{text}</Text>
      <View
        className={`focus:border-2 bg-white w-full h-16 px-4 rounded-2xl focus:border-secondary items-center flex-row ${
          Platform.OS === 'ios'
            ? 'shadow-lg shadow-gray-200'
            : 'shadow-2xl shadow-gray-400'
        }`}
      >
        <Text
          className="font-pmedium text-base text-gray-400"
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

export default FormDisplayField;
