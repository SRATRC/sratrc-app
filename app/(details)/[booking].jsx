import {
  View,
  Text,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, icons, types } from '../../constants';
import ExpandableItem from '../../components/ExpandableItem';
import CustomDropdown from '../../components/CustomDropdown';
import CustomMultiSelectDropdown from '../../components/CustomMultiSelectDropdown';
import HorizontalSeparator from '../../components/HorizontalSeparator';
import CustomButton from '../../components/CustomButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FormDisplayField from '../../components/FormDisplayField';
import FormField from '../../components/FormField';
import moment from 'moment';
import prices from '../../constants/prices';

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
    hightea: ''
  });
  const [type, setType] = useState([]);

  const foodTypeList = [
    { key: 'breakfast', value: 'breakfast' },
    { key: 'lunch', value: 'lunch' },
    { key: 'dinner', value: 'dinner' }
  ];

  const spiceyList = [
    { key: 'Regular', value: 'Regular' },
    { key: 'Non Spicy', value: 'Non Spicy' }
  ];

  const highteaList = [
    { key: 'TEA', value: 'Tea' },
    { key: 'COFFEE', value: 'Coffee' },
    { key: 'NONE', value: 'None' }
  ];

  // ROOM BOOKING VARIABLES
  const [roomForm, setRoomForm] = useState({
    roomType: '',
    groundFloor: '',
    checkoutDate: ''
  });

  const roomTypeList = [
    { key: 'ac', value: 'AC' },
    { key: 'nac', value: 'Non AC' }
  ];

  const floorTypeList = [
    { key: 'SC', value: 'Yes' },
    { key: 'n', value: 'No' }
  ];

  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    room: false,
    pickup: false,
    drop: false
  });

  // TRAVEL BOOKING VARIABLES
  const [travelPickupForm, setTravelPickupForm] = useState({
    date: '',
    pickup: '',
    luggage: '',
    special_request: ''
  });

  const [travelDropForm, setTravelDropForm] = useState({
    date: '',
    drop: '',
    luggage: '',
    special_request: ''
  });

  const locationData = [
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

  const luggageList = [
    { key: 'cabin1', value: '1 Cabin Bag' },
    { key: 'cabin2', value: '2 Cabin Bags' },
    { key: 'suitcase1', value: '1 Suitcase' },
    { key: 'suitcase2', value: '2 Suitcases' },
    { key: 'none', value: 'NONE' }
  ];

  return (
    <SafeAreaView className="h-full bg-white" edges={['right', 'top', 'left']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full px-4 my-6 items-center">
            <Text className="text-2xl font-psemibold">Booking Details</Text>
          </View>

          {booking === types.ROOM_DETAILS_TYPE && (
            <RoomBookingPrimary data={data} setData={setData} />
          )}
          {booking === types.ADHYAYAN_DETAILS_TYPE && (
            <AdhyayanBookingPrimary data={data} />
          )}
          {booking === types.TRAVEL_DETAILS_TYPE && (
            <TravelBookingPrimary data={data} setData={setData} />
          )}

          <View className="w-full px-4">
            <Text className="text-xl font-psemibold text-secondary mt-4 mb-2">
              Add Ons
            </Text>

            {/* ROOM BOOKING COMPONENT */}
            {booking !== types.ROOM_DETAILS_TYPE && (
              <ExpandableItem
                item={{
                  icon: icons.room,
                  title: 'Raj Sharan Booking'
                }}
                containerStyles={'mt-3'}
              >
                <TouchableOpacity
                  onPress={() =>
                    setDatePickerVisibility({
                      ...isDatePickerVisible,
                      room: true
                    })
                  }
                >
                  <FormDisplayField
                    text="Checkout Date"
                    value={
                      roomForm.checkoutDate
                        ? roomForm.checkoutDate
                        : 'Checkout Date'
                    }
                    otherStyles="mt-7"
                    backgroundColor="bg-gray-100"
                  />
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible.room}
                  mode="date"
                  onConfirm={(date) => {
                    setRoomForm({
                      ...roomForm,
                      checkoutDate: moment(date).format('YYYY-MM-DD')
                    });
                    setDatePickerVisibility({
                      ...isDatePickerVisible,
                      room: false
                    });
                  }}
                  onCancel={() =>
                    setDatePickerVisibility({
                      ...isDatePickerVisible,
                      room: false
                    })
                  }
                />

                <CustomDropdown
                  otherStyles="mt-7"
                  text={'Room Type'}
                  placeholder={'Select Room Type'}
                  data={roomTypeList}
                  setSelected={(val) =>
                    setRoomForm({ ...roomForm, roomType: val })
                  }
                />

                <CustomDropdown
                  otherStyles="mt-7"
                  text={'Book Only if Ground Floor is Available'}
                  placeholder={'Select Floor Type'}
                  data={floorTypeList}
                  setSelected={(val) =>
                    setRoomForm({ ...roomForm, groundFloor: val })
                  }
                />
              </ExpandableItem>
            )}

            {/* FOOD BOOKING COMPONENT */}
            <ExpandableItem
              item={{
                icon: icons.food,
                title: 'Raj Prasad Booking'
              }}
              containerStyles={'mt-3'}
            >
              <CustomMultiSelectDropdown
                otherStyles="mt-5 w-full px-1"
                text={'Food Type'}
                placeholder={'Select Food Type'}
                data={foodTypeList}
                setSelected={(val) => setType(val)}
                type={type}
              />

              <CustomDropdown
                otherStyles="mt-5 w-full px-1"
                text={'Spice Level'}
                placeholder={'How much spice do you want?'}
                data={spiceyList}
                setSelected={(val) => setFoodForm({ ...foodForm, spicy: val })}
              />

              <CustomDropdown
                otherStyles="mt-5 w-full px-1"
                text={'Hightea'}
                placeholder={'Hightea'}
                data={highteaList}
                setSelected={(val) =>
                  setFoodForm({ ...foodForm, hightea: val })
                }
              />
            </ExpandableItem>

            {/* ADHYAYAN BOOKING COMPONENT */}
            {booking !== types.ADHYAYAN_DETAILS_TYPE && (
              <ExpandableItem
                item={{
                  icon: icons.adhyayan,
                  title: 'Raj Adhyayan Booking'
                }}
                containerStyles={'mt-3'}
              ></ExpandableItem>
            )}

            {/* TRAVEL BOOKING COMPONENT */}
            {booking !== types.TRAVEL_DETAILS_TYPE && (
              <View
                className={`mb-5 p-3 bg-white rounded-2xl ${
                  Platform.OS === 'ios'
                    ? 'shadow-lg shadow-gray-200'
                    : 'shadow-2xl shadow-gray-400'
                }`}
              >
                <View className="overflow-hidden flex-row justify-between">
                  <View className="flex flex-row items-center space-x-4">
                    <Image
                      source={icons.travel}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                    <Text className="font-pmedium">Raj Pravas Booking</Text>
                  </View>
                </View>
                <View className="mt-3">
                  {/* Mumbai to RC */}
                  <ExpandableItem
                    item={{
                      icon: icons.yellowArrowUp,
                      title: 'Mumbai to Research Centre'
                    }}
                    containerStyles={'mt-3'}
                    backgroundColor="bg-gray-100"
                    shadowShown={false}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        setDatePickerVisibility({
                          ...isDatePickerVisible,
                          pickup: true
                        })
                      }
                    >
                      <FormDisplayField
                        text="Date"
                        value={
                          travelPickupForm.date
                            ? travelPickupForm.date
                            : 'Travel Date'
                        }
                        otherStyles="mt-7"
                        backgroundColor="bg-zinc-100"
                      />
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible.pickup}
                      mode="date"
                      onConfirm={(date) => {
                        setTravelPickupForm({
                          ...travelPickupForm,
                          date: moment(date).format('YYYY-MM-DD')
                        });
                        setDatePickerVisibility({
                          ...isDatePickerVisible,
                          pickup: false
                        });
                      }}
                      onCancel={() =>
                        setDatePickerVisibility({
                          ...isDatePickerVisible,
                          pickup: false
                        })
                      }
                    />

                    <CustomDropdown
                      otherStyles="mt-7"
                      text={'Pickup Location'}
                      placeholder={'Select Location'}
                      save={'value'}
                      data={locationData}
                      setSelected={(val) =>
                        setTravelPickupForm({
                          ...travelPickupForm,
                          pickup: val
                        })
                      }
                      boxbg={colors.zinc_100}
                    />

                    <FormField
                      text="Any Special Request?"
                      value={travelPickupForm.special_request}
                      handleChangeText={(e) =>
                        setTravelPickupForm({
                          ...travelPickupForm,
                          special_request: e
                        })
                      }
                      otherStyles="mt-7"
                      containerStyles="bg-zinc-100"
                      keyboardType="default"
                      placeholder="please specify your request here..."
                    />
                  </ExpandableItem>

                  {/* RC to Mumbai */}
                  <ExpandableItem
                    item={{
                      icon: icons.yellowArrowDown,
                      title: 'Research Centre to Mumbai'
                    }}
                    containerStyles={'mt-3'}
                    backgroundColor="bg-gray-100"
                    shadowShown={false}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        setDatePickerVisibility({
                          ...isDatePickerVisible,
                          drop: true
                        })
                      }
                    >
                      <FormDisplayField
                        text="Date"
                        value={
                          travelDropForm.date
                            ? travelDropForm.date
                            : 'Travel Date'
                        }
                        otherStyles="mt-7"
                        backgroundColor="bg-zinc-100"
                      />
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible.drop}
                      mode="date"
                      onConfirm={(date) => {
                        setTravelDropForm({
                          ...travelDropForm,
                          date: moment(date).format('YYYY-MM-DD')
                        });
                        setDatePickerVisibility({
                          ...isDatePickerVisible,
                          drop: false
                        });
                      }}
                      onCancel={() =>
                        setDatePickerVisibility({
                          ...isDatePickerVisible,
                          drop: false
                        })
                      }
                    />

                    <CustomDropdown
                      otherStyles="mt-7"
                      text={'Pickup Location'}
                      placeholder={'Select Location'}
                      save={'value'}
                      data={locationData}
                      setSelected={(val) =>
                        setTravelDropForm({ ...travelDropForm, pickup: val })
                      }
                      boxbg={colors.zinc_100}
                    />

                    <FormField
                      text="Any Special Request?"
                      value={travelDropForm.special_request}
                      handleChangeText={(e) =>
                        setTravelDropForm({
                          ...travelDropForm,
                          special_request: e
                        })
                      }
                      otherStyles="mt-7"
                      containerStyles="bg-zinc-100"
                      keyboardType="default"
                      placeholder="please specify your request here..."
                    />
                  </ExpandableItem>
                </View>
              </View>
            )}

            <CustomButton
              text="Confirm"
              handlePress={() => {
                router.push('/bookingConfirmation');
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

const RoomBookingPrimary = ({ data, setData }) => {
  const formattedStartDate = moment(data.room.startDay).format('Do MMMM');
  const formattedEndDate = moment(data.room.endDay).format('Do MMMM, YYYY');

  const charge =
    moment(data.room.endDay).diff(moment(data.room.startDay), 'days') *
    (data.room.roomType === 'ac'
      ? prices.AC_ROOM_PRICE
      : prices.NAC_ROOM_PRICE);

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      room: { ...prevData.room, charge }
    }));
  }, [data.room.startDay, data.room.endDay, data.room.roomType]);

  return (
    <View className="w-full px-4">
      <Text className="text-xl font-psemibold text-secondary">
        Raj Sharan Booking
      </Text>
      <View
        className={`flex flex-col bg-white rounded-2xl mt-4 ${
          Platform.OS === 'ios'
            ? 'shadow-lg shadow-gray-200'
            : 'shadow-2xl shadow-gray-400'
        }`}
      >
        <View className="flex p-4 flex-row items-center space-x-4">
          <Image
            source={icons.room}
            className="w-10 h-10"
            resizeMode="contain"
          />
          <View className="w-full flex-1">
            <Text className="font-pmedium text-md">
              {`${formattedStartDate} - ${formattedEndDate}`}
            </Text>
          </View>
        </View>

        <HorizontalSeparator otherStyles={'mb-4'} />

        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image source={icons.ac} className="w-4 h-4" resizeMode="contain" />
          <Text className="text-gray-400 font-pregular">Room Type: </Text>
          <Text className="text-black font-pmedium">
            {data.room.roomType === 'ac' ? 'AC ROOM' : 'Non AC ROOM'}
          </Text>
        </View>
        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.elder}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">
            Ground Floor Booking:
          </Text>
          <Text className="text-black font-pmedium">
            {data.room.floorType === 'SC' ? 'Ground Floor' : 'Any Floor'}
          </Text>
        </View>
        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.charge}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Charges:</Text>
          <Text className="text-black font-pmedium">₹ {charge}</Text>
        </View>
      </View>
    </View>
  );
};

