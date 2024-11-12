import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, types } from '../../constants';
import CustomButton from '../../components/CustomButton';
import PageHeader from '../../components/PageHeader';
import GuestRoomBookingDetails from '../../components/booking details cards/GuestRoomBookingDetails';
import GuestAdhyayanBookingDetails from '../../components/booking details cards/GuestAdhyayanBookingDetails';
import GuestRoomAddon from '../../components/booking addons/GuestRoomAddon';
import GuestFoodAddon from '../../components/booking addons/GuestFoodAddon';
import GuestAdhyayanAddon from '../../components/booking addons/GuestAdhyayanAddon';

const INITIAL_ROOM_FORM = {
  startDay: '',
  endDay: '',
  guestGroup: [{ roomType: '', floorType: '', guests: [], guestIndices: [] }]
};

const INITIAL_FOOD_FORM = {
  startDay: '',
  endDay: '',
  guestGroup: [
    { meals: [], spicy: '', hightea: 'NONE', guests: [], guestIndices: [] }
  ]
};

const INITIAL_ADHYAYAN_FORM = {
  adhyayan: {},
  guests: [],
  guestIndices: []
};

const guestAddons = () => {
  const { booking } = useLocalSearchParams();
  const { guestData } = useGlobalContext();
  const guests = guestData.adhyayan?.guests || guestData.room?.guests;
  const guest_dropdown = guests.map((guest, index) => ({
    value: index,
    label: guest.name
  }));

  const [roomForm, setRoomForm] = useState(INITIAL_ROOM_FORM);
  const addRoomForm = () => {
    setRoomForm((prevRoomForm) => ({
      ...prevRoomForm,
      guestGroup: [
        ...prevRoomForm.guestGroup,
        { roomType: '', floorType: '', guests: [], guestIndices: [] }
      ]
    }));
  };

  const reomveRoomForm = (indexToRemove) => {
    return () => {
      setRoomForm((prevRoomForm) => {
        const updatedGuestGroup = [...prevRoomForm.guestGroup];
        updatedGuestGroup.splice(indexToRemove, 1);
        return {
          ...prevRoomForm,
          guestGroup: updatedGuestGroup
        };
      });
    };
  };

  const updateRoomForm = (groupIndex, key, value) => {
    setRoomForm((prevRoomForm) => {
      const updatedGuestGroup = [...prevRoomForm.guestGroup];

      if (key === 'guests') {
        updatedGuestGroup[groupIndex].guestIndices = value;
        updatedGuestGroup[groupIndex].guests = guests.filter((_, i) =>
          value.includes(i)
        );
      } else {
        updatedGuestGroup[groupIndex][key] = value;
      }

      return {
        ...prevRoomForm,
        guestGroup: updatedGuestGroup
      };
    });
  };

  const [foodForm, setFoodForm] = useState(INITIAL_FOOD_FORM);
  const addFoodForm = () => {
    setFoodForm((prevFoodForm) => ({
      ...prevFoodForm,
      guestGroup: [
        ...prevFoodForm.guestGroup,
        { meals: [], spicy: '', hightea: 'NONE', guests: [], guestIndices: [] }
      ]
    }));
  };

  const reomveFoodForm = (indexToRemove) => {
    return () => {
      setFoodForm((prevFoodForm) => {
        const updatedGuestGroup = [...prevFoodForm.guestGroup];
        updatedGuestGroup.splice(indexToRemove, 1);
        return {
          ...prevFoodForm,
          guestGroup: updatedGuestGroup
        };
      });
    };
  };

  const updateFoodForm = (groupIndex, key, value) => {
    setFoodForm((prevFoodForm) => {
      const updatedGuestGroup = [...prevFoodForm.guestGroup];

      if (key === 'guests') {
        updatedGuestGroup[groupIndex].guestIndices = value;
        updatedGuestGroup[groupIndex].guests = guests.filter((_, i) =>
          value.includes(i)
        );
      } else {
        updatedGuestGroup[groupIndex][key] = value;
      }

      return {
        ...prevFoodForm,
        guestGroup: updatedGuestGroup
      };
    });
  };

  const [adhyayanForm, setAdhyayanForm] = useState(INITIAL_ADHYAYAN_FORM);
  const updateAdhyayanForm = (field, value) => {
    setAdhyayanForm((prevAdhyayanForm) => ({
      ...prevAdhyayanForm,
      [field]: value,
      ...(field === 'guestIndices' && {
        guests: guests.filter((_, i) => value.includes(i))
      })
    }));
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    checkin: false,
    checkout: false,
    foodStart: false,
    foodEnd: false,
    travel: false
  });

  return (
    <SafeAreaView className="h-full bg-white" edges={['right', 'top', 'left']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <PageHeader title="Guest Booking Details" icon={icons.backArrow} />

          {booking === types.ROOM_DETAILS_TYPE && (
            <GuestRoomBookingDetails containerStyles={'mt-6'} />
          )}
          {booking === types.ADHYAYAN_DETAILS_TYPE && (
            <GuestAdhyayanBookingDetails containerStyles={'mt-6'} />
          )}

          <View className="w-full px-4">
            <Text className="text-xl font-psemibold text-secondary mt-4 mb-2">
              Add Ons
            </Text>

            {/* GUEST ROOM BOOKING COMPONENT */}
            {booking !== types.ROOM_DETAILS_TYPE && (
              <GuestRoomAddon
                roomForm={roomForm}
                setRoomForm={setRoomForm}
                addRoomForm={addRoomForm}
                reomveRoomForm={reomveRoomForm}
                updateRoomForm={updateRoomForm}
                INITIAL_ROOM_FORM={INITIAL_ROOM_FORM}
                guest_dropdown={guest_dropdown}
                isDatePickerVisible={isDatePickerVisible}
                setDatePickerVisibility={setDatePickerVisibility}
              />
            )}

            {/* GUEST FOOD BOOKING COMPONENT */}
            <GuestFoodAddon
              foodForm={foodForm}
              setFoodForm={setFoodForm}
              addFoodForm={addFoodForm}
              reomveFoodForm={reomveFoodForm}
              updateFoodForm={updateFoodForm}
              INITIAL_FOOD_FORM={INITIAL_FOOD_FORM}
              guest_dropdown={guest_dropdown}
              isDatePickerVisible={isDatePickerVisible}
              setDatePickerVisibility={setDatePickerVisibility}
            />

            {/* GUEST ADHYAYAN BOOKING COMPONENT */}
            {booking !== types.ADHYAYAN_DETAILS_TYPE && (
              <GuestAdhyayanAddon
                adhyayanForm={adhyayanForm}
                setAdhyayanForm={setAdhyayanForm}
                updateAdhyayanForm={updateAdhyayanForm}
                INITIAL_ADHYAYAN_FORM={INITIAL_ADHYAYAN_FORM}
                guest_dropdown={guest_dropdown}
              />
            )}

            <CustomButton
              text="Confirm"
              handlePress={() => {}}
              containerStyles="mb-8 min-h-[62px]"
              // isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default guestAddons;
