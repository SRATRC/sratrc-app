import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { icons } from '../../constants';
import CustomDropdown from '../CustomDropdown';
import { useGlobalContext } from '../../context/GlobalProvider';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FormDisplayField from '../FormDisplayField';
import React from 'react';
import AddonItem from '../AddonItem';

const ROOM_TYPE_LIST = [
  { key: 'ac', value: 'AC' },
  { key: 'nac', value: 'Non AC' }
];

const FLOOR_TYPE_LIST = [
  { key: 'SC', value: 'Yes' },
  { key: 'n', value: 'No' }
];

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
            roomForm.startDay
              ? moment(roomForm.startDay).format('Do MMMM YYYY')
              : 'Checkin Date'
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
          value={
            roomForm.endDay
              ? moment(roomForm.endDay).format('Do MMMM YYYY')
              : 'Checkout Date'
          }
          otherStyles="mt-5"
          backgroundColor="bg-gray-100"
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible.checkout}
        mode="date"
        onConfirm={(date) => {
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
        setSelected={(val) => setRoomForm({ ...roomForm, roomType: val })}
      />

      <CustomDropdown
        otherStyles="mt-7"
        text={'Book Only if Ground Floor is Available'}
        placeholder={'Select Floor Type'}
        data={FLOOR_TYPE_LIST}
        setSelected={(val) => setRoomForm({ ...roomForm, floorType: val })}
      />
    </AddonItem>
  );
};

export default RoomAddon;