const AdhyayanBookingPrimary = ({ data }) => {
  const formattedStartDate = moment(data.adhyayan.start_date).format('Do MMMM');
  const formattedEndDate = moment(data.adhyayan.end_date).format(
    'Do MMMM, YYYY'
  );

  return (
    <View className="w-full px-4">
      <Text className="text-xl font-psemibold text-secondary">
        Raj Adhyayan Booking
      </Text>
      <View
        className={`flex flex-col bg-white rounded-2xl mt-4 ${
          Platform.OS === 'ios'
            ? 'shadow-lg shadow-gray-200'
            : 'shadow-2xl shadow-gray-400'
        }`}
      >
        <View className="flex p-4 flex-row space-x-4">
          <Image
            source={icons.adhyayan}
            className="w-10 h-10"
            resizeMode="contain"
          />
          <View className="w-full flex-1">
            <View className="flex flex-row items-center space-x-2">
              <Text className="text-black font-psemibold">Name:</Text>
              <Text
                className="text-secondary font-pmedium flex-1"
                numberOfLines={1}
              >
                {data.adhyayan.name}
              </Text>
            </View>
            <Text className="font-pmedium text-gray-400">
              {`${formattedStartDate} - ${formattedEndDate}`}
            </Text>
          </View>
        </View>

        <HorizontalSeparator otherStyles={'mb-4'} />

        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.person}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Swadhyay Karta:</Text>
          <Text className="text-black font-pmedium">
            {data.adhyayan.speaker}
          </Text>
        </View>
        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.charge}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Charges:</Text>
          <Text className="text-black font-pmedium">
            ₹ {data.adhyayan.amount}
          </Text>
        </View>
      </View>
    </View>
  );
};

