import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, types } from '../../constants';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import { ScrollView } from 'react-native-gesture-handler';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import PageHeader from '../../components/PageHeader';
import CustomButton from '../../components/CustomButton';
import MumukshuRoomBookingDetails from '../../components/booking details cards/MumukshuRoomBookingDetails';
import MumukshuAdhyayanBookingDetails from '../../components/booking details cards/MumukshuAdhyayanBookingDetails';
import MumukshuTravelBookingDetails from '../../components/booking details cards/MumukshuTravelBookingDetails';
import MumukshuRoomAddon from '../../components/booking addons/MumukshuRoomAddon';
import MumukshuFoodAddon from '../../components/booking addons/MumukshuFoodAddon';
import MumukshuAdhyayanAddon from '../../components/booking addons/MumukshuAdhyayanAddon';
import MumukshuTravelAddon from '../../components/booking addons/MumukshuTravelAddon';
import Toast from 'react-native-toast-message';

const INITIAL_ROOM_FORM = {
  startDay: '',
  endDay: '',
  mumukshuGroup: [
    { roomType: '', floorType: '', mumukshus: [], mumukshuIndices: [] }
  ]
};

const INITIAL_FOOD_FORM = {
  startDay: '',
  endDay: '',
  mumukshuGroup: [
    {
      meals: [],
      spicy: '',
      hightea: 'NONE',
      mumukshus: [],
      mumukshuIndices: []
    }
  ]
};

const INITIAL_ADHYAYAN_FORM = {
  adhyayan: {},
  mumukshus: [],
  mumukshuIndices: []
};

const INITIAL_TRAVEL_FORM = {
  date: '',
  mumukshuGroup: [
    {
      pickup: '',
      drop: '',
      luggage: '',
      type: 'regular',
      special_request: '',
      mumukshus: [],
      mumukshuIndices: []
    }
  ]
};

