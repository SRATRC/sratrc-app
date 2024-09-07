import {
  View,
  Text,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, icons, types } from '../../constants';
import AddonItem from '../../components/AddonItem';
import CustomDropdown from '../../components/CustomDropdown';
import CustomMultiSelectDropdown from '../../components/CustomMultiSelectDropdown';
import CustomButton from '../../components/CustomButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FormDisplayField from '../../components/FormDisplayField';
import FormField from '../../components/FormField';
import moment from 'moment';
import handleAPICall from '../../utils/HandleApiCall';
import RoomBookingDetails from '../../components/booking details cards/RoomBookingDetails';
import PageHeader from '../../components/PageHeader';
import TravelBookingDetails from '../../components/booking details cards/TravelBookingDetails';
import AdhyayanBookingDetails from '../../components/booking details cards/AdhyayanBookingDetails';
import HorizontalSeparator from '../../components/HorizontalSeparator';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import { useQuery } from '@tanstack/react-query';

// FOOD CONSTANTS
const FOOD_TYPE_LIST = [
  { key: 'breakfast', value: 'breakfast' },
  { key: 'lunch', value: 'lunch' },
  { key: 'dinner', value: 'dinner' }
];

const SPICE_LIST = [
  { key: 'Regular', value: 'Regular' },
  { key: 'Non Spicy', value: 'Non Spicy' }
];

const HIGHTEA_LIST = [
  { key: 'TEA', value: 'Tea' },
  { key: 'COFFEE', value: 'Coffee' },
  { key: 'NONE', value: 'None' }
];

// ROOM CONSTANTS
const ROOM_TYPE_LIST = [
  { key: 'ac', value: 'AC' },
  { key: 'nac', value: 'Non AC' }
];

const FLOOR_TYPE_LIST = [
  { key: 'SC', value: 'Yes' },
  { key: 'n', value: 'No' }
];

// TRAVEL CONSTANTS
const LOCATION_LIST = [
  { key: 'rc', value: 'RC' },
  { key: 'dadar', value: 'Dadar - Swaminarayan Temple' },
  { key: 'amar mahar', value: 'Amar Mahal - Chembur/Ghatkopar' },
  { key: 'mullund', value: 'Mullund Airoli Junction' },
  { key: 'airport t1', value: 'Airport Terminal 1' },
  { key: 'airport t2', value: 'Airport Terminal 2' },
  { key: 'ltt', value: 'Lokmanya Tilak Terminus Station (LTT)' },
  { key: 'cstm', value: 'Chatrapati Shivaji Terminus Station (CSTM)' },
  { key: 'vile parle', value: 'Vile Parle East' },
  { key: 'borivali', value: 'Borivali East' },
  { key: 'full', value: 'Full Car Booking' },
  { key: 'other', value: 'Other' }
];

const LUGGAGE_LIST = [
  { key: 'cabin1', value: '1 Cabin Bag' },
  { key: 'cabin2', value: '2 Cabin Bags' },
  { key: 'suitcase1', value: '1 Suitcase' },
  { key: 'suitcase2', value: '2 Suitcases' },
  { key: 'none', value: 'NONE' }
];