const TravelBookingPrimary = ({ data, setData }) => {
  const formattedDate = moment(data.travel.date).format('Do MMMM, YYYY');

  const charge = prices.TRAVEL_COST;

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      travel: { ...prevData.travel, charge }
    }));
  }, [data.travel.date]);

  return (
    <View className="w-full px-4">
      <Text className="text-xl font-psemibold text-secondary">
        Raj Pravas Booking
      </Text>
      <View
        className={`flex flex-col bg-white rounded-2xl mt-4 ${
          Platform.OS === 'ios'
            ? 'shadow-lg shadow-gray-200'
            : 'shadow-2xl shadow-gray-400'
        }`}
      >
        <View className="flex p-4 flex-row items-center space-x-4">
          <Image
            source={icons.travel}
            className="w-10 h-10"
            resizeMode="contain"
          />
          <View className="w-full flex-1">
            <Text className="font-pmedium text-md">{formattedDate}</Text>
          </View>
        </View>

        <HorizontalSeparator otherStyles={'mb-4'} />

        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.marker}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">
            {data.travel.pickup == 'RC' ? 'Drop Point' : 'Pickup Point'}
          </Text>
          <Text className="text-black font-pmedium flex-1" numberOfLines={1}>
            {data.travel.pickup == 'RC'
              ? `${data.travel.drop}`
              : `${data.travel.pickup}`}
          </Text>
        </View>
        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.luggage}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Luggage</Text>
          <Text className="text-black font-pmedium">{data.travel.luggage}</Text>
        </View>
        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.request}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Special Request:</Text>
          <Text className="text-black font-pmedium flex-1" numberOfLines={1}>
            {data.travel.special_request ? data.travel.special_request : 'None'}
          </Text>
        </View>
        <View className="flex px-6 pb-4 flex-row space-x-2">
          <Image
            source={icons.charge}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Charges:</Text>
          <Text className="text-black font-pmedium">
            ₹ {data.travel.charge}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default details;
