import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { icons, images } from '../../constants';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import FormDisplayField from '../../components/FormDisplayField';
import CustomButton from '../../components/CustomButton';
import PageHeader from '../../components/PageHeader';

const Confirmation = () => {
  const { user, setCurrentUser } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const submit = async () => {
    setIsSubmitting(true);
    try {
      if (user.pfp) {
        await setCurrentUser(user);
        router.replace('/home');
      } else {
        router.replace('/imageCapture');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <PageHeader title={''} icon={icons.backArrow} />
      {/* <TouchableOpacity onPress={() => router.back()}>
        <Image
          source={icons.backArrow}
          className="w-5 h-5 p-2 m-5"
          resizeMode="contain"
        />
      </TouchableOpacity> */}
      {/* <ScrollView alwaysBounceVertical={false}> */}
      <View className="w-full justify-center min-h-[83vh] px-4">
        <Image
          source={images.logo}
          className="w-[108px] h-[57px]"
          resizeMode="contain"
        />
        <Text className="text-md text-gray-400 font-pmedium mt-3">
          Thank You! Please confirm your detail
        </Text>

        <FormDisplayField
          text="Name"
          value={user.issuedto}
          otherStyles="mt-7"
        />

        <FormDisplayField
          text="Centre"
          value={user.centre}
          otherStyles="mt-7"
        />

        <CustomButton
          text="Confirm"
          handlePress={submit}
          containerStyles="mt-7 min-h-[62px]"
          isLoading={isSubmitting}
        />
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default Confirmation;
