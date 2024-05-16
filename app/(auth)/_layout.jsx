import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="confirmation" options={{ headerShown: false }} />
      </Stack>

      <StatusBar style="dark" />
    </>
  );
};

export default AuthLayout;
