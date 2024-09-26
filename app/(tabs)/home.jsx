import { View, Text } from 'react-native';
import { useNotification } from '../../context/NotificationContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

const Home = () => {
  const { expoPushToken, notification, error } = useNotification();
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
        <View className="flex flex-col space-y-1 mt-5">
          <Text className="text-lg font-semibold">Notifications</Text>
          <Text className="text-sm font-semibold">
            Your Token: {expoPushToken ? expoPushToken : 'No token found'}
          </Text>
          <Text className="text-sm font-semibold">
            Notification: {notification?.request.content.title}
          </Text>
          <Text className="text-sm font-semibold">
            {JSON.stringify(notification?.request.content.data, null, 2)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
