import { Button, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useRouter } from 'expo-router';

const Profile = () => {
  const { setIsLoggedIn, setUser, removeItem } = useGlobalContext();
  const router = useRouter();

  return (
    <SafeAreaView>
      <Text>Profile</Text>
      <Button
        title="logout"
        onPress={() => {
          setIsLoggedIn(false);
          setUser(null);
          removeItem('user');
          router.replace('/sign-in');
        }}
      />
    </SafeAreaView>
  );
};

export default Profile;
