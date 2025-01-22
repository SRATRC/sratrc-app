import { View, Text, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../../constants';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../../components/PageHeader';
import CustomButton from '../../components/CustomButton';
import handleAPICall from '../../utils/HandleApiCall';
import MumukshuAdhyayanBookingDetails from '../../components/booking details cards/MumukshuAdhyayanBookingDetails';
import MumukshuRoomBookingDetails from '../../components/booking details cards/MumukshuRoomBookingDetails';
import MumukshuTravelBookingDetails from '../../components/booking details cards/MumukshuTravelBookingDetails';
import MumukshuFoodBookingDetails from '../../components/booking details cards/MumukshuFoodBookingDetails';

const mumukshuBookingConfirmation = () => {
  const router = useRouter();
  const { user, mumukshuData, setMumukshuData } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const transformData = (input) => {
    const transformMumukshuGroup = (mumukshuGroup) =>
      mumukshuGroup.map((group) => {
        const transformed = {};
        if (group.roomType) transformed.roomType = group.roomType;
        if (group.floorType && group.floorType !== 'n')
          transformed.floorType = group.floorType;
        if (group.mumukshus) transformed.mumukshus = [...group.mumukshus];
        if (group.meals) transformed.meals = group.meals;
        if (group.spicy !== undefined) transformed.spicy = group.spicy;
        if (group.hightea) transformed.high_tea = group.hightea;
        return transformed;
      });

    const primaryBookingDetails = (primaryKey) => {
      const primaryData = input[primaryKey];
      switch (primaryKey) {
        case 'room':
          return {
            booking_type: 'room',
            details: {
              checkin_date: primaryData.startDay,
              checkout_date: primaryData.endDay,
              mumukshuGroup: transformMumukshuGroup(primaryData.mumukshuGroup)
            }
          };
        case 'food':
          return {
            booking_type: 'food',
            details: {
              start_date: primaryData.startDay,
              end_date: primaryData.endDay,
              mumukshuGroup: transformMumukshuGroup(primaryData.mumukshuGroup)
            }
          };
        case 'adhyayan':
          return {
            booking_type: 'adhyayan',
            details: {
              shibir_ids: [primaryData.adhyayan.id],
              mumukshus: [...primaryData.mumukshuGroup]
            }
          };
        default:
          throw new Error(`Unsupported primary booking type: ${primaryKey}`);
      }
    };

    const transformAddons = (input) =>
      Object.keys(input)
        .filter((key) => key !== input.primary && key !== 'primary')
        .map((key) => {
          switch (key) {
            case 'room':
              return {
                booking_type: key,
                details: {
                  checkin_date: input[key].startDay,
                  checkout_date: input[key].endDay,
                  mumukshuGroup: transformMumukshuGroup(
                    input[key].mumukshuGroup
                  )
                }
              };
            case 'food':
              return {
                booking_type: key,
                details: {
                  start_date: input[key].startDay,
                  end_date: input[key].endDay,
                  mumukshuGroup: transformMumukshuGroup(
                    input[key].mumukshuGroup
                  )
                }
              };
            case 'adhyayan':
              return {
                booking_type: key,
                details: {
                  shibir_ids: [input[key].adhyayan.id],
                  mumukshus: [...input[key].mumukshus]
                }
              };
            case 'travel':
              return {
                booking_type: key,
                details: {
                  date: input[key].date,
                  mumukshuGroup: transformMumukshuGroup(
                    input[key].mumukshuGroup
                  )
                }
              };
            case 'validationData':
              return null;
            default:
              throw new Error(`Unsupported addon type: ${key}`);
          }
        })
        .filter(Boolean);
    return {
      cardno: user.cardno,
      transaction_type: 'upi',
      transaction_ref: '',
      primary_booking: primaryBookingDetails(input.primary),
      addons: transformAddons(input)
    };
  };
  const transformedData = transformData(
    JSON.parse(JSON.stringify(mumukshuData))
  );

  console.log(JSON.stringify(transformedData));

  const fetchValidation = async () => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'POST',
        '/guest/validate',
        null,
        transformedData,
        (res) => {
          setGuestData((prev) => ({ ...prev, validationData: res.data }));
          resolve(res.data);
        },
        () =>
          reject(new Error('Failed to fetch validation and transaction data'))
      );
    });
  };

  // const {
  //   isLoading: isValidationDataLoading,
  //   isError: isValidationDataError,
  //   error: validationDataError,
  //   data: validationData
  // } = useQuery({
  //   queryKey: ['guestValidations', user.cardno],
  //   queryFn: fetchValidation
  // });

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader title="Payment Summary" icon={icons.backArrow} />

        {mumukshuData.room && (
          <MumukshuRoomBookingDetails containerStyles={'mt-6'} />
        )}
        {mumukshuData.adhyayan && (
          <MumukshuAdhyayanBookingDetails containerStyles={'mt-6'} />
        )}
        {mumukshuData.food && (
          <MumukshuFoodBookingDetails containerStyles={'mt-6'} />
        )}
        {mumukshuData.travel && (
          <MumukshuTravelBookingDetails containerStyles={'mt-6'} />
        )}

        {/* {validationData && (
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
                {validationData.roomDetails &&
                  validationData.roomDetails?.length > 0 &&
                  validationData.roomDetails.reduce(
                    (total, room) => total + room.charge,
                    0
                  ) > 0 && (
                    <View className="flex-row justify-between items-center">
                      <Text className="text-gray-500 font-pregular text-base">
                        Room Charge
                      </Text>
                      <Text className="text-black font-pregular text-base">
                        ₹{' '}
                        {validationData.roomDetails.reduce(
                          (total, room) => total + room.charge,
                          0
                        )}
                      </Text>
                    </View>
                  )}
                {validationData.foodDetails?.charge && (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-500 font-pregular text-base">
                      Food Charge
                    </Text>
                    <Text className="text-black font-pregular text-base">
                      ₹ {validationData.foodDetails.charge}
                    </Text>
                  </View>
                )}
                {validationData.adhyayanDetails &&
                  validationData.adhyayanDetails.length > 0 &&
                  validationData.adhyayanDetails.reduce(
                    (total, shibir) => total + shibir.charge,
                    0
                  ) && (
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
        )} */}

        <View className="w-full px-4 mt-6">
          <CustomButton
            text="Proceed to Payment"
            handlePress={async () => {
              setIsSubmitting(true);
              const onSuccess = (_data) => {
                router.replace('/booking/paymentConfirmation');
              };

              const onFinally = () => {
                setIsSubmitting(false);
              };

              await handleAPICall(
                'POST',
                '/guest/booking',
                null,
                transformedData,
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

export default mumukshuBookingConfirmation;
