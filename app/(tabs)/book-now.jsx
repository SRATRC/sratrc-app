import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { types } from '../../constants';
import CustomChipGroup from '../../components/CustomChipGroup';
import { useGlobalContext } from '../../context/GlobalProvider';
import RoomBooking from '../../components/booking/RoomBooking';
import FoodBooking from '../../components/booking/FoodBooking';
import TravelBooking from '../../components/booking/TravelBooking';
import AdhyayanBooking from '../../components/booking/AdhyayanBooking';

const BookNow = () => {
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
            <RoomBooking user={user} />
          )}
          {selectedChip === types.booking_type_food && (
            <FoodBooking user={user} />
          )}
          {selectedChip === types.booking_type_travel && (
            <TravelBooking user={user} />
          )}
          {selectedChip === types.booking_type_adhyayan && (
            <AdhyayanBooking user={user} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookNow;
