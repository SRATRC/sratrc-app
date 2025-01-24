import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { icons, dropdowns } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import CustomDropdown from '../CustomDropdown';
import CustomDateInput from '../CustomDateInput';
import AddonItem from '../AddonItem';
import moment from 'moment';

const RoomAddon = ({
  roomForm,
  setRoomForm,
  isDatePickerVisible,
  setDatePickerVisibility
}) => {
  const { setData } = useGlobalContext();
  return (
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
      <CustomDateInput
        openDatePicker={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            checkin: true
          })
        }
        text={'Checkin Date'}
        date={new Date(roomForm.startDay)}
        value={
          roomForm.startDay
            ? moment(roomForm.startDay).format('Do MMMM YYYY')
            : 'Checkin Date'
        }
        isDatePickerVisible={isDatePickerVisible.checkin}
        onDateSelect={(date) => {
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
        onDateCancel={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            checkin: false
          })
        }
      />

      <CustomDateInput
        openDatePicker={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            checkout: true
          })
        }
        text={'Checkout Date'}
        date={new Date(roomForm.endDay)}
        minimumDate={moment(roomForm.startDay).toDate()}
        value={
          roomForm.endDay
            ? moment(roomForm.endDay).format('Do MMMM YYYY')
            : 'Checkout Date'
        }
        isDatePickerVisible={isDatePickerVisible.checkout}
        onDateSelect={(date) => {
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
        }}
        onDateCancel={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            checkout: false
          })
        }
        isDisabled={roomForm.startDay == ''}
      />

      <CustomDropdown
        otherStyles="mt-7"
        text={'Room Type'}
        placeholder={'Select Room Type'}
        data={dropdowns.ROOM_TYPE_LIST}
        setSelected={(val) => setRoomForm({ ...roomForm, roomType: val })}
      />

      <CustomDropdown
        otherStyles="mt-7"
        text={'Book Only if Ground Floor is Available'}
        placeholder={'Select Floor Type'}
        data={dropdowns.FLOOR_TYPE_LIST}
        setSelected={(val) => setRoomForm({ ...roomForm, floorType: val })}
      />
    </AddonItem>
  );
};

export default RoomAddon;
