import { View, Text, Image, TouchableOpacity } from 'react-native';
import { icons, colors, dropdowns } from '../../constants';
import CustomDropdown from '../CustomDropdown';
import CustomMultiSelectDropdowm from '../CustomMultiSelectDropdown';
import CustomDateInput from '../CustomDateInput';
import FormField from '../FormField';
import AddonItem from '../AddonItem';
import moment from 'moment';
import HorizontalSeparator from '../HorizontalSeparator';

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
      <CustomDateInput
        openDatePicker={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            travel: true
          })
        }
        text={'Date'}
        date={new Date(travelForm.date)}
        value={
          travelForm.date
            ? moment(travelForm.date).format('Do MMMM YYYY')
            : 'Date'
        }
        isDatePickerVisible={isDatePickerVisible.travel}
        onDateSelect={(date) => {
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
        onDateCancel={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            travel: false
          })
        }
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
            data={dropdowns.LOCATION_LIST}
            setSelected={(val) => updateTravelForm(index, 'pickup', val)}
          />

          <CustomDropdown
            otherStyles="mt-5"
            text={'Drop Location'}
            placeholder={'Select Location'}
            data={dropdowns.LOCATION_LIST}
            setSelected={(val) => updateTravelForm(index, 'drop', val)}
          />

          <CustomDropdown
            otherStyles="mt-5"
            text={'Luggage'}
            placeholder={'Select any luggage'}
            data={dropdowns.LUGGAGE_LIST}
            setSelected={(val) => updateTravelForm(index, 'luggage', val)}
          />

          <CustomDropdown
            otherStyles="mt-5"
            text={'Booking Type'}
            placeholder={'Select booking type'}
            data={dropdowns.BOOKING_TYPE_LIST}
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
