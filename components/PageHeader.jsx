import { View, Text, TouchableOpacity, Image } from 'react-native';
import { icons } from '../constants';
import { useRouter } from 'expo-router';
import React from 'react';

const PageHeader = ({ title, icon }) => {
  const router = useRouter();
  return (
    <View className="w-full px-4 my-6 flex-row items-center">
      <TouchableOpacity onPress={() => router.back()}>
        <Image
          source={icon}
          className="w-5 h-5 p-2 ml-2 mr-4"
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text className="text-2xl font-psemibold">{title}</Text>
    </View>
  );
};

export default PageHeader;
