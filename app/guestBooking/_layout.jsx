import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

const GuestDetailsLayout = () => {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="[booking]" options={{ headerShown: false }} />
        <Stack.Screen
          name="guextBookingConfirmation"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
};

export default GuestDetailsLayout;
