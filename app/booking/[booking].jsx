import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, types } from '../../constants';
import CustomButton from '../../components/CustomButton';
import PageHeader from '../../components/PageHeader';
import RoomBookingDetails from '../../components/booking details cards/RoomBookingDetails';
import TravelBookingDetails from '../../components/booking details cards/TravelBookingDetails';
import AdhyayanBookingDetails from '../../components/booking details cards/AdhyayanBookingDetails';
import RoomAddon from '../../components/booking addons/RoomAddon';
import FoodAddon from '../../components/booking addons/FoodAddon';
import AdhyayanAddon from '../../components/booking addons/AdhyayanAddon';
import TravelAddon from '../../components/booking addons/TravelAddon';

const details = () => {
  const { booking } = useLocalSearchParams();
  const { setData } = useGlobalContext();

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // FOOD BOOKING VAIABLESs
  const [foodForm, setFoodForm] = useState({
    startDay: '',
    endDay: '',
    spicy: '',
    hightea: 'NONE'
  });

  const [meals, setMeals] = useState([]);

  // ROOM BOOKING VARIABLES
  const [roomForm, setRoomForm] = useState({
    startDay: '',
    endDay: '',
    roomType: '',
    floorType: ''
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    checkin: false,
    checkout: false,
    foodStart: false,
    foodEnd: false,
    travel: false
  });

  // TRAVEL BOOKING VARIABLES
  const [travelForm, setTravelForm] = useState({
    date: '',
    pickup: '',
    drop: '',
    luggage: '',
    type: 'regular',
    special_request: ''
  });

  // ADHYAYAN BOOKING VARIABLES
  const [adhyayanBookingList, setAdhyayanBookingList] = useState([]);

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
            <RoomBookingDetails containerStyles={'mt-6'} />
          )}
          {booking === types.ADHYAYAN_DETAILS_TYPE && (
            <AdhyayanBookingDetails containerStyles={'mt-6'} />
          )}
          {booking === types.TRAVEL_DETAILS_TYPE && (
            <TravelBookingDetails containerStyles={'mt-6'} />
          )}

          <View className="w-full px-4">
            <Text className="text-xl font-psemibold text-secondary mt-4 mb-2">
              Add Ons
            </Text>

            {/* ROOM BOOKING COMPONENT */}
            {booking !== types.ROOM_DETAILS_TYPE && (
              <RoomAddon
                roomForm={roomForm}
                setRoomForm={setRoomForm}
                isDatePickerVisible={isDatePickerVisible}
                setDatePickerVisibility={setDatePickerVisibility}
              />
            )}

            {/* FOOD BOOKING COMPONENT */}
            <FoodAddon
              foodForm={foodForm}
              setFoodForm={setFoodForm}
              setMeals={setMeals}
              isDatePickerVisible={isDatePickerVisible}
              setDatePickerVisibility={setDatePickerVisibility}
            />

            {/* ADHYAYAN BOOKING COMPONENT */}
            {booking !== types.ADHYAYAN_DETAILS_TYPE && (
              <AdhyayanAddon
                adhyayanBookingList={adhyayanBookingList}
                setAdhyayanBookingList={setAdhyayanBookingList}
                booking={booking}
              />
            )}

            {/* TRAVEL BOOKING COMPONENT */}
            {booking !== types.TRAVEL_DETAILS_TYPE && (
              <TravelAddon
                travelForm={travelForm}
                setTravelForm={setTravelForm}
                isDatePickerVisible={isDatePickerVisible}
                setDatePickerVisibility={setDatePickerVisibility}
              />
            )}

            <CustomButton
              text="Confirm"
              handlePress={() => {
                setIsSubmitting(true);

                const isRoomFormEmpty = () => {
                  return Object.values(roomForm).some((value) => value != '');
                };

                const isFoodFormEmpty = () => {
                  const excludedKey = 'hightea';
                  return (
                    Object.entries(foodForm)
                      .filter(([key]) => key !== excludedKey)
                      .some(([_, value]) => value !== '') || meals.length !== 0
                  );
                };

                const isTravelFormEmpty = () => {
                  const excludedKey = 'type';
                  return Object.entries(travelForm)
                    .filter(([key]) => key !== excludedKey)
                    .some(([_, value]) => value !== '');
                };

                const isAdhyayanFormEmpty = () => {
                  return adhyayanBookingList.length != 0;
                };

                if (booking !== types.ROOM_DETAILS_TYPE && isRoomFormEmpty()) {
                  if (Object.values(roomForm).some((value) => value == '')) {
                    Alert.alert('Please fill all the fields');
                    setIsSubmitting(false);
                    return;
                  }
                  setData((prev) => ({ ...prev, room: roomForm }));
                }
                if (
                  booking !== types.ADHYAYAN_DETAILS_TYPE &&
                  adhyayanBookingList.length != 0
                ) {
                  setData((prev) => ({
                    ...prev,
                    adhyayan: adhyayanBookingList
                  }));
                }
                if (isFoodFormEmpty()) {
                  if (Object.values(foodForm).some((value) => value == '')) {
                    Alert.alert('Please fill all the fields');
                    setIsSubmitting(false);
                    return;
                  }
                  setData((prev) => ({
                    ...prev,
                    food: { ...foodForm, meals: meals }
                  }));
                }
                if (
                  booking !== types.TRAVEL_DETAILS_TYPE &&
                  isTravelFormEmpty()
                ) {
                  if (
                    travelForm.date == '' ||
                    travelForm.pickup == '' ||
                    travelForm.drop == '' ||
                    travelForm.luggage == ''
                  ) {
                    Alert.alert('Please fill all the fields');
                    setIsSubmitting(false);
                    return;
                  }
                  setData((prev) => ({ ...prev, travel: travelForm }));
                }

                if (
                  booking !== types.ADHYAYAN_DETAILS_TYPE &&
                  isAdhyayanFormEmpty()
                ) {
                  setData((prev) => ({
                    ...prev,
                    adhyayan: adhyayanBookingList
                  }));
                }

                setIsSubmitting(false);
                router.push('/booking/bookingConfirmation');
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

export default details;
