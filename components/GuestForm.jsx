import { View, Text, Image, TouchableOpacity } from 'react-native';
import { colors, icons } from '../constants';
import { useQuery } from '@tanstack/react-query';
import { useGlobalContext } from '../context/GlobalProvider';
import React from 'react';
import CustomDropdown from './CustomDropdown';
import FormField from './FormField';
import handleAPICall from '../utils/HandleApiCall';

const GENDER_LIST = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' }
];

const GUEST_TYPE_LIST = [
  { label: 'Driver', value: 'driver' },
  { label: 'VIP', value: 'vip' },
  { label: 'Friend', value: 'friend' },
  { label: 'Family', value: 'family' }
];

const GuestForm = ({
  guestForm,
  handleGuestFormChange,
  addGuestForm,
  removeGuestForm,
  handleSuggestionSelect,
  children = () => null
}) => {
  const { user } = useGlobalContext();

  const fetchGuests = async () => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/guest',
        {
          cardno: user.cardno
        },
        null,
        (res) => {
          resolve(res.data);
        },
        () => reject(new Error('Failed to fetch guests'))
      );
    });
  };

  const {
    data: suggestions,
    isLoading: isGuestsLoading,
    isError: isGuestsError
  } = useQuery({
    queryKey: ['guests', user.cardno],
    queryFn: fetchGuests
  });

  if (isGuestsLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="font-pmedium text-gray-400">
          Loading guest data...
        </Text>
      </View>
    );
  }

  if (isGuestsError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="font-pmedium text-red-500">
          Failed to load guest data. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {guestForm.guests.map((guest, index) => (
        <View key={index} className="mt-8">
          <View className="flex flex-row justify-between">
            <Text className="font-psemibold text-base underline text-black">
              Details for Guest - {index + 1}
            </Text>
            {index !== 0 && (
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
            value={guest.name}
            autoCorrect={false}
            handleChangeText={(e) => handleGuestFormChange(index, 'name', e)}
            otherStyles="mt-4"
            inputStyles="font-pmedium text-base text-gray-400"
            containerStyles="bg-gray-100"
            keyboardType="default"
            placeholder="Guest Name"
            suggestions={suggestions?.map((s) => s.name)}
            onSelectItem={(name) => {
              const selectedSuggestion = suggestions?.find(
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
            value={guest.gender}
            setSelected={(val) => handleGuestFormChange(index, 'gender', val)}
            autofill={true}
          />

          <CustomDropdown
            otherStyles="mt-7"
            text={'Guest Type'}
            placeholder={'Select Guest Type'}
            data={GUEST_TYPE_LIST}
            value={guest.type}
            setSelected={(val) => handleGuestFormChange(index, 'type', val)}
            autofill={true}
          />

          {guest.type && guest.type !== 'vip' && guest.type !== 'driver' && (
            <FormField
              text="Phone Number"
              // prefix="+91"
              value={guest.mobno}
              handleChangeText={(e) => handleGuestFormChange(index, 'mobno', e)}
              otherStyles="mt-7"
              inputStyles="font-pmedium text-base text-gray-400"
              keyboardType="number-pad"
              placeholder="Enter Guest Phone Number"
              maxLength={10}
              containerStyles="bg-gray-100"
            />
          )}
          {children(index)}
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
        <Text className="text-base text-black underline">Add More Guests</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GuestForm;
