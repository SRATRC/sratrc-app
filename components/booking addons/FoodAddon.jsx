import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { icons } from '../../constants';
import CustomDropdown from '../CustomDropdown';
import { useGlobalContext } from '../../context/GlobalProvider';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FormDisplayField from '../FormDisplayField';
import AddonItem from '../AddonItem';
import CustomMultiSelectDropdown from '../CustomMultiSelectDropdown';

const FOOD_TYPE_LIST = [
  { key: 'breakfast', value: 'breakfast' },
  { key: 'lunch', value: 'lunch' },
  { key: 'dinner', value: 'dinner' }
];

const SPICE_LIST = [
  { key: 'Regular', value: 'Regular' },
  { key: 'Non Spicy', value: 'Non Spicy' }
];

const HIGHTEA_LIST = [
  { key: 'TEA', value: 'Tea' },
  { key: 'COFFEE', value: 'Coffee' },
  { key: 'NONE', value: 'None' }
];

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
          value={foodForm.startDay ? foodForm.startDay : 'Start Date'}
          otherStyles="mt-5"
          backgroundColor="bg-gray-100"
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible.foodStart}
        mode="date"
        onConfirm={(date) => {
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
          value={foodForm.endDay ? foodForm.endDay : 'End Date'}
          otherStyles="mt-5"
          backgroundColor="bg-gray-100"
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible.foodEnd}
        mode="date"
        onConfirm={(date) => {
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
        minimumDate={moment().add(1, 'days').toDate()}
      />

      <CustomMultiSelectDropdown
        otherStyles="mt-5 w-full px-1"
        text={'Food Type'}
        placeholder={'Select Food Type'}
        data={FOOD_TYPE_LIST}
        setSelected={(val) => setMeals(val)}
      />

      <CustomDropdown
        otherStyles="mt-5 w-full px-1"
        text={'Spice Level'}
        placeholder={'How much spice do you want?'}
        data={SPICE_LIST}
        setSelected={(val) => setFoodForm({ ...foodForm, spicy: val })}
      />

      <CustomDropdown
        otherStyles="mt-5 w-full px-1"
        text={'Hightea'}
        placeholder={'Hightea'}
        data={HIGHTEA_LIST}
        defaultOption={{ key: 'NONE', value: 'None' }}
        setSelected={(val) => setFoodForm({ ...foodForm, hightea: val })}
      />
    </AddonItem>
  );
};

export default FoodAddon;
