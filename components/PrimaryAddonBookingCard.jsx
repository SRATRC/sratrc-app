import { View, Text, Platform } from 'react-native';
import React from 'react';

const PrimaryAddonBookingCard = ({ containerStyles, title, children }) => {
  return (
    <View className={`w-full px-4 ${containerStyles}`}>
      <Text className="text-xl font-psemibold text-secondary">{title}</Text>
      <View
        className={`flex flex-col bg-white rounded-2xl mt-4 ${
          Platform.OS === 'ios'
            ? 'shadow-lg shadow-gray-200'
            : 'shadow-2xl shadow-gray-400'
        }`}
      >
        {children}
      </View>
    </View>
  );
};

export default PrimaryAddonBookingCard;
