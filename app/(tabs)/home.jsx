import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, images, status } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';
import CustomHomeIcon from '../../components/CustomHomeIcon';

const Home = () => {
  const { user } = useGlobalContext();
  return (
    <SafeAreaView className="h-full bg-white" edges={['right', 'top', 'left']}>
      <View className="justify-start px-4">
        <Image
          source={images.logo}
          className="w-[70px] h-[30px]"
          resizeMode="contain"
        />
      </View>

      {/* Banner */}
      <View className="mt-7 w-full px-4">
        <ImageBackground
          className="w-[100%] h-[220px]"
          source={images.banner}
          resizeMode="contain"
        >
          <Text className="text-secondary font-pbold text-lg px-4 pt-6">
            JSDV, {user.issuedto.split(' ')[0]}!
          </Text>
          <Text className="max-w-[63%] font-plight text-xs px-4 pt-4">
            "Every living being is capable of becoming Self-realised; one who
            realises this is himself bound to become a Realised Soul"
          </Text>
          <Text className="px-4 pt-2">~ Shrimad Rajchandra</Text>
        </ImageBackground>
      </View>

      {/* Services */}
      <View className="mt-7 w-full px-4">
        <Text className="text-lg text-black font-pmedium">Our Services</Text>
        <View className="mt-3 w-full flex flex-row items-center">
          {user.res_status != status.STATUS_RESIDENT && (
            <CustomHomeIcon
              image={icons.wifiHome}
              title={'Wifi'}
              onPress={() => {
                router.push('/wifi');
              }}
            />
          )}
          <CustomHomeIcon
            image={icons.menuHome}
            title={'Menu'}
            onPress={() => {
              router.push('/menu');
            }}
          />
          <CustomHomeIcon
            image={icons.maintenanceHome}
            title={'Maintenance'}
            onPress={() => {
              router.push('/maintenanceRequestList');
            }}
          />
        </View>
      </View>

      {/* Socials */}
      <View className="mt-7 w-full">
        <Text className="text-lg text-black font-pmedium px-4">
          Checkout Our Social Media!
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row mt-3 px-4 mb-6">
            <CustomHomeIcon
              image={icons.satshrut}
              title={'Satshrut'}
              onPress={async () => {
                await Linking.openURL('https://satshrut.vitraagvigyaan.org/');
              }}
            />

            <CustomHomeIcon
              image={icons.vvYt}
              title={'Youtube'}
              onPress={async () => {
                await Linking.openURL('https://youtube.com/@vitraagvigyaan');
              }}
            />

            <CustomHomeIcon
              image={icons.vvInsta}
              title={'VV Insta'}
              onPress={async () => {
                await Linking.openURL(
                  'https://www.instagram.com/vitraag.vigyaan/'
                );
              }}
            />

            <CustomHomeIcon
              image={icons.rcGlobalInsta}
              title={'RC Global'}
              onPress={async () => {
                await Linking.openURL(
                  'https://www.instagram.com/researchcentre_global/'
                );
              }}
            />

            <CustomHomeIcon
              image={icons.sparshInsta}
              title={'Sparsh'}
              onPress={async () => {
                await Linking.openURL(
                  'https://www.instagram.com/sparsh.international/'
                );
              }}
            />
          </View>
        </ScrollView>
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
