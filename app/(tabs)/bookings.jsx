import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { types } from '../../constants';
import CustomChipGroup from '../../components/CustomChipGroup';
import { useGlobalContext } from '../../context/GlobalProvider';
import RoomBookingCancellation from '../../components/cancel booking/RoomBookingCancellation';
import FoodBookingCancellation from '../../components/cancel booking/FoodBookingCancellation';
import TravelBookingCancellation from '../../components/cancel booking/TravelBookingCancellation';
import AdhyayanBookingCancellation from '../../components/cancel booking/AdhyayanBookingCancellation';

const Bookings = () => {
  const [selectedChip, setSelectedChip] = useState(types.booking_type_room);
  const chips = [
    types.booking_type_room,
    types.booking_type_food,
    types.booking_type_travel,
    types.booking_type_adhyayan
  ];

  const { user } = useGlobalContext();

  return (
    <SafeAreaView className="h-full bg-white" edges={['right', 'top', 'left']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full px-4 my-6">
            <Text className="text-2xl font-psemibold">{`${selectedChip} Booking`}</Text>

            <CustomChipGroup
              chips={chips}
              selectedChip={selectedChip}
              handleChipPress={(chip) => setSelectedChip(chip)}
            />

            {selectedChip === types.booking_type_room && (
              <RoomBookingCancellation user={user} />
            )}
            {selectedChip === types.booking_type_food && (
              <FoodBookingCancellation user={user} />
            )}
            {selectedChip === types.booking_type_travel && (
              <TravelBookingCancellation user={user} />
            )}
            {selectedChip === types.booking_type_adhyayan && (
              <AdhyayanBookingCancellation user={user} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Bookings;
