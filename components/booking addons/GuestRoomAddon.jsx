import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useGlobalContext } from '../../context/GlobalProvider';
import { colors, icons } from '../../constants';
import CustomDropdown from '../CustomDropdown';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FormDisplayField from '../FormDisplayField';
import AddonItem from '../AddonItem';
import CustomMultiSelectDropdown from '../CustomMultiSelectDropdown';
import HorizontalSeparator from '../HorizontalSeparator';

const ROOM_TYPE_LIST = [
  { key: 'ac', value: 'AC' },
  { key: 'nac', value: 'Non AC' }
];

const FLOOR_TYPE_LIST = [
  { key: 'SC', value: 'Yes' },
  { key: 'n', value: 'No' }
];

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
          value={roomForm.startDay ? roomForm.startDay : 'Checkin Date'}
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
        disabled={roomForm.startDay === ''}
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
            data={ROOM_TYPE_LIST}
            setSelected={(val) => updateRoomForm(index, 'roomType', val)}
          />

          <CustomDropdown
            otherStyles="mt-5"
            text="Floor Type"
            placeholder="Select Floor Type"
            data={FLOOR_TYPE_LIST}
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