const details = () => {
  const { booking } = useLocalSearchParams();
  const { data, setData } = useGlobalContext();

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
    special_request: ''
  });

  // ADHYAYAN BOOKING VARIABLES
  const [adhyayanBookingList, setAdhyayanBookingList] = useState([]);

  const fetchAdhyayans = async () => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/adhyayan/getrange',
        {
          cardno: user.cardno,
          start_date:
            booking == types.ROOM_DETAILS_TYPE
              ? data.room.startDay
              : data.travel.date,
          end_date: booking == types.ROOM_DETAILS_TYPE ? data.room.endDay : ''
        },
        null,
        (res) => {
          resolve(Array.isArray(res.data) ? res.data : []);
        },
        () => reject(new Error('Failed to fetch rooms'))
      );
    });
  };

  const {
    isLoading,
    isError,
    data: adhyayanList
  } = useQuery({
    queryKey: ['adhyayans', booking, data.room?.startDay, data.travel?.date],
    queryFn: fetchAdhyayans,
    staleTime: 1000 * 60 * 30
  });

  const renderItem = ({ item }) => {
    const isSelected = adhyayanBookingList.some(
      (selected) => selected.id === item.id
    );

    return (
      <View className="w-full bg-gray-50 rounded-2xl p-2 mb-2">
        <View className="flex flex-row justify-between items-center py-2">
          <Text className="font-pmedium text-base text-secondary">{`${moment(
            item.start_date
          ).format('Do MMMM')} - ${moment(item.end_date).format(
            'Do MMMM, YYYY'
          )}`}</Text>
        </View>
        <HorizontalSeparator />
        <View className="flex pt-2 pb-4 flex-row space-x-2">
          <Image
            source={icons.description}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Name: </Text>
          <Text className="text-black font-pmedium" numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        <View className="flex pb-4 flex-row space-x-2">
          <Image
            source={icons.person}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Swadhyay Karta: </Text>
          <Text className="text-black font-pmedium" numberOfLines={1}>
            {item.speaker}
          </Text>
        </View>
        <View className="flex flex-row space-x-2">
          <Image
            source={icons.charge}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Charges:</Text>
          <Text className="text-black font-pmedium">₹ {item.amount}</Text>
        </View>
        <TouchableOpacity
          className={`border border-secondary rounded-lg w-full p-2 mt-4 justify-center items-center ${
            isSelected ? 'bg-secondary' : ''
          }`}
          onPress={() => {
            const prevSelectedItems = [...adhyayanBookingList];
            const isSelected = prevSelectedItems.some(
              (selected) => selected.id === item.id
            );
            if (isSelected) {
              const filteredList = prevSelectedItems.filter(
                (selected) => selected.id !== item.id
              );
              setAdhyayanBookingList(filteredList);
              if (filteredList.length === 0) {
                setData((prev) => {
                  const { adhyayan, ...rest } = prev;
                  return rest;
                });
              }
            } else {
              setAdhyayanBookingList([...prevSelectedItems, item]);
            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text
            className={`font-pmedium text-md ${
              isSelected ? 'text-white' : 'text-secondary-100'
            }`}
          >
            {isSelected ? 'Unregister' : 'Register'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFooter = () => (
    <View className="items-center justify-center w-full">
      {isLoading && <ActivityIndicator />}
      {isError && (
        <Text>
          Error fetching data: {error.message} {console.log(error.message)}
        </Text>
      )}
    </View>
  );

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
              <AddonItem
                onCollapse={() => {
                  setRoomForm({
                    roomType: '',
                    floorType: '',
                    startDay: '',
                    endDay: ''
                  });
                  setData((prev) => {
                    const { room, ...rest } = prev;
                    return rest;
                  });
                }}
                visibleContent={
                  <View className="flex flex-row items-center space-x-4">
                    <Image
                      source={icons.room}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="font-pmedium">Raj Sharan Booking</Text>
                  </View>
                }
                containerStyles={'mt-3'}
              >
                <TouchableOpacity
                  onPress={() =>
                    setDatePickerVisibility({
                      ...isDatePickerVisible,
                      checkin: true
                    })
                  }
                >
                  <FormDisplayField
                    text="Checkin Date"
                    value={
                      roomForm.startDay ? roomForm.startDay : 'Checkin Date'
                    }
                    otherStyles="mt-5"
                    backgroundColor="bg-gray-100"
                  />
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible.checkin}
                  mode="date"
                  onConfirm={(date) => {
                    setRoomForm({
                      ...roomForm,
                      startDay:
                        moment(date) < moment().add(1, 'days').toDate()
                          ? moment().add(1, 'days').format('YYYY-MM-DD')
                          : moment(date).format('YYYY-MM-DD')
                    });
                    setDatePickerVisibility({
                      ...isDatePickerVisible,
                      checkin: false
                    });
                  }}
                  onCancel={() =>
                    setDatePickerVisibility({
                      ...isDatePickerVisible,
                      checkin: false
                    })
                  }
                  minimumDate={moment().add(1, 'days').toDate()}
                />

                <TouchableOpacity
                  disabled={roomForm.startDay == ''}
                  onPress={() =>
                    setDatePickerVisibility({
                      ...isDatePickerVisible,
                      checkout: true
                    })
                  }
                >
                  <FormDisplayField
                    text="Checkout Date"
                    value={roomForm.endDay ? roomForm.endDay : 'Checkout Date'}
                    otherStyles="mt-5"
                    backgroundColor="bg-gray-100"
                  />
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible.checkout}
                  mode="date"
                  onConfirm={(date) => {
                    if (moment(date) <= moment(roomForm.startDay)) {
                      Alert.alert(
                        'Error',
                        'Checkout date should be after checkin date'
                      );
                    } else {
                      setRoomForm({
                        ...roomForm,
                        endDay:
                          moment(date) < moment().add(1, 'days').toDate()
                            ? moment().add(1, 'days').format('YYYY-MM-DD')
                            : moment(date).format('YYYY-MM-DD')
                      });
                      setDatePickerVisibility({
                        ...isDatePickerVisible,
                        checkout: false
                      });
                    }
                  }}
                  onCancel={() =>
                    setDatePickerVisibility({
                      ...isDatePickerVisible,
                      checkout: false
                    })
                  }
                  minimumDate={moment().add(1, 'days').toDate()}
                />

                <CustomDropdown
                  otherStyles="mt-7"
                  text={'Room Type'}
                  placeholder={'Select Room Type'}
                  data={ROOM_TYPE_LIST}
                  setSelected={(val) =>
                    setRoomForm({ ...roomForm, roomType: val })
                  }
                />

                <CustomDropdown
                  otherStyles="mt-7"
                  text={'Book Only if Ground Floor is Available'}
                  placeholder={'Select Floor Type'}
                  data={FLOOR_TYPE_LIST}
                  setSelected={(val) =>
                    setRoomForm({ ...roomForm, floorType: val })
                  }
                />
              </AddonItem>
            )}

            {/* FOOD BOOKING COMPONENT */}
            <AddonItem
              onCollapse={() => {
                setFoodForm({
                  startDay: '',
                  endDay: '',
                  spicy: '',
                  hightea: 'NONE'
                });
                setMeals([]);

                setData((prev) => {
                  const { food, ...rest } = prev;
                  return rest;
                });
              }}
              visibleContent={
                <View className="flex flex-row items-center space-x-4">
                  <Image
                    source={icons.food}
                    className="w-10 h-10"
                    resizeMode="contain"
                  />
                  <Text className="font-pmedium">Raj Prasad Booking</Text>
                </View>
              }
              containerStyles={'mt-3'}
            >
              <TouchableOpacity
                onPress={() =>
                  setDatePickerVisibility({
                    ...isDatePickerVisible,
                    foodStart: true
                  })
                }
              >
                <FormDisplayField
                  text="Start Date"
                  value={foodForm.startDay ? foodForm.startDay : 'Start Date'}
                  otherStyles="mt-5"
                  backgroundColor="bg-gray-100"
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible.foodStart}
                mode="date"
                onConfirm={(date) => {
                  setFoodForm({
                    ...foodForm,
                    startDay:
                      moment(date) < moment().add(1, 'days').toDate()
                        ? moment().add(1, 'days').format('YYYY-MM-DD')
                        : moment(date).format('YYYY-MM-DD')
                  });
                  setDatePickerVisibility({
                    ...isDatePickerVisible,
                    foodStart: false
                  });
                }}
                onCancel={() =>
                  setDatePickerVisibility({
                    ...isDatePickerVisible,
                    foodStart: false
                  })
                }
                minimumDate={moment().add(1, 'days').toDate()}
              />

              <TouchableOpacity
                disabled={foodForm.startDay == ''}
                onPress={() =>
                  setDatePickerVisibility({
                    ...isDatePickerVisible,
                    foodEnd: true
                  })
                }
              >
                <FormDisplayField
                  text="End Date"
                  value={foodForm.endDay ? foodForm.endDay : 'End Date'}
                  otherStyles="mt-5"
                  backgroundColor="bg-gray-100"
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible.foodEnd}
                mode="date"
                onConfirm={(date) => {
                  setFoodForm({
                    ...foodForm,
                    endDay:
                      moment(date) < moment().add(1, 'days').toDate()
                        ? moment().add(1, 'days').format('YYYY-MM-DD')
                        : moment(date).format('YYYY-MM-DD')
                  });
                  setDatePickerVisibility({
                    ...isDatePickerVisible,
                    foodEnd: false
                  });
                }}
                onCancel={() =>
                  setDatePickerVisibility({
                    ...isDatePickerVisible,
                    foodEnd: false
                  })
                }
                minimumDate={moment().add(1, 'days').toDate()}
              />

              <CustomMultiSelectDropdown
                otherStyles="mt-5 w-full px-1"
                text={'Food Type'}
                placeholder={'Select Food Type'}
                data={FOOD_TYPE_LIST}
                setSelected={(val) => setMeals(val)}
              />

              <CustomDropdown
                otherStyles="mt-5 w-full px-1"
                text={'Spice Level'}
                placeholder={'How much spice do you want?'}
                data={SPICE_LIST}
                setSelected={(val) => setFoodForm({ ...foodForm, spicy: val })}
              />

              <CustomDropdown
                otherStyles="mt-5 w-full px-1"
                text={'Hightea'}
                placeholder={'Hightea'}
                data={HIGHTEA_LIST}
                defaultOption={{ key: 'NONE', value: 'None' }}
                setSelected={(val) =>
                  setFoodForm({ ...foodForm, hightea: val })
                }
              />
            </AddonItem>

            {/* ADHYAYAN BOOKING COMPONENT */}
            {booking !== types.ADHYAYAN_DETAILS_TYPE && (
              <AddonItem
                onCollapse={() => {
                  setAdhyayanBookingList([]);
                  setData((prev) => {
                    const { adhyayan, ...rest } = prev;
                    return rest;
                  });
                }}
                visibleContent={
                  <View className="flex flex-row items-center space-x-4">
                    <Image
                      source={icons.adhyayan}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="font-pmedium">Raj Adhyayan Booking</Text>
                  </View>
                }
                containerStyles={'mt-3'}
              >
                {!isLoading && !isError && adhyayanList.length == 0 && (
                  <View className="flex flex-col items-center justify-center">
                    <LottieView
                      style={{
                        width: 200,
                        height: 200
                      }}
                      autoPlay
                      loop
                      source={require('../../assets/lottie/notFound.json')}
                    />
                    <Text className="text-md font-psemibold text-secondary">
                      No adhyayans available in selected dates!
                    </Text>
                  </View>
                )}
                <ScrollView
                  horizontal={true}
                  className="w-full"
                  scrollEnabled={false}
                >
                  <FlatList
                    className="py-2 mt-2 flex-grow-1 w-full"
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    data={adhyayanList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    ListFooterComponent={renderFooter}
                    scrollEnabled={false}
                  />
                </ScrollView>
              </AddonItem>
            )}

            {/* TRAVEL BOOKING COMPONENT */}
            {booking !== types.TRAVEL_DETAILS_TYPE && (
              <AddonItem
                onCollapse={() => {
                  setTravelForm({
                    date: '',
                    pickup: '',
                    drop: '',
                    luggage: '',
                    special_request: ''
                  });
                  setData((prev) => {
                    const { travel, ...rest } = prev;
                    return rest;
                  });
                }}
                visibleContent={
                  <View className="flex flex-row items-center space-x-4">
                    <Image
                      source={icons.travel}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="font-pmedium">Raj Pravas Booking</Text>
                  </View>
                }
                containerStyles={'mt-3'}
              >
                <TouchableOpacity
                  onPress={() =>
                    setDatePickerVisibility({
                      ...isDatePickerVisible,
                      travel: true
                    })
                  }
                >
                  <FormDisplayField
                    text="Date"
                    value={travelForm.date ? travelForm.date : 'Travel Date'}
                    otherStyles="mt-7"
                    backgroundColor="bg-gray-100"
                  />
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible.travel}
                  mode="date"
                  onConfirm={(date) => {
                    setTravelForm({
                      ...travelForm,
                      date:
                        moment(date) < moment().add(1, 'days').toDate()
                          ? moment().add(1, 'days').format('YYYY-MM-DD')
                          : moment(date).format('YYYY-MM-DD')
                    });
                    setDatePickerVisibility({
                      ...isDatePickerVisible,
                      travel: false
                    });
                  }}
                  onCancel={() =>
                    setDatePickerVisibility({
                      ...isDatePickerVisible,
                      travel: false
                    })
                  }
                  minimumDate={moment().add(1, 'days').toDate()}
                />

                <CustomDropdown
                  otherStyles="mt-7"
                  text={'Pickup Location'}
                  placeholder={'Select Location'}
                  save={'value'}
                  data={LOCATION_LIST}
                  setSelected={(val) =>
                    setTravelForm({
                      ...travelForm,
                      pickup: val
                    })
                  }
                  boxbg={colors.gray_100}
                />

                <CustomDropdown
                  otherStyles="mt-7"
                  text={'Drop Location'}
                  placeholder={'Select Location'}
                  save={'value'}
                  data={LOCATION_LIST}
                  setSelected={(val) =>
                    setTravelForm({
                      ...travelForm,
                      drop: val
                    })
                  }
                  boxbg={colors.gray_100}
                />

                <CustomDropdown
                  otherStyles="mt-7"
                  text={'Luggage'}
                  placeholder={'Select any luggage'}
                  data={LUGGAGE_LIST}
                  save={'value'}
                  setSelected={(val) =>
                    setTravelForm({ ...travelForm, luggage: val })
                  }
                />

                <FormField
                  text="Any Special Request?"
                  value={travelForm.special_request}
                  handleChangeText={(e) =>
                    setTravelForm({
                      ...travelForm,
                      special_request: e
                    })
                  }
                  otherStyles="mt-7"
                  containerStyles="bg-gray-100"
                  keyboardType="default"
                  placeholder="please specify your request here..."
                />
              </AddonItem>
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
                  return Object.values(travelForm).some((value) => value != '');
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
