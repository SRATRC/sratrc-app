import { View, Text, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, images } from '../../constants';
import { openApp } from '../../utils/linkingUtils';
import { useNotification } from '../../context/NotificationContext';
import { useGlobalContext } from '../../context/GlobalProvider';
import { Link, router } from 'expo-router';
import CustomHomeIcon from '../../components/CustomHomeIcon';

const Home = () => {
  const { user } = useGlobalContext();
  const { expoPushToken, notification, error } = useNotification();
  return (
    <SafeAreaView
      className="h-full bg-white px-4"
      edges={['right', 'top', 'left']}
    >
      <View className="justify-start">
        <Image
          source={images.logo}
          className="w-[70px] h-[30px]"
          resizeMode="contain"
        />
      </View>

      {/* Banner */}
      <View className="mt-7 w-full">
        {/* <Image
          source={images.banner}
          resizeMode="contain"
          className="w-[100%] h-[220px]"
        /> */}
        <ImageBackground
          className="w-[100%] h-[220px]"
          source={images.banner}
          resizeMode="contain"
        >
          <Text className="text-secondary font-pbold text-lg px-4 pt-6">
            JSDV {user.issuedto.split(' ')[0]}!
          </Text>
          <Text className="max-w-[63%] font-plight text-sm px-4 pt-4">
            "Every living being is capable of becoming Self-realised; one who
            realises this is himself bound to become a Realised Soul"
          </Text>
          <Text className="px-4 pt-2">~ Shrimad Rajchandra</Text>
        </ImageBackground>
      </View>

      {/* Services */}
      <View className="mt-7 w-full">
        <Text className="text-lg text-black font-pmedium">Our Services</Text>
        <View className="mt-2 w-full flex-row items-center justify-around">
          <CustomHomeIcon
            image={icons.wifiHome}
            title="Wifi"
            onPress={() => {
              router.push('/wifi');
            }}
          />
          <CustomHomeIcon
            image={icons.menuHome}
            title="Menu"
            onPress={() => {
              router.push('/menu');
            }}
            // containerStyles={'mx-4'}
          />
          <CustomHomeIcon
            image={icons.maintenanceHome}
            title="Maintenance"
            onPress={() => {
              router.push('/maintenanceRequestList');
            }}
          />
        </View>
      </View>

      {/* Socials */}
      <View className="mt-7 w-full">
        <Text className="text-lg text-black font-pmedium">
          Checkout Our Social Media!
        </Text>
        <View className="mt-2 w-full flex-row justify-around">
          <CustomHomeIcon
            image={icons.rcGlobalInsta}
            title="RC Global"
            onPress={() => {
              openApp('https://www.instagram.com/researchcentre_global/');
            }}
          />
          <CustomHomeIcon
            image={icons.vvInsta}
            title="VV Insta"
            onPress={() => {
              openApp('https://www.instagram.com/vitraag.vigyaan/');
            }}
          />
          <CustomHomeIcon
            image={icons.sparshInsta}
            title="Sparsh"
            onPress={() => {
              openApp('https://www.instagram.com/sparsh.international/');
            }}
          />
          <CustomHomeIcon
            image={icons.vvYt}
            title="Youtube"
            onPress={() => {
              openApp('https://www.youtube.com/@VitraagVigyaan');
            }}
          />
          //FIXME: icon missing
          <CustomHomeIcon
            image={icons.vvYt}
            title="Satshrut"
            onPress={() => {
              openApp('https://satshrut.vitraagvigyaan.org/');
            }}
          />
        </View>
      </View>
      {/* <View className="h-full w-full space-y-4 items-center justify-center">
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
      </View> */}
    </SafeAreaView>
  );
};

export default Home;
