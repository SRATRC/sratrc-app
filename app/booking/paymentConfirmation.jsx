import {
  View,
  Text,
  ImageBackground,
  Image,
  Linking,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, images } from '../../constants';
import CustomButton from '../../components/CustomButton';

const paymentConfirmation = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const DottedLine = () => (
    <View className={`w-full my-4 border border-dotted border-gray-300`}></View>
  );

  const openApp = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', "Can't handle url: " + url);
        }
      })
      .catch((err) => Alert.alert('Error', 'an error occurred: ' + err));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="h-full justify-center">
        <ImageBackground
          source={images.ticketbg}
          resizeMode="contain"
          className="justify-center items-center"
        >
          <View className="h-[70%] w-[70%] items-center justify-center">
            <Text className="text-2xl font-pmedium text-center">
              Payment Successful
            </Text>

            <DottedLine />

            <View className="flex flex-col w-full space-y-2">
              <View className="flex flex-row justify-between">
                <Text className="text-gray-400 font-pregular text-sm">
                  Reference Number
                </Text>
                <Text className="text-black font-pregular text-sm">
                  000085752257
                </Text>
              </View>

              <View className="flex flex-row justify-between">
                <Text className="text-gray-400 font-pregular text-sm">
                  Date
                </Text>
                <Text className="text-black font-pregular text-sm">
                  Mar 22, 2023
                </Text>
              </View>

              <View className="flex flex-row justify-between">
                <Text className="text-gray-400 font-pregular text-sm">
                  Time
                </Text>
                <Text className="text-black font-pregular text-sm">
                  07:80 AM
                </Text>
              </View>

              <View className="flex flex-row justify-between">
                <Text className="text-gray-400 font-pregular text-sm">
                  Payment Method
                </Text>
                <Text className="text-black font-pregular text-sm">
                  Credit Card
                </Text>
              </View>
            </View>

            <DottedLine />

            <View className="flex flex-row w-full justify-between">
              <Text className="text-gray-400 font-pregular text-sm">
                Amount
              </Text>
              <Text className="text-black font-pregular text-sm">
                INR 1,000
              </Text>
            </View>

            <DottedLine />

            <View className="flex flex-col w-full space-y-2">
              <Text className="text-gray-400 font-pregular text-sm">
                Join the following WhatsApp groups by clicking on the links
                bellow to proceed
              </Text>
              <View className="flex flex-row space-x-2 items-center">
                <Image
                  source={
                    isLoading ? icons.grayTickCircle : icons.orangeTickCircle
                  }
                  className="w-4 h-4"
                />
                <TouchableOpacity
                  onPress={() => {
                    openApp('https://chat.whatsapp.com/G3p8p3v0v8g');
                    setIsLoading(false);
                  }}
                >
                  <Text className="font-pregular text-sm text-blue-500 underline">
                    join whatsapp group
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>

        <CustomButton
          containerStyles="min-h-[62px] mx-7"
          text={'Back to Home'}
          handlePress={() => router.push('/home')}
          isLoading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default paymentConfirmation;
