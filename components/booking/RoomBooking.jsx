import { View, Alert } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { colors, types } from '../../constants';
import MultiSwitch from 'react-native-multiple-switch';
import CustomDropdown from '../../components/CustomDropdown';
import CustomButton from '../../components/CustomButton';
import CustomCalender from '../../components/CustomCalender';
import handleAPICall from '../../utils/HandleApiCall';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import CustomModal from '../CustomModal';

const SWITCH_OPTIONS = ['Select Dates', 'One Day Visit'];

const ROOM_TYPE_LIST = [
  { key: 'ac', value: 'AC' },
  { key: 'nac', value: 'Non AC' }
];

const FLOOR_TYPE_LIST = [
  { key: 'SC', value: 'Yes' },
  { key: 'n', value: 'No' }
];

const RoomBooking = () => {
  const router = useRouter();
  const { user, setData } = useGlobalContext();

  useFocusEffect(
    useCallback(() => {
      setIsSubmitting(false);
    }, [])
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [value, setValue] = useState(SWITCH_OPTIONS[0]);

  const [selectedDay, setSelectedDay] = useState();
  const [multiDayForm, setMultiDayForm] = useState({
    startDay: '',
    endDay: '',
    roomType: '',
    floorType: ''
  });

  return (
    <View className="flex-1 justify-center mt-10">
      <MultiSwitch
        items={SWITCH_OPTIONS}
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
      {value === SWITCH_OPTIONS[0] && (
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
            data={ROOM_TYPE_LIST}
            setSelected={(val) =>
              setMultiDayForm({ ...multiDayForm, roomType: val })
            }
          />

          <CustomDropdown
            otherStyles="mt-7"
            text={'Book Only if Ground Floor is Available'}
            placeholder={'Select Floor Type'}
            data={FLOOR_TYPE_LIST}
            setSelected={(val) =>
              setMultiDayForm({ ...multiDayForm, floorType: val })
            }
          />

          <CustomButton
            text="Book Now"
            handlePress={async () => {
              setIsSubmitting(true);
              if (
                !multiDayForm.startDay ||
                !multiDayForm.endDay ||
                !multiDayForm.roomType ||
                !multiDayForm.floorType
              ) {
                setModalVisible(true);
                setModalMessage('Please enter all details');
                setIsSubmitting(false);
                return;
              }

              setData((prev) => {
                const updated = { ...prev, room: multiDayForm };
                delete updated.travel;
                delete updated.adhyayan;
                delete updated.food;
                return updated;
              });
              router.push(`/booking/${types.ROOM_DETAILS_TYPE}`);
            }}
            containerStyles="mt-7 min-h-[62px]"
            isLoading={isSubmitting}
          />
        </View>
      )}

      {value === SWITCH_OPTIONS[1] && (
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

              const onSuccess = (_data) => {
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
            containerStyles="mt-10 min-h-[62px]"
            isLoading={isSubmitting}
          />
        </View>
      )}

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={modalMessage}
        btnText={'Okay'}
      />
    </View>
  );
};

export default RoomBooking;
