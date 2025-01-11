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
import handleAPICall from '../../utils/HandleApiCall';

const guestBookingConfirmation = () => {
  const router = useRouter();
  const { user, guestData } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const transformData = (input) => {
    const transformGuestGroup = (guestGroup) =>
      guestGroup.map((group) => {
        const transformed = {};
        if (group.roomType) transformed.roomType = group.roomType;
        if (group.floorType && group.floorType !== 'n')
          transformed.floorType = group.floorType;
        if (group.guests)
          transformed.guests = group.guests.map((guest) => guest.id);
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
              guestGroup: transformGuestGroup(primaryData.guestGroup)
            }
          };
        case 'food':
          return {
            booking_type: 'food',
            details: {
              start_date: primaryData.startDay,
              end_date: primaryData.endDay,
              guestGroup: transformGuestGroup(primaryData.guestGroup)
            }
          };
        case 'adhyayan':
          return {
            booking_type: 'adhyayan',
            details: {
              shibir_ids: [primaryData.adhyayan.id],
              guests: primaryData.guests.map((guest) => guest.id)
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
                  guestGroup: transformGuestGroup(input[key].guestGroup)
                }
              };
            case 'food':
              return {
                booking_type: key,
                details: {
                  start_date: input[key].startDay,
                  end_date: input[key].endDay,
                  guestGroup: transformGuestGroup(input[key].guestGroup)
                }
              };
            case 'adhyayan':
              return {
                booking_type: 'adhyayan',
                details: {
                  shibir_ids: [input[key].adhyayan.id],
                  guests: input[key].guests.map((guest) => guest.id)
                }
              };
            default:
              throw new Error(`Unsupported addon type: ${key}`);
          }
        });

    return {
      cardno: user.cardno,
      transaction_type: 'upi',
      transaction_ref: '',
      primary_booking: primaryBookingDetails(input.primary),
      addons: transformAddons(input)
    };
  };
  const transformedData = transformData(JSON.parse(JSON.stringify(guestData)));

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
            handlePress={async () => {
              setIsSubmitting(true);
              const onSuccess = (_data) => {
                setIsSubmitting(true);
                router.push('/booking/paymentConfirmation');
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
              // console.log('GUEST DATA: ', JSON.stringify(guestData));
              // console.log(
              //   'TRANSFORMED DATA: ',
              //   JSON.stringify(transformedData)
              // );
              // setIsSubmitting(true);
              // router.push('/booking/paymentConfirmation');
            }}
            containerStyles="mb-8 min-h-[62px]"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default guestBookingConfirmation;
