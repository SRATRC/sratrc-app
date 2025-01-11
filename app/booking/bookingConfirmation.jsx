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
import handleAPICall from '../../utils/HandleApiCall';

const bookingConfirmation = () => {
  const router = useRouter();
  const { user, data } = useGlobalContext();

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
            handlePress={async () => {
              setIsSubmitting(true);

              const payload = {
                cardno: user.cardno,
                transaction_type: 'upi',
                transaction_ref: 'none'
              };

              if (data.primary === 'room') {
                payload.primary_booking = {
                  booking_type: 'room',
                  details: {
                    checkin_date: data.room?.startDay,
                    checkout_date: data.room?.endDay,
                    room_type: data.room?.roomType,
                    floor_type: data.room?.floorType
                  }
                };
              } else if (data.primary === 'travel') {
                payload.primary_booking = {
                  booking_type: 'travel',
                  details: {
                    date: data.travel?.date,
                    pickup_point: data.travel?.pickup,
                    drop_point: data.travel?.drop,
                    luggage: data.travel?.luggage,
                    type: data.travel?.type,
                    special_request: data.travel?.special_request
                  }
                };
              } else if (data.primary === 'adhyayan') {
                payload.primary_booking = {
                  booking_type: 'adhyayan',
                  details: {
                    shibir_ids: [data.adhyayan?.id]
                  }
                };
              }

              const addons = [];
              if (data.primary !== 'room' && data.room) {
                addons.push({
                  booking_type: 'room',
                  details: {
                    checkin_date: data.room?.startDay,
                    checkout_date: data.room?.endDay,
                    room_type: data.room?.roomType,
                    floor_type: data.room?.floorType
                  }
                });
              }
              if (data.primary !== 'food' && data.food) {
                addons.push({
                  booking_type: 'food',
                  details: {
                    start_date: data.food?.startDay,
                    end_date: data.food?.endDay,
                    breakfast: data.food?.meals.includes('breakfast'),
                    lunch: data.food?.meals.includes('lunch'),
                    dinner: data.food?.meals.includes('dinner'),
                    spicy: data.food?.spicy,
                    hightea: data.food?.hightea
                  }
                });
              }
              if (data.primary !== 'travel' && data.travel) {
                addons.push({
                  booking_type: 'travel',
                  details: {
                    date: data.travel?.date,
                    pickup_point: data.travel?.pickup,
                    drop_point: data.travel?.drop,
                    luggage: data.travel?.luggage,
                    type: data.travel?.type,
                    comments: data.travel?.special_request
                  }
                });
              }
              if (data.primary !== 'adhyayan' && data.adhyayan) {
                addons.push({
                  booking_type: 'adhyayan',
                  details: {
                    shibir_ids: [data.adhyayan?.id]
                  }
                });
              }

              if (addons.length > 0) {
                payload.addons = addons;
              }

              const onSuccess = (_data) => {
                router.push('/booking/paymentConfirmation');
              };

              const onFinally = () => {
                setIsSubmitting(false);
              };

              await handleAPICall(
                'POST',
                '/unified/booking',
                null,
                payload,
                onSuccess,
                onFinally
              );
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
