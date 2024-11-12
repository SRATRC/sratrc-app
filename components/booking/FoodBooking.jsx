import { View, Alert, Text } from 'react-native';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import CustomDropdown from '../../components/CustomDropdown';
import CustomButton from '../../components/CustomButton';
import CustomCalender from '../../components/CustomCalender';
import handleAPICall from '../../utils/HandleApiCall';
import CustomMultiSelectDropdown from '../../components/CustomMultiSelectDropdown';
import CustomChipGroup from '../CustomChipGroup';
import CustomModal from '../CustomModal';
import GuestForm from '../GuestForm';

const FOOD_TYPE_LIST = [
  { label: 'breakfast', value: 'breakfast' },
  { label: 'lunch', value: 'lunch' },
  { label: 'dinner', value: 'dinner' }
];

const SPICE_LIST = [
  { label: 'Regular', value: 'Regular' },
  { label: 'Non Spicy', value: 'Non Spicy' }
];

const HIGHTEA_LIST = [
  { label: 'TEA', value: 'Tea' },
  { label: 'COFFEE', value: 'Coffee' },
  { label: 'NONE', value: 'None' }
];

const CHIPS = ['Self', 'Guest'];

const FoodBooking = () => {
  const { user } = useGlobalContext();

  const [foodForm, setFoodForm] = useState({
    startDay: '',
    endDay: '',
    spicy: '',
    hightea: 'NONE'
  });

  const [guestForm, setGuestForm] = useState({
    startDay: '',
    endDay: '',
    guests: [
      {
        name: '',
        gender: '',
        mobno: '',
        guestType: '',
        meals: [],
        spicy: '',
        hightea: 'NONE'
      }
    ]
  });

  const [type, setType] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [selectedChip, setSelectedChip] = useState('Self');
  const handleChipClick = (chip) => {
    setSelectedChip(chip);
  };

  const addGuestForm = () => {
    setGuestForm((prev) => ({
      ...prev,
      guests: [
        ...prev.guests,
        {
          name: '',
          gender: '',
          mobno: '',
          guestType: '',
          meals: [],
          spicy: '',
          hightea: 'NONE'
        }
      ]
    }));
  };

  const handleGuestFormChange = (index, field, value) => {
    const updatedForms = guestForm.guests.map((guest, i) =>
      i === index ? { ...guest, [field]: value } : guest
    );
    setGuestForm((prev) => ({ ...prev, guests: updatedForms }));
  };

  const handleSuggestionSelect = (index, suggestion) => {
    const updatedForms = guestForm.guests.map((guest, i) =>
      i === index
        ? { ...guest, ...suggestion, mobno: suggestion.mobno.toString() }
        : guest
    );
    setGuestForm((prev) => ({ ...prev, guests: updatedForms }));
  };

  const removeGuestForm = (indexToRemove) => {
    setGuestForm((prev) => ({
      ...prev,
      guests: prev.guests.filter((_, index) => index !== indexToRemove)
    }));
  };

  const isGuestFormValid = () => {
    if (!guestForm.startDay) {
      return false;
    }

    return guestForm.guests.every((guest) => {
      const commonFields =
        guest.name &&
        guest.gender &&
        guest.guestType &&
        guest.meals &&
        guest.spicy &&
        guest.hightea;

      if (guest.guestType === 'VIP') {
        return commonFields;
      } else {
        return commonFields && guest.mobno;
      }
    });
  };

  return (
    <View className="flex-1 justify-center items-center">
      <CustomCalender
        type={'period'}
        startDay={foodForm.startDay}
        setStartDay={(day) => {
          setFoodForm((prev) => ({ ...prev, startDay: day }));
          setGuestForm((prev) => ({ ...prev, startDay: day }));
        }}
        endDay={foodForm.endDay}
        setEndDay={(day) => {
          setFoodForm((prev) => ({ ...prev, endDay: day }));
          setGuestForm((prev) => ({ ...prev, endDay: day }));
        }}
      />

      <View className="w-full mt-7 flex flex-col">
        <Text className="text-base text-gray-600 font-pmedium">Book for</Text>
        <CustomChipGroup
          chips={CHIPS}
          selectedChip={selectedChip}
          handleChipPress={handleChipClick}
          containerStyles={'mt-1'}
          chipContainerStyles={'py-2'}
          textStyles={'text-sm'}
        />
      </View>

      {selectedChip == CHIPS[0] && (
        <View className="w-full flex flex-col">
          <CustomMultiSelectDropdown
            otherStyles="mt-5 w-full px-1"
            text={'Food Type'}
            placeholder={'Select Food Type'}
            data={FOOD_TYPE_LIST}
            setSelected={(val) => setType(val)}
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

          <CustomButton
            text="Book Now"
            handlePress={async () => {
              if (
                !foodForm.startDay ||
                type.length == 0 ||
                !foodForm.spicy ||
                !foodForm.hightea
              ) {
                Alert.alert('Please fill all fields');
                return;
              }
              setIsSubmitting(true);

              const onSuccess = (_data) => {
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
                  end_date: foodForm.endDay
                    ? foodForm.endDay
                    : foodForm.startDay,
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
      )}

      {selectedChip == CHIPS[1] && (
        <View className="w-full flex flex-col">
          <GuestForm
            guestForm={guestForm}
            handleGuestFormChange={handleGuestFormChange}
            addGuestForm={addGuestForm}
            removeGuestForm={removeGuestForm}
            handleSuggestionSelect={handleSuggestionSelect}
          >
            {(index) => (
              <>
                <CustomMultiSelectDropdown
                  otherStyles="mt-5"
                  text={`Select Meals`}
                  placeholder="Select Meals"
                  data={FOOD_TYPE_LIST}
                  value={guestForm.guests[index].meals}
                  labelField="key"
                  valueField="value"
                  setSelected={(val) =>
                    handleGuestFormChange(index, 'meals', val)
                  }
                  guest={true}
                />

                <CustomDropdown
                  otherStyles="mt-5 w-full px-1"
                  text={'Spice Level'}
                  placeholder={'How much spice do you want?'}
                  data={SPICE_LIST}
                  setSelected={(val) =>
                    handleGuestFormChange(index, 'spicy', val)
                  }
                  value={guestForm.guests[index].spicy}
                  autofill={true}
                />

                <CustomDropdown
                  otherStyles="mt-5 w-full px-1"
                  text={'Hightea'}
                  placeholder={'Hightea'}
                  data={HIGHTEA_LIST}
                  defaultOption={{ key: 'NONE', value: 'None' }}
                  setSelected={(val) =>
                    handleGuestFormChange(index, 'hightea', val)
                  }
                  value={guestForm.guests[index].hightea}
                  autofill={true}
                />
              </>
            )}
          </GuestForm>

          <CustomButton
            text="Book Now"
            handlePress={async () => {
              setIsSubmitting(true);
              if (!isGuestFormValid()) {
                setIsSubmitting(false);
                setModalMessage('Please fill all fields');
                setModalVisible(true);
                return;
              }
            }}
            containerStyles="mt-7 w-full px-1 min-h-[62px]"
            isLoading={isSubmitting}
          />
        </View>
      )}
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={modalMessage}
        btnText={'Okay'}
      />
    </View>
  );
};

export default FoodBooking;
