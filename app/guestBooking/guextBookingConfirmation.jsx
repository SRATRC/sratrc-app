import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../../constants';
import GuestRoomBookingDetails from '../../components/booking details cards/GuestRoomBookingDetails';
import GuestAdhyayanBookingDetails from '../../components/booking details cards/GuestAdhyayanBookingDetails';
import GuestFoodBookingDetails from '../../components/booking details cards/GuestFoodBookingDetails';
import PageHeader from '../../components/PageHeader';
import CustomButton from '../../components/CustomButton';

const guextBookingConfirmation = () => {
  const router = useRouter();
  const { guestData } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader title="Payment Summary" icon={icons.backArrow} />

        {guestData.room && <GuestRoomBookingDetails containerStyles={'mt-6'} />}
        {guestData.adhyayan && (
          <GuestAdhyayanBookingDetails containerStyles={'mt-6'} />
        )}
        {guestData.food && <GuestFoodBookingDetails containerStyles={'mt-6'} />}

        <View className="w-full px-4 mt-4">
          <Text className="text-xl font-psemibold text-secondary">Charges</Text>
          <View className="flex-col mt-2">
            {guestData.room && (
              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-400 font-pregular text-base">
                  Room Charge
                </Text>
                <Text className="text-black font-pregular text-base">
                  ₹ {guestData.room.charge}
                </Text>
              </View>
            )}
            {guestData.adhyayan && (
              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-400 font-pregular text-base">
                  Adhyayan Charge
                </Text>
                <Text className="text-black font-pregular text-base">
                  ₹{' '}
                  {Array.isArray(guestData.adhyayan)
                    ? guestData.adhyayan.reduce(
                        (total, item) => total + (item.amount ?? 0),
                        0
                      )
                    : guestData.adhyayan.amount ?? 0}
                </Text>
              </View>
            )}

            <View className="flex-row justify-between mt-4">
              <Text className="text-gray-400 font-psemibold text-xl">
                Total Charge
              </Text>
              <Text className="text-black font-psemibold text-xl">
                ₹{' '}
                {(guestData.room?.charge ?? 0) +
                  (Array.isArray(guestData.adhyayan)
                    ? guestData.adhyayan.reduce(
                        (total, item) => total + (item.amount ?? 0),
                        0
                      )
                    : guestData.adhyayan?.amount ?? 0)}
              </Text>
            </View>
          </View>
        </View>

        <View className="w-full px-4 mt-6">
          <CustomButton
            text="Proceed to Payment"
            handlePress={() => {
              setIsSubmitting(true);
              router.push('/booking/paymentConfirmation');
            }}
            containerStyles="mb-8 min-h-[62px]"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default guextBookingConfirmation;
