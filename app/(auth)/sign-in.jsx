import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { images } from '../../constants';
import { router } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useNotification } from '../../context/NotificationContext';
import { handleUserNavigation } from '../../utils/navigationValidations';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import handleAPICall from '../../utils/HandleApiCall';

const SignIn = () => {
  const [form, setForm] = useState({
    phone: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, setUser, setCurrentUser } = useGlobalContext();
  const { expoPushToken } = useNotification();

  const submit = async () => {
    setIsSubmitting(true);

    if (!form.phone || form.phone.length < 10 || !form.password) {
      Alert.alert('Error', 'Please fill the fields corectly');
      setIsSubmitting(false);
      return;
    }

    const onSuccess = async (data) => {
      setUser((prevUser) => {
        const updatedUser = data.data;
        setCurrentUser(updatedUser);
        handleUserNavigation(updatedUser, router);
        return updatedUser;
      });
    };

    const onFinally = () => {
      setIsSubmitting(false);
    };

    await handleAPICall(
      'POST',
      '/client/verifyAndLogin',
      null,
      {
        mobno: form.phone,
        password: form.password,
        token: expoPushToken
      },
      onSuccess,
      onFinally
    );
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView alwaysBounceVertical={false}>
          <View className="w-full justify-center min-h-[83vh] px-4 my-6">
            <Image
              source={images.logo}
              className="w-[108px] h-[57px]"
              resizeMode="contain"
            />
            <Text className="text-2xl text-black text-semibold font-psemibold mt-5">
              Welcome to SRATRC
            </Text>

            <FormField
              text="Phone Number"
              value={form.phone}
              handleChangeText={(e) => setForm({ ...form, phone: e })}
              otherStyles="mt-7"
              inputStyles="font-pmedium text-base text-gray-400"
              keyboardType="number-pad"
              placeholder="Enter Your Phone Number"
              maxLength={10}
            />

            <FormField
              text="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
              inputStyles="font-pmedium text-base text-gray-400"
              keyboardType="default"
              placeholder="Enter Your Password"
            />

            <CustomButton
              text="Sign In"
              handlePress={submit}
              containerStyles="mt-7 min-h-[62px]"
              isLoading={isSubmitting}
              isDisabled={!form.phone || !form.password}
            />

            {/* <View className="flex flex-row items-center justify-start mt-2 space-x-2">
              <Text className="text-sm font-pregular">
                Do not have an account?
              </Text>

              <Pressable onPress={() => router.push('/guestReferral')}>
                <Text className="text-secondary-100 text-sm font-pmedium">
                  sign up
                </Text>
              </Pressable>
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
