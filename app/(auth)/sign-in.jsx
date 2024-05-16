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
import { images, BASE_URL } from '../../constants';
import { router } from 'expo-router';
import FormFIeld from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import axios from 'axios';
import { useGlobalContext } from '../../context/GlobalProvider';

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
    try {
      const res = await axios({
        method: 'GET',
        url: `${BASE_URL}/client/verify?mobno=${form.phone}`
      });
      if (res.status == 200) {
        setUser(res.data.data);
        setIsLoggedIn(true);
        router.push('/confirmation');
      } else {
        Alert.alert('Error', res.data.message);
      }
    } catch (error) {
      if (error.response == 404) {
        Alert.alert('Error', 'User not found');
      } else {
        Alert.alert('Error', error.message);
      }
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
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

            <FormFIeld
              text="Phone Number"
              prefix="+91"
              value={form.phone}
              handleChangeText={(e) => setForm({ ...form, phone: e })}
              otherStyles="mt-7"
              keyboardType="number-pad"
              placeholder="87990-02450"
              maxLength={10}
            />

            <CustomButton
              text="Sign In"
              handlePress={submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
