import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { types, colors } from '../../constants';
import MultiSwitch from 'react-native-multiple-switch';
import CustomChipGroup from '../../components/CustomChipGroup';
import CustomDropdown from '../../components/CustomDropdown';
import CustomButton from '../../components/CustomButton';
import CustomCalender from '../../components/CustomCalender';
import handleAPICall from '../../utils/HandleApiCall';
import { useGlobalContext } from '../../context/GlobalProvider';

const BookNow = () => {
  const [selectedChip, setSelectedChip] = useState(types.booking_type_room);
  const chips = [
    types.booking_type_room,
    types.booking_type_food,
    types.booking_type_travel
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
              <RoomBooking user={user} />
            )}
            {selectedChip === types.booking_type_food && <FormComponent2 />}
            {selectedChip === types.booking_type_travel && <FormComponent3 />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const RoomBooking = ({ user }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = ['Select Dates', 'One Day Visit'];
  const [value, setValue] = useState(items[0]);

  const [selectedDay, setSelectedDay] = useState();
  const [multiDayForm, setMultiDayForm] = useState({
    startDay: '',
    endDay: '',
    roomType: '',
    floorType: ''
  });

  const roomTypeList = [
    { key: 'ac', value: 'AC' },
    { key: 'nac', value: 'Non AC' }
  ];

  const floorTypeList = [
    { key: 'SC', value: 'Yes' },
    { key: 'n', value: 'No' }
  ];

  return (
    <View className="flex-1 justify-center items-center mt-10">
      <MultiSwitch
        items={items}
        value={value}
        onChange={(val) => setValue(val)}
        containerStyle={{
          backgroundColor: colors.gray_200,
          height: 40,
          borderRadius: 15,
          borderWidth: 2,
          padding: 0,
          borderColor: colors.gray_200
        }}
        sliderStyle={{
          backgroundColor: 'white',
          borderRadius: 20
        }}
        textStyle={{
          color: 'black',
          fontSize: 12,
          fontFamily: 'Poppins-Medium'
        }}
      />

      {value === items[0] && (
        <View>
          <CustomCalender
            type={'period'}
            startDay={multiDayForm.startDay}
            setStartDay={(day) =>
              setMultiDayForm((prev) => ({ ...prev, startDay: day }))
            }
            endDay={multiDayForm.endDay}
            setEndDay={(day) =>
              setMultiDayForm((prev) => ({ ...prev, endDay: day }))
            }
          />

          <CustomDropdown
            otherStyles="mt-7"
            text={'Room Type'}
            placeholder={'Select Room Type'}
            data={roomTypeList}
            setSelected={(val) =>
              setMultiDayForm({ ...multiDayForm, roomType: val })
            }
          />

          <CustomDropdown
            otherStyles="mt-7"
            text={'Book Only if Ground Floor is Available'}
            placeholder={'Select Floor Type'}
            data={floorTypeList}
            setSelected={(val) =>
              setMultiDayForm({ ...multiDayForm, floorType: val })
            }
          />

          <CustomButton
            text="Book Now"
            handlePress={async () => {
              if (
                !multiDayForm.startDay ||
                !multiDayForm.endDay ||
                !multiDayForm.roomType ||
                !multiDayForm.floorType
              ) {
                Alert.alert('Please fill all fields');
                return;
              }

              setIsSubmitting(true);

              const onSuccess = (data) => {
                Alert.alert('Booking Successful');
              };

              const onFinally = () => {
                setIsSubmitting(false);
              };

              await handleAPICall(
                'POST',
                '/stay/room',
                null,
                {
                  cardno: user.cardno,
                  checkin_date: multiDayForm.startDay,
                  checkout_date: multiDayForm.endDay,
                  room_type: multiDayForm.roomType,
                  floor_pref:
                    multiDayForm.floorType == 'n' ? '' : multiDayForm.floorType
                },
                onSuccess,
                onFinally
              );
            }}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      )}

      {value === items[1] && (
        <View>
          <CustomCalender
            selectedDay={selectedDay}
            setSelectedDay={(day) => setSelectedDay(day)}
          />

          <CustomButton
            text="Book Now"
            handlePress={async () => {
              if (!selectedDay) {
                Alert.alert('Please fill all fields');
                return;
              }

              setIsSubmitting(true);

              const onSuccess = (data) => {
                Alert.alert('Booking Successful');
              };

              const onFinally = () => {
                setIsSubmitting(false);
              };

              await handleAPICall(
                'POST',
                '/stay/room',
                null,
                {
                  cardno: user.cardno,
                  checkin_date: selectedDay,
                  checkout_date: selectedDay
                },
                onSuccess,
                onFinally
              );
            }}
            containerStyles="mt-10"
            isLoading={isSubmitting}
          />
        </View>
      )}
    </View>
  );
};

const FormComponent2 = () => {
  // Form component for Chip 2
  return (
    <View className="flex-1 justify-center items-center mt-5">
      <Text>Form for Chip 2</Text>
    </View>
  );
};

const FormComponent3 = () => {
  // Form component for Chip 3
  return (
    <View className="flex-1 justify-center items-center mt-5">
      <Text>Form for Chip 3</Text>
    </View>
  );
};

export default BookNow;
