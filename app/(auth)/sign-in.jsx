import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  Alert
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { images } from '../../constants';
import { router } from 'expo-router';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { useGlobalContext } from '../../context/GlobalProvider';
import handleAPICall from '../../utils/HandleApiCall';

const SignIn = () => {
  const [form, setForm] = useState({
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setUser, setIsLoggedIn } = useGlobalContext();

  const submit = async () => {
    if (!form.phone || form.phone.length < 10) {
      Alert.alert('Error', 'Please fill the fields corectly');
      return;
    }

    setIsSubmitting(true);

    const onSuccess = (data) => {
      setUser(data.data);
      setIsLoggedIn(true);
      router.push('/confirmation');
    };

    const onFinally = () => {
      setIsSubmitting(false);
    };

    await handleAPICall(
      'GET',
      '/client/verify',
      { mobno: form.phone },
      null,
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
              prefix="+91"
              value={form.phone}
              handleChangeText={(e) => setForm({ ...form, phone: e })}
              otherStyles="mt-7"
              inputStyles="font-pmedium text-base text-gray-400"
              keyboardType="number-pad"
              placeholder="Enter Your Phone Number"
              maxLength={10}
            />

            <CustomButton
              text="Sign In"
              handlePress={submit}
              containerStyles="mt-7 min-h-[62px]"
              isLoading={isSubmitting}
            />

            {/* <View className="flex flex-row items-center justify-start mt-2 space-x-2">
              <Text className="text-sm font-pregular">
                Do not have an account?
              </Text>

              <TouchableOpacity onPress={() => router.push('/guestReferral')}>
                <Text className="text-secondary-100 text-sm font-pmedium">
                  sign up
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
