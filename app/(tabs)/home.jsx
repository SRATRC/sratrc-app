import { View, Text, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

const Home = () => {
  return (
    <SafeAreaView className="h-full bg-white" edges={['right', 'top', 'left']}>
      <View className="w-full">
        <Text>Home</Text>
        <Link href="/common/wifi">
          <Text>WIFI</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Home;
