import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useGlobalContext } from '../../context/GlobalProvider';
import { colors, icons, dropdowns } from '../../constants';
import CustomDropdown from '../CustomDropdown';
import moment from 'moment';
import AddonItem from '../AddonItem';
import CustomMultiSelectDropdown from '../CustomMultiSelectDropdown';
import HorizontalSeparator from '../HorizontalSeparator';
import CustomDateInput from '../CustomDateInput';

const GuestRoomAddon = ({
  roomForm,
  setRoomForm,
  addRoomForm,
  updateRoomForm,
  reomveRoomForm,
  guest_dropdown,
  INITIAL_ROOM_FORM,
  isDatePickerVisible,
  setDatePickerVisibility
}) => {
  const { setGuestData } = useGlobalContext();

  return (
    <AddonItem
      onCollapse={() => {
        setRoomForm(INITIAL_ROOM_FORM);
        setGuestData((prev) => {
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
        isDisabled={roomForm.startDay === ''}
      />

      {roomForm.guestGroup.map((assignment, index) => (
        <View key={index} style={{ marginBottom: 15 }}>
          {index > 0 && (
            <View>
              <HorizontalSeparator otherStyles={'w-full mt-3'} />
              <TouchableOpacity
                onPress={reomveRoomForm(index)}
                className="mt-3 flex-row flex-1 justify-end items-center space-x-1"
              >
                <Image
                  source={icons.remove}
                  tintColor={'red'}
                  className="w-3 h-3"
                  resizeMode="contain"
                />
                <Text className="font-pregular text-xs text-red-500">
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <CustomMultiSelectDropdown
            otherStyles="mt-5"
            text={`Guests for Room ${index + 1}`}
            placeholder="Select Guests"
            data={guest_dropdown}
            value={assignment.guestIndices}
            setSelected={(val) => updateRoomForm(index, 'guests', val)}
            guest={true}
          />

          <CustomDropdown
            otherStyles="mt-5"
            text="Room Type"
            placeholder="Select Room Type"
            data={dropdowns.ROOM_TYPE_LIST}
            setSelected={(val) => updateRoomForm(index, 'roomType', val)}
          />

          <CustomDropdown
            otherStyles="mt-5"
            text="Floor Type"
            placeholder="Select Floor Type"
            data={dropdowns.FLOOR_TYPE_LIST}
            setSelected={(val) => updateRoomForm(index, 'floorType', val)}
          />
        </View>
      ))}

      <TouchableOpacity
        className="w-full justify-start items-center mt-4 flex-row space-x-1"
        onPress={addRoomForm}
      >
        <Image
          source={icons.addon}
          tintColor={colors.black}
          className="w-4 h-4"
          resizeMode="contain"
        />
        <Text className="text-base text-black underline">Add More Guests</Text>
      </TouchableOpacity>
    </AddonItem>
  );
};

export default GuestRoomAddon;
