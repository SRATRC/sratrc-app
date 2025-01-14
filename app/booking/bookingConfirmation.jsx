import { View, Text, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
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
  const { user, data, setData } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const prepareRequestBody = () => {
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

    return payload;
  };

  const fetchValidation = async () => {
    return new Promise((resolve, reject) => {
      const payload = prepareRequestBody();

      handleAPICall(
        'POST',
        '/unified/validate',
        null,
        payload,
        (res) => {
          setData((prev) => ({ ...prev, validationData: res.data }));
          resolve(res.data);
        },
        () =>
          reject(new Error('Failed to fetch validation and transaction data'))
      );
    });
  };

  const {
    isLoading: isValidationDataLoading,
    isError: isValidationDataError,
    error: validationDataError,
    data: validationData
  } = useQuery({
    queryKey: ['validations', user.cardno],
    queryFn: fetchValidation
  });

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

        {validationData && (
          <View className="w-full px-4 mt-4">
            <Text className="text-xl font-psemibold text-secondary mb-4">
              Charges
            </Text>
            <View
              className={`bg-white rounded-2xl p-4 ${
                Platform.OS === 'ios'
                  ? 'shadow-lg shadow-gray-200'
                  : 'shadow-2xl shadow-gray-400'
              }`}
            >
              <View className="flex-col space-y-2">
                {validationData.roomDetails?.charge && (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-500 font-pregular text-base">
                      Room Charge
                    </Text>
                    <Text className="text-black font-pregular text-base">
                      ₹ {validationData.roomDetails.charge}
                    </Text>
                  </View>
                )}
                {validationData.travelDetails?.charge && (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-500 font-pregular text-base">
                      Travel Charge
                    </Text>
                    <Text className="text-black font-pregular text-base">
                      ₹ {validationData.travelDetails.charge}
                    </Text>
                  </View>
                )}
                {validationData.adhyayanDetails &&
                  validationData.adhyayanDetails.length > 0 && (
                    <View className="flex-row justify-between items-center">
                      <Text className="text-gray-500 font-pregular text-base">
                        Adhyayan Charge
                      </Text>
                      <Text className="text-black font-pregular text-base">
                        ₹{' '}
                        {validationData.adhyayanDetails.reduce(
                          (total, shibir) => total + shibir.charge,
                          0
                        )}
                      </Text>
                    </View>
                  )}
                {validationData.taxes && (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-500 font-pregular text-base">
                      Tax
                    </Text>
                    <Text className="text-black font-pregular text-base">
                      ₹ {validationData.taxes}
                    </Text>
                  </View>
                )}
                <View className="flex-row justify-between items-center border-t border-gray-200 pt-4 mt-2">
                  <Text className="text-gray-800 font-psemibold text-xl">
                    Total Charge
                  </Text>
                  <Text className="text-secondary font-psemibold text-xl">
                    ₹ {validationData.totalCharge}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View className="w-full px-4 mt-6">
          <CustomButton
            text="Proceed to Payment"
            handlePress={async () => {
              setIsSubmitting(true);

              const payload = prepareRequestBody();

              const onSuccess = (_data) => {
                router.replace('/booking/paymentConfirmation');
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
