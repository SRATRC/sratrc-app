import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, icons, images } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import CustomButton from '../../components/CustomButton';
import * as Brightness from 'expo-brightness';

const ImageCaptureOnboarding = () => {
  const { setUser, removeItem } = useGlobalContext();
  const [permissionResponse, requestPermission] = Brightness.usePermissions();
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  // const handleNextStep = () => setCurrentStep((prev) => prev + 1);
  // const handlePrevStep = () => setCurrentStep((prev) => prev - 1);

  useEffect(() => {
    if (permissionResponse?.status === 'granted') {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [permissionResponse]);

  const steps = [
    {
      title: 'We need Permission to manage your brightness',
      description:
        "For smooth functioning of application we need to manage the phone's brightness.",
      btnText: 'Provide Permission',
      action: () => {
        requestPermission();
      }
    },
    {
      title: 'Help Us Verify Your Identity',
      description:
        'To ensure safety for all, please upload your picture. This step helps us secure your profile.',
      btnText: 'Upload My Picture',
      action: () => {
        router.replace('/camera');
      }
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        alwaysBounceVertical={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 justify-between px-6 py-10">
          {/* Header */}
          <View className="items-center mt-4">
            <Image
              source={images.logo}
              className="w-[108px] h-[57px]"
              resizeMode="contain"
            />
          </View>

          {/* Step Content */}
          <View className="flex-1 justify-center items-center">
            <Text className="text-sm text-gray-500 mb-2">
              Step {currentStep} of {steps.length}
            </Text>
            <View
              style={{
                width: '80%',
                height: 6,
                backgroundColor: '#E0E0E0',
                borderRadius: 3,
                marginBottom: 20
              }}
            >
              <View
                style={{
                  width: `${(currentStep / 2) * 100}%`,
                  height: '100%',
                  backgroundColor: colors.orange,
                  borderRadius: 3
                }}
              />
            </View>

            <Text className="text-lg text-gray-700 font-semibold text-center">
              {steps[currentStep - 1].title}
            </Text>
            <Text className="text-sm text-gray-500 text-center mt-2 px-4">
              {steps[currentStep - 1].description}
            </Text>
          </View>

          {/* Footer Buttons */}
          <View className="items-center">
            {steps[currentStep - 1].btnText &&
              steps[currentStep - 1].action && (
                <CustomButton
                  text={steps[currentStep - 1].btnText}
                  handlePress={steps[currentStep - 1].action}
                  containerStyles="min-h-[52px] w-full rounded-lg mb-4"
                  textStyle="text-white text-base font-medium"
                />
              )}

            {/* <View className="flex-1 flex-row justify-center items-center mb-4">
              <CustomButton
                text="Back"
                handlePress={handlePrevStep}
                containerStyles="min-h-[52px] flex-1 w-full mr-1 rounded-lg bg-gray-300"
                textStyle="text-black text-base font-medium"
              />
              <CustomButton
                text="Next"
                handlePress={handleNextStep}
                containerStyles="min-h-[52px] flex-1 w-full ml-1 rounded-lg bg-orange-500"
                textStyle="text-white text-base font-medium"
              />
            </View> */}

            <TouchableWithoutFeedback
              onPress={() => {
                setUser(null);
                removeItem('user');
                router.replace('/sign-in');
              }}
            >
              <View className="flex flex-row items-center">
                <Image
                  source={icons.logout}
                  className="w-4 h-4"
                  resizeMode="contain"
                />
                <Text className="text-sm font-pregular text-black ml-2">
                  Logout
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ImageCaptureOnboarding;
