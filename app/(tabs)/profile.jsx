import { Text, View, Image, Platform, TouchableOpacity } from 'react-native';
import { icons, images } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';

const Profile = () => {
  const { setIsLoggedIn, user, setUser, removeItem } = useGlobalContext();
  const router = useRouter();

  const profileList = [
    {
      name: 'Profile Details',
      icon: icons.profileCircle,
      onPress: () => {
        router.push('/profile/profileDetails');
      }
    },
    {
      name: 'Transaction History',
      icon: icons.transactions,
      onPress: () => {
        router.push('/profile/transactions');
      }
    },
    // {
    //   name: 'Language Setting',
    //   icon: icons.language,
    //   onPress: () => {}
    // },
    // {
    //   name: 'Help and Support',
    //   icon: icons.help,
    //   onPress: () => {}
    // },
    {
      name: 'Logout',
      icon: icons.logout,
      onPress: () => {
        setIsLoggedIn(false);
        setUser(null);
        removeItem('user');
        router.replace('/sign-in');
      }
    }
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className={`mb-5 p-4 rounded-2xl ${
        Platform.OS === 'ios'
          ? 'shadow-lg shadow-gray-200'
          : 'shadow-2xl shadow-gray-400'
      } bg-white flex flex-row items-center justify-between mx-4`}
      onPress={item.onPress}
    >
      <View className="flex-row items-center space-x-4">
        <Image source={item.icon} className="w-6 h-6" resizeMode="contain" />

        <Text className="text-base font-pregular">{item.name}</Text>
      </View>
      <View className="bg-secondary-50 p-2 rounded-lg">
        <Image
          source={icons.yellowArrowRight}
          className="w-3 h-3"
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View className="justify-center items-center flex-col mb-10 mt-2">
      <Image
        source={images.pfp}
        className="w-[100] h-[100] rounded-full"
        resizeMode="contain"
      />
      <Text className="text-base font-psemibold mt-2">{user.issuedto}</Text>
    </View>
  );

  return (
    <SafeAreaView className="h-full bg-white" edges={['right', 'top', 'left']}>
      <View className="w-full h-full">
        <FlashList
          className="py-2 h-full"
          showsVerticalScrollIndicator={false}
          data={profileList}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          estimatedItemSize={6}
          bounces={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
