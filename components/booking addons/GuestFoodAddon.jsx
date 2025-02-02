import { View, Text, Image, TouchableOpacity } from 'react-native';
import { colors, icons, dropdowns } from '../../constants';
import CustomDropdown from '../CustomDropdown';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AddonItem from '../AddonItem';
import CustomMultiSelectDropdown from '../CustomMultiSelectDropdown';
import HorizontalSeparator from '../HorizontalSeparator';
import FormDisplayField from '../FormDisplayField';

const GuestFoodAddon = ({
  foodForm,
  setFoodForm,
  addFoodForm,
  resetFoodForm,
  updateFoodForm,
  reomveFoodForm,
  guest_dropdown,
  isDatePickerVisible,
  setDatePickerVisibility
}) => {
  return (
    <AddonItem
      onCollapse={() => {
        resetFoodForm();
      }}
      visibleContent={
        <View className="flex flex-row items-center space-x-4">
          <Image
            source={icons.food}
            className="w-10 h-10"
            resizeMode="contain"
          />
          <Text className="font-pmedium">Raj Prasad Booking</Text>
        </View>
      }
      containerStyles={'mt-3'}
    >
      <TouchableOpacity
        onPress={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            foodStart: true
          })
        }
      >
        <FormDisplayField
          text="Start Date"
          value={
            foodForm.startDay
              ? moment(foodForm.startDay).format('Do MMMM YYYY')
              : 'Start Date'
          }
          otherStyles="mt-5"
          backgroundColor="bg-gray-100"
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible.foodStart}
        mode="date"
        onConfirm={(date) => {
          if (isNaN(date)) date = moment().add(1, 'days').toDate();
          setFoodForm({
            ...foodForm,
            startDay:
              moment(date) < moment().add(1, 'days').toDate()
                ? moment().add(1, 'days').format('YYYY-MM-DD')
                : moment(date).format('YYYY-MM-DD')
          });
          setDatePickerVisibility({
            ...isDatePickerVisible,
            foodStart: false
          });
        }}
        onCancel={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            foodStart: false
          })
        }
        minimumDate={moment().add(1, 'days').toDate()}
      />

      <TouchableOpacity
        disabled={foodForm.startDay == ''}
        onPress={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            foodEnd: true
          })
        }
      >
        <FormDisplayField
          text="End Date"
          value={
            foodForm.endDay
              ? moment(foodForm.endDay).format('Do MMMM YYYY')
              : 'End Date'
          }
          otherStyles="mt-5"
          backgroundColor="bg-gray-100"
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible.foodEnd}
        mode="date"
        onConfirm={(date) => {
          if (isNaN(date)) date = moment(foodForm.startDay).toDate();
          setFoodForm({
            ...foodForm,
            endDay:
              moment(date) < moment().add(1, 'days').toDate()
                ? moment().add(1, 'days').format('YYYY-MM-DD')
                : moment(date).format('YYYY-MM-DD')
          });
          setDatePickerVisibility({
            ...isDatePickerVisible,
            foodEnd: false
          });
        }}
        onCancel={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            foodEnd: false
          })
        }
        minimumDate={moment(foodForm.startDay).toDate()}
      />

      {foodForm.guestGroup.map((assignment, index) => (
        <View key={index} style={{ marginBottom: 15 }}>
          {index > 0 && (
            <View>
              <HorizontalSeparator otherStyles={'w-full mt-3'} />
              <TouchableOpacity
                onPress={reomveFoodForm(index)}
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
            text={`Guests group - ${index + 1}`}
            placeholder="Select Guests"
            data={guest_dropdown}
            value={assignment.guestIndices}
            setSelected={(val) => updateFoodForm(index, 'guests', val)}
            guest={true}
          />

          <CustomMultiSelectDropdown
            otherStyles="mt-5"
            text={`Select Meals`}
            placeholder="Select Meals"
            data={dropdowns.GUEST_FOOD_TYPE_LIST}
            value={assignment.meals}
            labelField="key"
            valueField="value"
            setSelected={(val) => updateFoodForm(index, 'meals', val)}
            guest={true}
          />

          <CustomDropdown
            otherStyles="mt-5 w-full px-1"
            text={'Spice Level'}
            placeholder={'How much spice do you want?'}
            data={dropdowns.SPICE_LIST}
            setSelected={(val) => updateFoodForm(index, 'spicy', val)}
            value={assignment.spicy}
          />

          <CustomDropdown
            otherStyles="mt-5 w-full px-1"
            text={'Hightea'}
            placeholder={'Hightea'}
            data={dropdowns.HIGHTEA_LIST}
            defaultOption={{ key: 'NONE', value: 'None' }}
            setSelected={(val) => updateFoodForm(index, 'hightea', val)}
            value={assignment.hightea}
          />
        </View>
      ))}

      <TouchableOpacity
        className="w-full justify-start items-center mt-4 flex-row space-x-1"
        onPress={addFoodForm}
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

export default GuestFoodAddon;
