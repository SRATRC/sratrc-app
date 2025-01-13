import { View, Text } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

const CustomEmptyMessage = ({ lottiePath, message }) => {
  return (
    <View className="flex-1 items-center justify-center">
      <LottieView
        style={{
          width: 200,
          height: 350,
          alignSelf: 'center'
        }}
        autoPlay
        loop
        source={lottiePath}
      />
      <Text className="text-base font-pregular px-8 text-secondary text-center">
        {message}
      </Text>
    </View>
  );
};

export default CustomEmptyMessage;
