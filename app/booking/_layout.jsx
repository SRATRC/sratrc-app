import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Stack } from 'expo-router';

const DetailsLayout = () => {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="[booking]" options={{ headerShown: false }} />
        <Stack.Screen
          name="bookingConfirmation"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="paymentConfirmation"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
};

export default DetailsLayout;