const MumukshuAddons = () => {
  const router = useRouter();

  const { booking } = useLocalSearchParams();
  const { mumukshuData, setMumukshuData } = useGlobalContext();

  const mumukshus =
    mumukshuData.room?.mumukshuGroup?.flatMap((group) => group.mumukshus) ||
    mumukshuData.adhyayan?.mumukshuGroup;
  const mumukshu_dropdown = mumukshus.map((mumukshu, index) => ({
    value: index,
    label: mumukshu
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    checkin: false,
    checkout: false,
    foodStart: false,
    foodEnd: false,
    travel: false
  });

  // Room Addon Form Data
  const [roomForm, setRoomForm] = useState(INITIAL_ROOM_FORM);
  const addRoomForm = () => {
    setRoomForm((prevRoomForm) => ({
      ...prevRoomForm,
      mumukshuGroup: [
        ...prevRoomForm.mumukshuGroup,
        { roomType: '', floorType: '', mumukshus: [], mumukshuIndices: [] }
      ]
    }));
  };

  const reomveRoomForm = (indexToRemove) => {
    return () => {
      setRoomForm((prevRoomForm) => {
        const updatedMumukshuGroup = [...prevRoomForm.mumukshuGroup];
        updatedMumukshuGroup.splice(indexToRemove, 1);
        return {
          ...prevRoomForm,
          mumukshuGroup: updatedMumukshuGroup
        };
      });
    };
  };

  const updateRoomForm = (groupIndex, key, value) => {
    setRoomForm((prevRoomForm) => {
      const updatedMumukshuGroup = [...prevRoomForm.mumukshuGroup];

      if (key === 'mumukshus') {
        updatedMumukshuGroup[groupIndex].mumukshuIndices = value;
        updatedMumukshuGroup[groupIndex].mumukshus = mumukshus.filter((_, i) =>
          value.includes(i)
        );
      } else {
        updatedMumukshuGroup[groupIndex][key] = value;
      }

      return {
        ...prevRoomForm,
        mumukshuGroup: updatedMumukshuGroup
      };
    });
  };

  // Food Addon Form Data
  const [foodForm, setFoodForm] = useState(INITIAL_FOOD_FORM);
  const resetFoodForm = () => {
    setFoodForm(INITIAL_FOOD_FORM);
    setMumukshuData((prev) => {
      const { food, ...rest } = prev;
      return rest;
    });
  };

  const addFoodForm = () => {
    setFoodForm((prevFoodForm) => ({
      ...prevFoodForm,
      mumukshuGroup: [
        ...prevFoodForm.mumukshuGroup,
        {
          meals: [],
          spicy: '',
          hightea: 'NONE',
          mumukshus: [],
          mumukshuIndices: []
        }
      ]
    }));
  };

  const reomveFoodForm = (indexToRemove) => {
    return () => {
      setFoodForm((prevFoodForm) => {
        const updatedMumukshuGroup = [...prevFoodForm.mumukshuGroup];
        updatedMumukshuGroup.splice(indexToRemove, 1);
        return {
          ...prevFoodForm,
          mumukshuGroup: updatedMumukshuGroup
        };
      });
    };
  };

  const updateFoodForm = (groupIndex, key, value) => {
    setFoodForm((prevFoodForm) => {
      const updatedMumukshuGroup = [...prevFoodForm.mumukshuGroup];

      if (key === 'mumukshus') {
        updatedMumukshuGroup[groupIndex].mumukshuIndices = value;
        updatedMumukshuGroup[groupIndex].mumukshus = mumukshus.filter((_, i) =>
          value.includes(i)
        );
      } else {
        updatedMumukshuGroup[groupIndex][key] = value;
      }

      return {
        ...prevFoodForm,
        mumukshuGroup: updatedMumukshuGroup
      };
    });
  };

  // Travel Booking Form Data
  const [travelForm, setTravelForm] = useState(INITIAL_TRAVEL_FORM);
  const resetTravelForm = () => {
    setTravelForm(INITIAL_TRAVEL_FORM);
    setMumukshuData((prev) => {
      const { travel, ...rest } = prev;
      return rest;
    });
  };

  const addTravelForm = () => {
    setTravelForm((prevTravelForm) => ({
      ...prevTravelForm,
      mumukshuGroup: [
        ...prevTravelForm.mumukshuGroup,
        {
          pickup: '',
          drop: '',
          luggage: '',
          type: 'regular',
          special_request: '',
          mumukshus: [],
          mumukshuIndices: []
        }
      ]
    }));
  };

  const reomveTravelForm = (indexToRemove) => {
    return () => {
      setTravelForm((prevTravelForm) => {
        const updatedMumukshuGroup = [...prevTravelForm.mumukshuGroup];
        updatedMumukshuGroup.splice(indexToRemove, 1);
        return {
          ...prevTravelForm,
          mumukshuGroup: updatedMumukshuGroup
        };
      });
    };
  };

  const updateTravelForm = (groupIndex, key, value) => {
    setTravelForm((prevTravelForm) => {
      const updatedMumukshuGroup = [...prevTravelForm.mumukshuGroup];

      if (key === 'mumukshus') {
        updatedMumukshuGroup[groupIndex].mumukshuIndices = value;
        updatedMumukshuGroup[groupIndex].mumukshus = mumukshus.filter((_, i) =>
          value.includes(i)
        );
      } else {
        updatedMumukshuGroup[groupIndex][key] = value;
      }

      return {
        ...prevTravelForm,
        mumukshuGroup: updatedMumukshuGroup
      };
    });
  };

  // Adhyayan Booking Form Data
  const [adhyayanForm, setAdhyayanForm] = useState(INITIAL_ADHYAYAN_FORM);
  const updateAdhyayanForm = (field, value) => {
    setAdhyayanForm((prevAdhyayanForm) => ({
      ...prevAdhyayanForm,
      [field]: value,
      ...(field === 'mumukshuIndices' && {
        mumukshus: mumukshus.filter((_, i) => value.includes(i))
      })
    }));
  };

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
          <PageHeader title="Booking Details" icon={icons.backArrow} />

          {booking === types.ROOM_DETAILS_TYPE && (
            <MumukshuRoomBookingDetails containerStyles={'mt-6'} />
          )}
          {booking === types.ADHYAYAN_DETAILS_TYPE && (
            <MumukshuAdhyayanBookingDetails containerStyles={'mt-6'} />
          )}
          {booking === types.TRAVEL_DETAILS_TYPE && (
            <MumukshuTravelBookingDetails containerStyles={'mt-6'} />
          )}

          <View className="w-full px-4">
            <Text className="text-xl font-psemibold text-secondary mt-4 mb-2">
              Add Ons
            </Text>

            {/* MUMUKSHU ROOM BOOKING COMPONENT */}
            {booking !== types.ROOM_DETAILS_TYPE && (
              <MumukshuRoomAddon
                roomForm={roomForm}
                setRoomForm={setRoomForm}
                addRoomForm={addRoomForm}
                reomveRoomForm={reomveRoomForm}
                updateRoomForm={updateRoomForm}
                INITIAL_ROOM_FORM={INITIAL_ROOM_FORM}
                mumukshu_dropdown={mumukshu_dropdown}
                isDatePickerVisible={isDatePickerVisible}
                setDatePickerVisibility={setDatePickerVisibility}
              />
            )}

            {/* MUMUKSHU FOOD BOOKING COMPONENT */}
            <MumukshuFoodAddon
              foodForm={foodForm}
              setFoodForm={setFoodForm}
              addFoodForm={addFoodForm}
              resetFoodForm={resetFoodForm}
              reomveFoodForm={reomveFoodForm}
              updateFoodForm={updateFoodForm}
              mumukshu_dropdown={mumukshu_dropdown}
              isDatePickerVisible={isDatePickerVisible}
              setDatePickerVisibility={setDatePickerVisibility}
            />

            {/* MUMUKSHU ADHYAYAN BOOKING COMPONENT */}
            {booking !== types.ADHYAYAN_DETAILS_TYPE && (
              <MumukshuAdhyayanAddon
                adhyayanForm={adhyayanForm}
                setAdhyayanForm={setAdhyayanForm}
                updateAdhyayanForm={updateAdhyayanForm}
                INITIAL_ADHYAYAN_FORM={INITIAL_ADHYAYAN_FORM}
                mumukshu_dropdown={mumukshu_dropdown}
              />
            )}

            {/* MUMUKSHU TRAVEL BOOKING COMPONENT */}
            {booking !== types.TRAVEL_DETAILS_TYPE && (
              <MumukshuTravelAddon
                travelForm={travelForm}
                setTravelForm={setTravelForm}
                addTravelForm={addTravelForm}
                updateTravelForm={updateTravelForm}
                resetTravelForm={resetTravelForm}
                removeTravelForm={reomveTravelForm}
                mumukshu_dropdown={mumukshu_dropdown}
                isDatePickerVisible={isDatePickerVisible}
                setDatePickerVisibility={setDatePickerVisibility}
              />
            )}

            <CustomButton
              text="Confirm"
              handlePress={() => {
                setIsSubmitting(true);

                const isRoomFormEmpty = () => {
                  return roomForm.mumukshuGroup.some(
                    (group) =>
                      group.roomType !== '' ||
                      group.floorType !== '' ||
                      group.mumukshus.length > 0
                  );
                };

                const isFoodFormEmpty = () => {
                  return foodForm.mumukshuGroup.some(
                    (group) =>
                      group.meals.length > 0 ||
                      group.spicy !== '' ||
                      group.mumukshus.length > 0
                  );
                };

                const isAdhyayanFormEmpty = () => {
                  return (
                    Object.keys(adhyayanForm.adhyayan).length > 0 ||
                    adhyayanForm.mumukshus.length > 0
                  );
                };

                const isTravelFormEmpty = () => {
                  return travelForm.mumukshuGroup.some(
                    (group) =>
                      group.pickup !== '' ||
                      group.drop !== '' ||
                      group.luggage !== '' ||
                      group.mumukshus.length === 0
                  );
                };

                // Validate and set Room Form data
                if (booking !== types.ROOM_DETAILS_TYPE && isRoomFormEmpty()) {
                  const hasEmptyFields = roomForm.mumukshuGroup.some(
                    (group) =>
                      !group.roomType ||
                      !group.floorType ||
                      group.mumukshus.length === 0
                  );

                  if (
                    hasEmptyFields ||
                    !roomForm.startDay ||
                    !roomForm.endDay
                  ) {
                    Toast.show({
                      type: 'error',
                      text1: 'Please fill all the room booking fields',
                      text2: ''
                    });
                    setIsSubmitting(false);
                    return;
                  }
                  setMumukshuData((prev) => ({ ...prev, room: roomForm }));
                }

                // Validate and set Food Form data
                if (
                  isFoodFormEmpty() &&
                  JSON.stringify(foodForm) !== JSON.stringify(INITIAL_FOOD_FORM)
                ) {
                  const hasEmptyFields = foodForm.mumukshuGroup.some(
                    (group) => {
                      return (
                        group.meals.length === 0 ||
                        group.mumukshus.length === 0 ||
                        group.spicy === ''
                      );
                    }
                  );

                  if (
                    hasEmptyFields ||
                    !foodForm.startDay ||
                    !foodForm.endDay
                  ) {
                    Toast.show({
                      type: 'error',
                      text1: 'Please fill all the food booking fields',
                      text2: ''
                    });
                    setIsSubmitting(false);
                    return;
                  }
                  setMumukshuData((prev) => ({ ...prev, food: foodForm }));
                }

                // Validate and set Adhyayan Form data
                if (
                  booking !== types.ADHYAYAN_DETAILS_TYPE &&
                  isAdhyayanFormEmpty()
                ) {
                  if (
                    Object.keys(adhyayanForm.adhyayan).length === 0 ||
                    adhyayanForm.mumukshus.length === 0
                  ) {
                    Toast.show({
                      type: 'error',
                      text1: 'Please fill all the adhyayan booking fields',
                      text2: ''
                    });
                    setIsSubmitting(false);
                    return;
                  }
                  setMumukshuData((prev) => ({
                    ...prev,
                    adhyayan: adhyayanForm
                  }));
                }

                // Validate and set Travel Form data
                if (
                  booking !== types.TRAVEL_DETAILS_TYPE &&
                  isTravelFormEmpty() &&
                  JSON.stringify(travelForm) !==
                    JSON.stringify(INITIAL_TRAVEL_FORM)
                ) {
                  const hasEmptyFields = travelForm.mumukshuGroup.some(
                    (group) =>
                      group.pickup == '' ||
                      group.drop == '' ||
                      group.luggage == '' ||
                      group.mumukshus.length == 0
                  );

                  if (hasEmptyFields || !travelForm.date) {
                    Toast.show({
                      type: 'error',
                      text1: 'Please fill all travel the fields'
                    });
                    setIsSubmitting(false);
                    return;
                  }

                  setMumukshuData((prev) => ({ ...prev, travel: travelForm }));
                }
                setIsSubmitting(false);
                router.push('/mumukshuBooking/mumukshuBookingConfirmation');
              }}
              containerStyles="mb-8 min-h-[62px]"
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MumukshuAddons;
