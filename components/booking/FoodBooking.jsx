import { View, Alert, Text } from 'react-native';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { dropdowns } from '../../constants';
import CustomDropdown from '../../components/CustomDropdown';
import CustomButton from '../../components/CustomButton';
import CustomCalender from '../../components/CustomCalender';
import handleAPICall from '../../utils/HandleApiCall';
import CustomMultiSelectDropdown from '../../components/CustomMultiSelectDropdown';
import CustomChipGroup from '../CustomChipGroup';
import CustomModal from '../CustomModal';
import GuestForm from '../GuestForm';
import OtherMumukshuForm from '../OtherMumukshuForm';

const FOOD_TYPE_LIST = [
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' }
];

const CHIPS = ['Self', 'Guest', 'Other Mumukshus'];

const FoodBooking = () => {
  const { user } = useGlobalContext();

  const [foodForm, setFoodForm] = useState({
    startDay: '',
    endDay: '',
    spicy: null,
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
        type: '',
        meals: [],
        spicy: null,
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
          type: '',
          meals: [],
          spicy: null,
          hightea: 'NONE'
        }
      ]
    }));
  };

  const handleGuestFormChange = (index, field, value) => {
    const updatedForms = guestForm.guests.map((guest, i) =>
      i === index
        ? {
            ...guest,
            [field]: value,
            ...(field === 'name' && { id: undefined })
          }
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
    if (!guestForm.endDay) {
      guestForm.endDay = guestForm.startDay;
    }

    if (!guestForm.startDay) {
      return false;
    }

    return guestForm.guests.every((guest) => {
      if (guest.id) return guest.mobno && guest.mobno?.length == 10;
      else
        return (
          guest.mobno &&
          guest.mobno?.length == 10 &&
          guest.name &&
          guest.gender &&
          guest.type &&
          guest.meals &&
          guest.spicy !== null &&
          guest.hightea
        );
    });
  };

  const [mumukshuForm, setMumukshuForm] = useState({
    startDay: '',
    endDay: '',
    mumukshus: [
      {
        mobno: '',
        meals: [],
        spicy: null,
        hightea: 'NONE'
      }
    ]
  });

  const addMumukshuForm = () => {
    setMumukshuForm((prev) => ({
      ...prev,
      mumukshus: [
        ...prev.mumukshus,
        {
          mobno: '',
          meals: [],
          spicy: null,
          hightea: 'NONE'
        }
      ]
    }));
  };

  const removeMumukshuForm = (indexToRemove) => {
    setMumukshuForm((prev) => ({
      ...prev,
      mumukshus: prev.mumukshus.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleMumukshuFormChange = (index, key, value) => {
    setMumukshuForm((prev) => ({
      ...prev,
      mumukshus: prev.mumukshus.map((mumukshu, i) =>
        i === index ? { ...mumukshu, [key]: value } : mumukshu
      )
    }));
  };

  const isMumukshuFormValid = () => {
    if (!mumukshuForm.startDay) {
      return false;
    }

    return mumukshuForm.mumukshus.every((mumukshu) => {
      return (
        mumukshu.mobno &&
        mumukshu.mobno?.length == 10 &&
        mumukshu.meals &&
        mumukshu.spicy !== null &&
        mumukshu.hightea
      );
    });
  };

  return (
    <View className="flex-1 justify-center items-center">
      <CustomCalender
        type={'period'}
        startDay={foodForm.startDay}
        setStartDay={(day) => {
          setFoodForm((prev) => ({ ...prev, startDay: day, endDay: '' }));
          setGuestForm((prev) => ({ ...prev, startDay: day, endDay: '' }));
          setMumukshuForm((prev) => ({ ...prev, startDay: day, endDay: '' }));
        }}
        endDay={foodForm.endDay}
        setEndDay={(day) => {
          setFoodForm((prev) => ({ ...prev, endDay: day }));
          setGuestForm((prev) => ({ ...prev, endDay: day }));
          setMumukshuForm((prev) => ({ ...prev, endDay: day }));
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
            data={dropdowns.FOOD_TYPE_LIST}
            setSelected={(val) => setType(val)}
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

          <CustomButton
            text="Book Now"
            handlePress={async () => {
              if (
                !foodForm.startDay ||
                type.length == 0 ||
                foodForm.spicy == null ||
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
                '/unified/booking',
                null,
                {
                  cardno: user.cardno,
                  transaction_type: 'upi',
                  transaction_ref: '7XAB46098628492',
                  primary_booking: {
                    booking_type: 'food',
                    details: {
                      start_date: foodForm.startDay,
                      end_date: foodForm.endDay
                        ? foodForm.endDay
                        : foodForm.startDay,
                      breakfast: type.includes('breakfast') ? 1 : 0,
                      lunch: type.includes('lunch') ? 1 : 0,
                      dinner: type.includes('dinner') ? 1 : 0,
                      spicy: foodForm.spicy == 'Regular' ? 1 : 0,
                      high_tea: foodForm.hightea
                    }
                  }
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
            setGuestForm={setGuestForm}
            handleGuestFormChange={handleGuestFormChange}
            addGuestForm={addGuestForm}
            removeGuestForm={removeGuestForm}
          >
            {(index) => (
              <>
                <CustomMultiSelectDropdown
                  otherStyles="mt-5"
                  text={`Select Meals`}
                  placeholder="Select Meals"
                  data={FOOD_TYPE_LIST}
                  value={guestForm.guests[index].meals}
                  setSelected={(val) =>
                    handleGuestFormChange(index, 'meals', val)
                  }
                  guest={true}
                />

                <CustomDropdown
                  otherStyles="mt-5 w-full px-1"
                  text={'Spice Level'}
                  placeholder={'How much spice do you want?'}
                  data={dropdowns.SPICE_LIST}
                  setSelected={(val) =>
                    handleGuestFormChange(index, 'spicy', val)
                  }
                  value={guestForm.guests[index].spicy}
                />

                <CustomDropdown
                  otherStyles="mt-5 w-full px-1"
                  text={'Hightea'}
                  placeholder={'Hightea'}
                  data={dropdowns.HIGHTEA_LIST}
                  defaultOption={{ key: 'NONE', value: 'None' }}
                  setSelected={(val) =>
                    handleGuestFormChange(index, 'hightea', val)
                  }
                  value={guestForm.guests[index].hightea}
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

              const guests = guestForm.guests.map((guest) => ({
                id: guest.id ? guest.id : null,
                name: guest.name,
                gender: guest.gender,
                type: guest.type,
                mobno: guest.mobno ? guest.mobno : null
              }));

              await handleAPICall(
                'POST',
                '/guest',
                null,
                {
                  cardno: user.cardno,
                  guests: guests
                },
                async (res) => {
                  const updatedGuests = guestForm.guests.map((formGuest) => {
                    const matchingApiGuest = res.guests.find(
                      (apiGuest) => apiGuest.name === formGuest.name
                    );
                    return matchingApiGuest
                      ? { ...formGuest, id: matchingApiGuest.id }
                      : formGuest;
                  });

                  const transformedData = transformGuestData({
                    ...guestForm,
                    guests: updatedGuests
                  });

                  console.log(JSON.stringify(transformedData));

                  await handleAPICall(
                    'POST',
                    '/guest/booking',
                    null,
                    {
                      cardno: user.cardno,
                      transaction_type: 'upi',
                      transaction_ref: '7XAB46098628492',
                      primary_booking: {
                        booking_type: 'food',
                        details: transformedData
                      }
                    },
                    (_data) => {
                      Alert.alert('Booking Successful');
                    },
                    () => {
                      setIsSubmitting(false);
                    }
                  );
                },
                () => {
                  setIsSubmitting(false);
                }
              );
            }}
            containerStyles="mt-7 w-full px-1 min-h-[62px]"
            isLoading={isSubmitting}
          />
        </View>
      )}

      {selectedChip == CHIPS[2] && (
        <View className="w-full flex flex-col">
          <OtherMumukshuForm
            mumukshuForm={mumukshuForm}
            setMumukshuForm={setMumukshuForm}
            handleMumukshuFormChange={handleMumukshuFormChange}
            addMumukshuForm={addMumukshuForm}
            removeMumukshuForm={removeMumukshuForm}
          >
            {(index) => (
              <>
                <CustomMultiSelectDropdown
                  otherStyles="mt-5"
                  text={`Select Meals`}
                  placeholder="Select Meals"
                  data={FOOD_TYPE_LIST}
                  value={mumukshuForm.mumukshus[index].meals}
                  setSelected={(val) =>
                    handleMumukshuFormChange(index, 'meals', val)
                  }
                  guest={true}
                />

                <CustomDropdown
                  otherStyles="mt-5 w-full px-1"
                  text={'Spice Level'}
                  placeholder={'How much spice do you want?'}
                  data={dropdowns.SPICE_LIST}
                  setSelected={(val) =>
                    handleMumukshuFormChange(index, 'spicy', val)
                  }
                  value={mumukshuForm.mumukshus[index].spicy}
                />

                <CustomDropdown
                  otherStyles="mt-5 w-full px-1"
                  text={'Hightea'}
                  placeholder={'Hightea'}
                  data={dropdowns.HIGHTEA_LIST}
                  defaultOption={{ key: 'NONE', value: 'None' }}
                  setSelected={(val) =>
                    handleMumukshuFormChange(index, 'hightea', val)
                  }
                  value={mumukshuForm.mumukshus[index].hightea}
                />
              </>
            )}
          </OtherMumukshuForm>
          <CustomButton
            text="Book Now"
            handlePress={async () => {
              setIsSubmitting(true);
              if (!isMumukshuFormValid()) {
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

function transformGuestData(inputData) {
  const { startDay, endDay, guests } = inputData;

  // Group guests by shared attributes
  const groupedGuests = guests.reduce((acc, guest) => {
    const key = JSON.stringify({
      meals: guest.meals,
      spicy: guest.spicy,
      hightea: guest.hightea
    });

    if (!acc[key]) {
      acc[key] = {
        guests: [],
        meals: guest.meals,
        spicy: guest.spicy,
        high_tea: guest.hightea
      };
    }

    acc[key].guests.push(guest.id);

    return acc;
  }, {});

  // Transform grouped data into an array
  const guestGroup = Object.values(groupedGuests);

  return {
    start_date: startDay,
    end_date: endDay,
    guestGroup
  };
}

export default FoodBooking;
