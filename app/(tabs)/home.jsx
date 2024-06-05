import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  return (
    <SafeAreaView className="h-full bg-white" edges={['right', 'top', 'left']}>
      <View className="w-full">
        <Text>Home</Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;
