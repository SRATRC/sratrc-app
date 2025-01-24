import { View, Text, Image, TouchableOpacity } from 'react-native';
import { icons, dropdowns } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import React from 'react';
import moment from 'moment';
import CustomDropdown from '../CustomDropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FormDisplayField from '../FormDisplayField';
import AddonItem from '../AddonItem';
import CustomMultiSelectDropdown from '../CustomMultiSelectDropdown';
import CustomDateInput from '../CustomDateInput';

const FoodAddon = ({
  foodForm,
  setFoodForm,
  setMeals,
  isDatePickerVisible,
  setDatePickerVisibility
}) => {
  const { setData } = useGlobalContext();
  return (
    <AddonItem
      onCollapse={() => {
        setFoodForm({
          startDay: '',
          endDay: '',
          spicy: '',
          hightea: 'NONE'
        });
        setMeals([]);

        setData((prev) => {
          const { food, ...rest } = prev;
          return rest;
        });
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
        date={new Date(foodForm.foodEnd)}
        minimumDate={moment(foodForm.startDay).toDate()}
        value={
          foodForm.foodEnd
            ? moment(foodForm.foodEnd).format('Do MMMM YYYY')
            : 'End Date'
        }
        isDatePickerVisible={isDatePickerVisible.foodEnd}
        onDateSelect={(date) => {
          setFoodForm({
            ...foodForm,
            foodEnd:
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

      <CustomMultiSelectDropdown
        otherStyles="mt-5 w-full px-1"
        text={'Food Type'}
        placeholder={'Select Food Type'}
        data={dropdowns.FOOD_TYPE_LIST}
        setSelected={(val) => setMeals(val)}
      />

      <CustomDropdown
        otherStyles="mt-5 w-full px-1"
        text={'Spice Level'}
        placeholder={'How much spice do you want?'}
        data={dropdowns.SPICE_LIST}
        setSelected={(val) => setFoodForm({ ...foodForm, spicy: val })}
      />

      <CustomDropdown
        otherStyles="mt-5 w-full px-1"
        text={'Hightea'}
        placeholder={'Hightea'}
        data={dropdowns.HIGHTEA_LIST}
        defaultOption={{ key: 'NONE', value: 'None' }}
        setSelected={(val) => setFoodForm({ ...foodForm, hightea: val })}
      />
    </AddonItem>
  );
};

export default FoodAddon;
