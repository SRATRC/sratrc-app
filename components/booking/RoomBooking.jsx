import { View, Alert } from 'react-native';
import React, { useState } from 'react';
import { colors, types } from '../../constants';
import MultiSwitch from 'react-native-multiple-switch';
import CustomDropdown from '../../components/CustomDropdown';
import CustomButton from '../../components/CustomButton';
import CustomCalender from '../../components/CustomCalender';
import handleAPICall from '../../utils/HandleApiCall';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import CustomModal from '../CustomModal';

const RoomBooking = ({ user }) => {
  const router = useRouter();
  const { setData } = useGlobalContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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
    <View className="flex-1 justify-center mt-10">
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
                setModalVisible(true);
                setModalMessage('Please enter all details');
                return;
              }

              setData((prev) => ({ ...prev, room: multiDayForm }));
              router.push(`/${types.ROOM_DETAILS_TYPE}`);
            }}
            containerStyles="mt-7 min-h-[62px]"
            isLoading={isSubmitting}
          />
        </View>
      )}
      {/* TODO: should i send to add-on page for single day? */}
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
