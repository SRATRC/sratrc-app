import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../context/GlobalProvider';
import { handleUserNavigation } from '../utils/navigationValidations';

import 'react-native-reanimated';

const Index = () => {
  const { loading, user } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      handleUserNavigation(user, router);
    }
  }, [loading]);

  // if (!loading && user) return <Redirect href="/home" />;
  // if (!loading && !user) return <Redirect href="/sign-in" />;

  return (
    <SafeAreaView>
      <StatusBar style="dark" />
      <View className="justify-center items-center h-full">
        <ActivityIndicator />
      </View>
    </SafeAreaView>
  );
};

export default Index;
