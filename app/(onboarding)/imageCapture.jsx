import { View, Text, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, images } from '../../constants';
import CustomButton from '../../components/CustomButton';

const ImageCaptureOnboarding = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        alwaysBounceVertical={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 justify-between px-6 py-10">
          <View className="items-center mt-4">
            <Image
              source={images.logo}
              className="w-[108px] h-[57px]"
              resizeMode="contain"
            />
          </View>

          <View className="flex-1 justify-center items-center">
            {/* <Text className="text-sm text-gray-500 mb-2">Step 1 of 3</Text>
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
                  width: '33%',
                  height: '100%',
                  backgroundColor: colors.orange,
                  borderRadius: 3
                }}
              />
            </View> */}

            <Text className="text-lg text-gray-700 font-semibold text-center">
              Help Us Verify Your Identity
            </Text>
            <Text className="text-sm text-gray-500 text-center mt-2 px-4">
              To ensure safety for all, please upload your picture. This step
              helps us secure your profile.
            </Text>
          </View>

          <View className="items-center">
            <CustomButton
              text="Upload My Picture"
              handlePress={() => {
                setIsSubmitting(true);
                router.replace('/camera');
                setIsSubmitting(false);
              }}
              containerStyles="min-h-[52px] w-full rounded-lg mb-4"
              textStyle="text-white text-base font-medium"
              isLoading={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ImageCaptureOnboarding;
