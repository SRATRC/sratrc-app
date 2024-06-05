import { View, Alert } from 'react-native';
import React, { useState } from 'react';
import CustomDropdown from '../../components/CustomDropdown';
import CustomButton from '../../components/CustomButton';
import CustomCalender from '../../components/CustomCalender';
import handleAPICall from '../../utils/HandleApiCall';
import CustomMultiSelectDropdown from '../../components/CustomMultiSelectDropdown';

const FoodBooking = ({ user }) => {
  const [foodForm, setFoodForm] = useState({
    startDay: '',
    endDay: '',
    spicy: '',
    hightea: ''
  });
  const [type, setType] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const foodTypeList = [
    { key: 'breakfast', value: 'breakfast' },
    { key: 'lunch', value: 'lunch' },
    { key: 'dinner', value: 'dinner' }
  ];

  const spiceyList = [
    { key: 'Regular', value: 'Regular' },
    { key: 'Non Spicy', value: 'Non Spicy' }
  ];

  const highteaList = [
    { key: 'TEA', value: 'Tea' },
    { key: 'COFFEE', value: 'Coffee' },
    { key: 'NONE', value: 'None' }
  ];

  return (
    <View className="flex-1 justify-center items-center">
      <CustomCalender
        type={'period'}
        startDay={foodForm.startDay}
        setStartDay={(day) =>
          setFoodForm((prev) => ({ ...prev, startDay: day }))
        }
        endDay={foodForm.endDay}
        setEndDay={(day) => setFoodForm((prev) => ({ ...prev, endDay: day }))}
      />

      <CustomMultiSelectDropdown
        otherStyles="mt-5 w-full px-1"
        text={'Food Type'}
        placeholder={'Select Food Type'}
        data={foodTypeList}
        setSelected={(val) => setType(val)}
        type={type}
      />

      <CustomDropdown
        otherStyles="mt-5 w-full px-1"
        text={'Spice Level'}
        placeholder={'How much spice do you want?'}
        data={spiceyList}
        setSelected={(val) => setFoodForm({ ...foodForm, spicy: val })}
      />

      <CustomDropdown
        otherStyles="mt-5 w-full px-1"
        text={'Hightea'}
        placeholder={'Hightea'}
        data={highteaList}
        setSelected={(val) => setFoodForm({ ...foodForm, hightea: val })}
      />

      <CustomButton
        text="Book Now"
        handlePress={async () => {
          if (
            !foodForm.startDay ||
            !foodForm.endDay ||
            !type ||
            !foodForm.spicy ||
            !foodForm.hightea
          ) {
            Alert.alert('Please fill all fields');
            return;
          }
          setIsSubmitting(true);

          const onSuccess = (data) => {
            Alert.alert('Booking Successful');
          };

          const onFinally = () => {
            setIsSubmitting(false);
          };

          await handleAPICall(
            'POST',
            '/food/book',
            null,
            {
              cardno: user.cardno,
              start_date: foodForm.startDay,
              end_date: foodForm.endDay,
              breakfast: type.includes('breakfast') ? 1 : 0,
              lunch: type.includes('lunch') ? 1 : 0,
              dinner: type.includes('dinner') ? 1 : 0,
              spicy: foodForm.spicy == 'Regular' ? 1 : 0,
              high_tea: foodForm.hightea
            },
            onSuccess,
            onFinally
          );
        }}
        containerStyles="mt-7 w-full px-1 min-h-[62px]"
        isLoading={isSubmitting}
      />
    </View>
  );
};

export default FoodBooking;
