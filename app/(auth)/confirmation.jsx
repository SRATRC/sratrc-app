import { View, Text, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { icons, images } from '../../constants';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useNotification } from '../../context/NotificationContext';
import { handleUserNavigation } from '../../utils/navigationValidations';
import handleAPICall from '../../utils/HandleApiCall';
import FormDisplayField from '../../components/FormDisplayField';
import CustomButton from '../../components/CustomButton';
import PageHeader from '../../components/PageHeader';

const Confirmation = () => {
  const { user, setCurrentUser } = useGlobalContext();
  const { expoPushToken } = useNotification();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const submit = async () => {
    setIsSubmitting(true);
    try {
      if (!expoPushToken) {
        Alert.alert('Error', 'Please enable push notifications');
        return;
      }

      const onSuccess = async (_data) => {
        await setCurrentUser(user);
        await handleUserNavigation(user, router);
      };

      const onFinally = () => {
        setIsSubmitting(false);
      };

      await handleAPICall(
        'POST',
        '/client/login',
        null,
        { cardno: user.cardno, token: expoPushToken },
        onSuccess,
        onFinally
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <PageHeader title={''} icon={icons.backArrow} />
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
          isDisabled={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
};

export default Confirmation;
