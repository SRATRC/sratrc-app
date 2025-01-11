import { View, Alert, Text } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { types, dropdowns } from '../../constants';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import SegmentedControl from '../../components/SegmentedControl';
import CustomDropdown from '../../components/CustomDropdown';
import CustomButton from '../../components/CustomButton';
import CustomCalender from '../../components/CustomCalender';
import handleAPICall from '../../utils/HandleApiCall';
import CustomModal from '../CustomModal';
import CustomChipGroup from '../../components/CustomChipGroup';
import GuestForm from '../GuestForm';

const SWITCH_OPTIONS = ['Select Dates', 'One Day Visit'];

const ROOM_TYPE_LIST = [
  { key: 'ac', value: 'AC' },
  { key: 'nac', value: 'Non AC' }
];

const FLOOR_TYPE_LIST = [
  { key: 'SC', value: 'Yes' },
  { key: 'n', value: 'No' }
];

const CHIPS = ['Self', 'Guest'];

const INITIAL_GUEST_FORM = {
  startDay: '',
  endDay: '',
  guests: [
    {
      name: '',
      gender: '',
      mobno: '',
      type: '',
      roomType: '',
      floorType: ''
    }
  ]
};

const RoomBooking = () => {
  const router = useRouter();
  const { user, updateBooking, updateGuestBooking } = useGlobalContext();

  useEffect(
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

  const [guestForm, setGuestForm] = useState(INITIAL_GUEST_FORM);

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
          roomType: '',
          floorType: ''
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
    if (!multiDayForm.startDay) {
      return false;
    }

    return guestForm.guests.every((guest) => {
      const commonFields =
        guest.name &&
        guest.gender &&
        guest.type &&
        guest.roomType &&
        guest.floorType;

      if (guest.type === 'vip' || guest.type === 'driver') {
        return commonFields;
      } else {
        return commonFields && guest.mobno;
      }
    });
  };

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
            setStartDay={(day) => {
              setMultiDayForm((prev) => ({ ...prev, startDay: day }));
              setGuestForm((prev) => ({ ...prev, startDay: day }));
            }}
            endDay={multiDayForm.endDay}
            setEndDay={(day) => {
              setMultiDayForm((prev) => ({ ...prev, endDay: day }));
              setGuestForm((prev) => ({ ...prev, endDay: day }));
            }}
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

                  await updateBooking('room', multiDayForm);
                  router.push(`/booking/${types.ROOM_DETAILS_TYPE}`);
                }}
                containerStyles="mt-7 min-h-[62px]"
                isLoading={isSubmitting}
              />
            </View>
          )}
          {/* FIXME: why does guestType and gender values disappear when
          navigating back to room booking? */}
          {selectedChip === CHIPS[1] && (
            <View>
              <GuestForm
                guestForm={guestForm}
                handleGuestFormChange={handleGuestFormChange}
                addGuestForm={addGuestForm}
                removeGuestForm={removeGuestForm}
                handleSuggestionSelect={handleSuggestionSelect}
              >
                {(index) => (
                  <>
                    <CustomDropdown
                      otherStyles="mt-7"
                      text={'Room Type'}
                      placeholder={'Select Room Type'}
                      data={dropdowns.ROOM_TYPE_LIST}
                      value={guestForm.guests[index].roomType}
                      setSelected={(val) =>
                        handleGuestFormChange(index, 'roomType', val)
                      }
                      autofill={true}
                    />

                    <CustomDropdown
                      otherStyles="mt-7"
                      text={'Book Only if Ground Floor is Available'}
                      placeholder={'Select Floor Type'}
                      data={dropdowns.FLOOR_TYPE_LIST}
                      value={guestForm.guests[index].floorType}
                      setSelected={(val) =>
                        handleGuestFormChange(index, 'floorType', val)
                      }
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
                  } else {
                    await handleAPICall(
                      'POST',
                      '/guest',
                      null,
                      {
                        cardno: user.cardno,
                        guests: guestForm.guests
                      },
                      async (res) => {
                        guestForm.guests = res.guests.map((guest) => ({
                          ...guest,
                          roomType: guestForm.guests[0]?.roomType || '',
                          floorType: guestForm.guests[0]?.floorType || ''
                        }));
                        updateGuestBooking('room', guestForm);
                        setIsSubmitting(false);
                        // setGuestForm(INITIAL_GUEST_FORM);
                        router.push(`/guestBooking/${types.ROOM_DETAILS_TYPE}`);
                      },
                      () => {
                        setIsSubmitting(false);
                      }
                    );
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
