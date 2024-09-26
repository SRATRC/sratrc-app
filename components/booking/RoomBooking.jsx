import { View, Alert, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { colors, icons, types } from '../../constants';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import SegmentedControl from '../../components/SegmentedControl';
import CustomDropdown from '../../components/CustomDropdown';
import CustomButton from '../../components/CustomButton';
import CustomCalender from '../../components/CustomCalender';
import handleAPICall from '../../utils/HandleApiCall';
import CustomModal from '../CustomModal';
import CustomChipGroup from '../../components/CustomChipGroup';
import FormField from '../FormField';

const SWITCH_OPTIONS = ['Select Dates', 'One Day Visit'];

const ROOM_TYPE_LIST = [
  { key: 'ac', value: 'AC' },
  { key: 'nac', value: 'Non AC' }
];

const FLOOR_TYPE_LIST = [
  { key: 'SC', value: 'Yes' },
  { key: 'n', value: 'No' }
];

const GENDER_LIST = [
  { key: 'M', value: 'Male' },
  { key: 'F', value: 'Female' }
];

const GUEST_TYPE_LIST = [
  { key: 'VIP', value: 'VIP' },
  { key: 'Driver', value: 'Driver' },
  { key: 'Friend', value: 'Friend' },
  { key: 'Family', value: 'Family' }
];

const CHIPS = ['Self', 'Guest'];

const suggestions = [
  {
    name: 'Vandit Vasa',
    gender: 'M',
    mobno: '222222222',
    guestType: 'VIP',
    roomType: 'ac',
    floorType: 'n'
  },
  {
    name: 'Amee Vasa',
    gender: 'F',
    mobno: '4345609823',
    guestType: 'Friend',
    roomType: 'nac',
    floorType: 'SC'
  }
];

const RoomBooking = () => {
  const router = useRouter();
  const { user, setData } = useGlobalContext();

  useFocusEffect(
    useCallback(() => {
      setIsSubmitting(false);
    }, [])
  );

  const [selectedChip, setSelectedChip] = useState('Self');
  const handleChipClick = (chip) => {
    setSelectedChip(chip);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [value, setValue] = useState(SWITCH_OPTIONS[0]);

  const [selectedDay, setSelectedDay] = useState();
  const [multiDayForm, setMultiDayForm] = useState({
    startDay: '',
    endDay: '',
    roomType: '',
    floorType: ''
  });

  const [guestForm, setGuestForm] = useState([
    {
      name: '',
      gender: '',
      mobno: '',
      guestType: '',
      roomType: '',
      floorType: ''
    }
  ]);

  const addGuestForm = () => {
    setGuestForm([
      ...guestForm,
      { name: '', mobno: '', guestType: '', floorType: '', roomType: '' }
    ]);
  };

  const handleGuestFormChange = (index, field, value) => {
    const updatedForms = guestForm.map((form, i) =>
      i === index ? { ...form, [field]: value } : form
    );
    setGuestForm(updatedForms);
  };

  const handleSuggestionSelect = (index, suggestion) => {
    const updatedForms = guestForm.map((form, i) =>
      i === index
        ? { ...form, ...suggestion, mobno: suggestion.mobno.toString() }
        : form
    );
    setGuestForm(updatedForms);
  };

  const removeGuestForm = (indexToRemove) => {
    setGuestForm(guestForm.filter((_, index) => index !== indexToRemove));
  };

  const isGuestFormValid = guestForm.every((guest) => {
    if (guest.guestType === 'VIP') {
      return guest.name && guest.guestType && guest.floorType && guest.roomType;
    } else {
      return (
        guest.name &&
        guest.mobno &&
        guest.guestType &&
        guest.floorType &&
        guest.roomType
      );
    }
  });

  return (
    <View className="flex-1 justify-center mt-10">
      <SegmentedControl
        segments={SWITCH_OPTIONS}
        onSegmentChange={(segment) => {
          setValue(segment);
        }}
      />
      {value === SWITCH_OPTIONS[0] && (
        <View>
          <CustomCalender
            type={'period'}
            startDay={multiDayForm.startDay}
            setStartDay={(day) =>
              setMultiDayForm((prev) => ({ ...prev, startDay: day }))
            }
            endDay={multiDayForm.endDay}
            setEndDay={(day) =>
              setMultiDayForm((prev) => ({ ...prev, endDay: day }))
            }
          />

          <View className="w-full mt-7 flex flex-col">
            <Text className="text-base text-gray-600 font-pmedium">
              Book for
            </Text>
            <CustomChipGroup
              chips={CHIPS}
              selectedChip={selectedChip}
              handleChipPress={handleChipClick}
              containerStyles={'mt-1'}
              chipContainerStyles={'py-2'}
              textStyles={'text-sm'}
            />
          </View>

          {selectedChip === CHIPS[0] && (
            <View>
              <CustomDropdown
                otherStyles="mt-7"
                text={'Room Type'}
                placeholder={'Select Room Type'}
                data={ROOM_TYPE_LIST}
                setSelected={(val) =>
                  setMultiDayForm({ ...multiDayForm, roomType: val })
                }
              />

              <CustomDropdown
                otherStyles="mt-7"
                text={'Book Only if Ground Floor is Available'}
                placeholder={'Select Floor Type'}
                data={FLOOR_TYPE_LIST}
                setSelected={(val) =>
                  setMultiDayForm({ ...multiDayForm, floorType: val })
                }
              />

              <CustomButton
                text="Book Now"
                handlePress={async () => {
                  setIsSubmitting(true);
                  if (
                    !multiDayForm.startDay ||
                    !multiDayForm.endDay ||
                    !multiDayForm.roomType ||
                    !multiDayForm.floorType
                  ) {
                    setModalVisible(true);
                    setModalMessage('Please enter all details');
                    setIsSubmitting(false);
                    return;
                  }

                  setData((prev) => {
                    const updated = { ...prev, room: multiDayForm };
                    delete updated.travel;
                    delete updated.adhyayan;
                    delete updated.food;
                    return updated;
                  });
                  router.push(`/booking/${types.ROOM_DETAILS_TYPE}`);
                }}
                containerStyles="mt-7 min-h-[62px]"
                isLoading={isSubmitting}
              />
            </View>
          )}

          {selectedChip === CHIPS[1] && (
            <View>
              {guestForm.map((guestForm, index) => (
                <View key={index} className="mt-8">
                  <View className="flex flex-row justify-between">
                    <Text className="font-psemibold text-base underline text-black">
                      Details for Guest - {index + 1}
                    </Text>
                    {index != 0 && (
                      <TouchableOpacity
                        className="mr-3 bg-white"
                        onPress={() => removeGuestForm(index)}
                      >
                        <Image
                          source={icons.remove}
                          className="w-5 h-5"
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  <FormField
                    text="Guest Name"
                    value={guestForm.name}
                    autoCorrect={false}
                    handleChangeText={(e) =>
                      handleGuestFormChange(index, 'name', e)
                    }
                    otherStyles="mt-4"
                    inputStyles="font-pmedium text-base text-gray-400"
                    containerStyles="bg-gray-100"
                    keyboardType="default"
                    placeholder="Guest Name"
                    suggestions={suggestions.map((s) => s.name)}
                    onSelectItem={(name) => {
                      const selectedSuggestion = suggestions.find(
                        (s) => s.name === name
                      );
                      handleSuggestionSelect(index, selectedSuggestion);
                    }}
                    showAutocomplete={true}
                  />

                  <CustomDropdown
                    otherStyles="mt-7"
                    text={'Gender'}
                    placeholder={'Select Gender'}
                    data={GENDER_LIST}
                    value={guestForm.gender}
                    setSelected={(val) =>
                      handleGuestFormChange(index, 'gender', val)
                    }
                    autofill={true}
                  />

                  <CustomDropdown
                    otherStyles="mt-7"
                    text={'Book Only if Ground Floor is Available'}
                    placeholder={'Select Floor Type'}
                    data={FLOOR_TYPE_LIST}
                    value={guestForm.floorType}
                    setSelected={(val) =>
                      handleGuestFormChange(index, 'floorType', val)
                    }
                    autofill={true}
                  />

                  <CustomDropdown
                    otherStyles="mt-7"
                    text={'Guest Type'}
                    placeholder={'Select Guest Type'}
                    data={GUEST_TYPE_LIST}
                    value={guestForm.guestType}
                    setSelected={(val) =>
                      handleGuestFormChange(index, 'guestType', val)
                    }
                    autofill={true}
                  />

                  {guestForm.guestType &&
                  guestForm.guestType['value'] !== 'VIP' ? (
                    <FormField
                      text="Phone Number"
                      prefix="+91"
                      value={guestForm.mobno}
                      handleChangeText={(e) =>
                        handleGuestFormChange(index, 'mobno', e)
                      }
                      otherStyles="mt-7"
                      inputStyles="font-pmedium text-base text-gray-400"
                      keyboardType="number-pad"
                      placeholder="Enter Your Phone Number"
                      maxLength={10}
                      containerStyles="bg-gray-100"
                    />
                  ) : null}

                  <CustomDropdown
                    otherStyles="mt-7"
                    text={'Room Type'}
                    placeholder={'Select Room Type'}
                    data={ROOM_TYPE_LIST}
                    value={guestForm.roomType}
                    setSelected={(val) =>
                      handleGuestFormChange(index, 'roomType', val)
                    }
                    autofill={true}
                  />
                </View>
              ))}
              <TouchableOpacity
                className="w-full justify-start items-center mt-4 flex-row space-x-1"
                onPress={addGuestForm}
              >
                <Image
                  source={icons.addon}
                  tintColor={colors.black}
                  className="w-4 h-4"
                  resizeMode="contain"
                />
                <Text className="text-base text-black underline">
                  Add More Guests
                </Text>
              </TouchableOpacity>

              <CustomButton
                text="Book Now"
                handlePress={async () => {
                  setIsSubmitting(true);
                  if (!isGuestFormValid) {
                    setIsSubmitting(false);
                    setModalMessage('Please fill all fields');
                    setModalVisible(true);
                    return;
                  }
                }}
                containerStyles="mt-7 min-h-[62px]"
                isLoading={isSubmitting}
              />
            </View>
          )}
        </View>
      )}

      {value === SWITCH_OPTIONS[1] && (
        <View>
          <CustomCalender
            selectedDay={selectedDay}
            setSelectedDay={(day) => setSelectedDay(day)}
          />

          <CustomButton
            text="Book Now"
            handlePress={async () => {
              if (!selectedDay) {
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
                '/stay/room',
                null,
                {
                  cardno: user.cardno,
                  checkin_date: selectedDay,
                  checkout_date: selectedDay
                },
                onSuccess,
                onFinally
              );
            }}
            containerStyles="mt-10 min-h-[62px]"
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

export default RoomBooking;
