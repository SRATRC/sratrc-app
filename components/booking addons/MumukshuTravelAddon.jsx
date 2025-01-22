import { View, Text, Image, TouchableOpacity } from 'react-native';
import { icons, colors } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import { RectButton } from 'react-native-gesture-handler';
import CustomDropdown from '../CustomDropdown';
import CustomMultiSelectDropdowm from '../CustomMultiSelectDropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FormField from '../FormField';
import FormDisplayField from '../FormDisplayField';
import AddonItem from '../AddonItem';
import moment from 'moment';
import HorizontalSeparator from '../HorizontalSeparator';

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
  { key: 'other', value: 'Other' }
];

const LUGGAGE_LIST = [
  { key: 'cabin1', value: '1 Cabin Bag' },
  { key: 'cabin2', value: '2 Cabin Bags' },
  { key: 'suitcase1', value: '1 Suitcase' },
  { key: 'suitcase2', value: '2 Suitcases' },
  { key: 'none', value: 'NONE' }
];

const BOOKING_TYPE_LIST = [
  { key: 'regular', value: 'Regular' },
  { key: 'full', value: 'Full Car' }
];

const MumukshuTravelAddon = ({
  travelForm,
  setTravelForm,
  addTravelForm,
  updateTravelForm,
  resetTravelForm,
  removeTravelForm,
  mumukshu_dropdown,
  isDatePickerVisible,
  setDatePickerVisibility
}) => {
  const { mumukshuData, setMumukshuData } = useGlobalContext();
  return (
    <AddonItem
      onCollapse={() => {
        resetTravelForm();
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
          value={
            travelForm.date
              ? moment(travelForm.date).format('Do MMMM YYYY')
              : 'Date'
          }
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

      {travelForm.mumukshuGroup.map((assignment, index) => (
        <View key={index} style={{ marginBottom: 15 }}>
          {index > 0 && (
            <View>
              <HorizontalSeparator otherStyles={'w-full mt-3'} />
              <TouchableOpacity
                onPress={removeTravelForm(index)}
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
          <CustomMultiSelectDropdowm
            otherStyles="mt-5"
            text={`Mumukshus for Seat ${index + 1}`}
            placeholder="Select Mumukshus"
            data={mumukshu_dropdown}
            value={assignment.mumukshuIndices}
            setSelected={(val) => {
              updateTravelForm(index, 'mumukshus', val);
            }}
            guest={true}
          />

          <CustomDropdown
            otherStyles="mt-5"
            text={'Pickup Location'}
            placeholder={'Select Location'}
            data={LOCATION_LIST}
            setSelected={(val) => updateTravelForm(index, 'pickup', val)}
          />

          <CustomDropdown
            otherStyles="mt-5"
            text={'Drop Location'}
            placeholder={'Select Location'}
            data={LOCATION_LIST}
            setSelected={(val) => updateTravelForm(index, 'drop', val)}
          />

          <CustomDropdown
            otherStyles="mt-5"
            text={'Luggage'}
            placeholder={'Select any luggage'}
            data={LUGGAGE_LIST}
            setSelected={(val) => updateTravelForm(index, 'luggage', val)}
          />

          <CustomDropdown
            otherStyles="mt-5"
            text={'Booking Type'}
            placeholder={'Select booking type'}
            data={BOOKING_TYPE_LIST}
            setSelected={(val) => updateTravelForm(index, 'type', val)}
          />

          <FormField
            text="Any Special Request?"
            value={travelForm.special_request}
            handleChangeText={(e) =>
              updateTravelForm(index, 'special_request', e)
            }
            otherStyles="mt-7"
            containerStyles="bg-gray-100"
            keyboardType="default"
            placeholder="please specify your request here..."
          />
        </View>
      ))}

      <TouchableOpacity
        className="w-full justify-start items-center mt-4 flex-row space-x-1"
        onPress={addTravelForm}
      >
        <Image
          source={icons.addon}
          tintColor={colors.black}
          className="w-4 h-4"
          resizeMode="contain"
        />
        <Text className="text-base text-black underline">
          Add More Mumukshus
        </Text>
      </TouchableOpacity>
    </AddonItem>
  );
};

export default MumukshuTravelAddon;
