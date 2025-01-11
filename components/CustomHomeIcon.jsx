import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import React from 'react';

const CustomHomeIcon = ({ image, title, onPress, containerStyles }) => {
  return (
    <View className={`${containerStyles}`}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View className="items-center justify-center w-[76px]">
          <View
            className={`bg-white rounded-xl p-2 ${
              Platform.OS === 'ios'
                ? 'shadow-lg shadow-gray-200 bg-white'
                : 'shadow-2xl shadow-gray-400 bg-white'
            }`}
          >
            <Image source={image} className="h-12 w-12" />
          </View>
          <Text className="text-black font-pregular mt-2 flex-wrap text-center text-[10px]">
            {title}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default CustomHomeIcon;
