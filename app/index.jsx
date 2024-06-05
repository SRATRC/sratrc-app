import { Link, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../context/GlobalProvider';
import 'react-native-reanimated';

export default function Index() {
  const { loading, isLoggedIn } = useGlobalContext();
  if (!loading && isLoggedIn) return <Redirect href="/home" />;
  if (!loading && !isLoggedIn) return <Redirect href="/sign-in" />;

  return (
    <SafeAreaView>
      <StatusBar style="dark" />
      <View className="justify-center items-center h-full">
        <Text>Edit app/index.tsx to edit this screen.</Text>
        <Link href="/sign-in">Go to home</Link>
      </View>
    </SafeAreaView>
  );
}
