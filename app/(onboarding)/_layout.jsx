import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Stack } from 'expo-router';

const OnboardingLayout = () => {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="imageCapture" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default OnboardingLayout;