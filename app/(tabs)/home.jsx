import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

const Home = () => {
  return (
    <SafeAreaView className="h-full bg-white" edges={['right', 'top', 'left']}>
      <View className="h-full w-full space-y-4 items-center justify-center">
        <Link href="/booking/paymentConfirmation">
          <Text>Payment confirmation</Text>
        </Link>
        <Link href="/wifi">
          <Text>Wifi</Text>
        </Link>
        <Link href="/maintenanceRequestList">
          <Text>Maintenance Request List</Text>
        </Link>
        <Link href="/menu">
          <Text>Menu</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Home;
