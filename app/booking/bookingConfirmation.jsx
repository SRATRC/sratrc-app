import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../../constants';
import RoomBookingDetails from '../../components/booking details cards/RoomBookingDetails';
import PageHeader from '../../components/PageHeader';
import TravelBookingDetails from '../../components/booking details cards/TravelBookingDetails';
import AdhyayanBookingDetails from '../../components/booking details cards/AdhyayanBookingDetails';
import CustomButton from '../../components/CustomButton';
import FoodBookingDetails from '../../components/booking details cards/FoodBookingDetails';

const bookingConfirmation = () => {
  const router = useRouter();
  const { data } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader title="Payment Summary" icon={icons.backArrow} />

        {data.room && <RoomBookingDetails containerStyles={'mt-6'} />}
        {data.travel && <TravelBookingDetails containerStyles={'mt-6'} />}
        {data.adhyayan && <AdhyayanBookingDetails containerStyles={'mt-6'} />}
        {data.food && <FoodBookingDetails containerStyles={'mt-6'} />}

        <View className="w-full px-4 mt-4">
          <Text className="text-xl font-psemibold text-secondary">Charges</Text>
          <View className="flex-col mt-2">
            {data.room && (
              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-400 font-pregular text-base">
                  Room Charge
                </Text>
                <Text className="text-black font-pregular text-base">
                  ₹ {data.room.charge}
                </Text>
              </View>
            )}
            {data.travel && (
              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-400 font-pregular text-base">
                  Travel Charge
                </Text>
                <Text className="text-black font-pregular text-base">
                  ₹ {data.travel.charge}
                </Text>
              </View>
            )}
            {data.adhyayan && (
              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-400 font-pregular text-base">
                  Adhyayan Charge
                </Text>
                <Text className="text-black font-pregular text-base">
                  ₹{' '}
                  {Array.isArray(data.adhyayan)
                    ? data.adhyayan.reduce(
                        (total, item) => total + (item.amount ?? 0),
                        0
                      )
                    : data.adhyayan.amount ?? 0}
                </Text>
              </View>
            )}

            <View className="flex-row justify-between mt-4">
              <Text className="text-gray-400 font-psemibold text-xl">
                Total Charge
              </Text>
              <Text className="text-black font-psemibold text-xl">
                ₹{' '}
                {(data.room?.charge ?? 0) +
                  (data.travel?.charge ?? 0) +
                  (Array.isArray(data.adhyayan)
                    ? data.adhyayan.reduce(
                        (total, item) => total + (item.amount ?? 0),
                        0
                      )
                    : data.adhyayan?.amount ?? 0)}
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

export default bookingConfirmation;
