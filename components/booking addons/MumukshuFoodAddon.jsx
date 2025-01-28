import { View, Text, Image, TouchableOpacity } from 'react-native';
import { colors, icons, dropdowns } from '../../constants';
import CustomDropdown from '../CustomDropdown';
import moment from 'moment';
import AddonItem from '../AddonItem';
import CustomMultiSelectDropdown from '../CustomMultiSelectDropdown';
import HorizontalSeparator from '../HorizontalSeparator';
import CustomDateInput from '../CustomDateInput';

const MumukshuFoodAddon = ({
  foodForm,
  setFoodForm,
  addFoodForm,
  resetFoodForm,
  updateFoodForm,
  reomveFoodForm,
  mumukshu_dropdown,
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
      <CustomDateInput
        openDatePicker={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            foodStart: true
          })
        }
        text={'Start Date'}
        date={new Date(foodForm.startDay)}
        value={
          foodForm.startDay
            ? moment(foodForm.startDay).format('Do MMMM YYYY')
            : 'Start Date'
        }
        isDatePickerVisible={isDatePickerVisible.foodStart}
        onDateSelect={(date) => {
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
        onDateCancel={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            foodStart: false
          })
        }
      />

      <CustomDateInput
        openDatePicker={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            foodEnd: true
          })
        }
        text={'End Date'}
        date={new Date(foodForm.endDay)}
        minimumDate={moment(foodForm.startDay).toDate()}
        value={
          foodForm.endDay
            ? moment(foodForm.endDay).format('Do MMMM YYYY')
            : 'End Date'
        }
        isDatePickerVisible={isDatePickerVisible.foodEnd}
        onDateSelect={(date) => {
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
        onDateCancel={() =>
          setDatePickerVisibility({
            ...isDatePickerVisible,
            foodEnd: false
          })
        }
        isDisabled={foodForm.startDay == ''}
      />

      {foodForm.mumukshuGroup.map((assignment, index) => (
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
            text={`Mumukshus group - ${index + 1}`}
            placeholder="Select Mumukshus"
            data={mumukshu_dropdown}
            value={assignment.mumukshuIndices}
            setSelected={(val) => updateFoodForm(index, 'mumukshus', val)}
            guest={true}
          />

          <CustomMultiSelectDropdown
            otherStyles="mt-5"
            text={`Select Meals`}
            placeholder="Select Meals"
            data={dropdowns.GUEST_FOOD_TYPE_LIST}
            value={assignment.meals}
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
        <Text className="text-base text-black underline">
          Add More Mumukshus
        </Text>
      </TouchableOpacity>
    </AddonItem>
  );
};

export default MumukshuFoodAddon;
