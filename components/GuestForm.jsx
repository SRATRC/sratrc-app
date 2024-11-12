import { View, Text, Image, TouchableOpacity } from 'react-native';
import { colors, icons } from '../constants';
import React from 'react';
import CustomDropdown from './CustomDropdown';
import FormField from './FormField';

const GENDER_LIST = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' }
];

const GUEST_TYPE_LIST = [
  { label: 'Driver', value: 'Driver' },
  { label: 'VIP', value: 'VIP' },
  { label: 'Friend', value: 'Friend' },
  { label: 'Family', value: 'Family' }
];

const suggestions = [
  {
    name: 'Vandit Vasa',
    gender: 'M',
    mobno: '',
    guestType: 'VIP'
  },
  {
    name: 'Amee Vasa',
    gender: 'F',
    mobno: '4345609823',
    guestType: 'Friend'
  }
];

const GuestForm = ({
  guestForm,
  handleGuestFormChange,
  addGuestForm,
  removeGuestForm,
  handleSuggestionSelect,
  children = () => null
}) => {
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
            value={guest.gender}
            setSelected={(val) => handleGuestFormChange(index, 'gender', val)}
            autofill={true}
          />

          <CustomDropdown
            otherStyles="mt-7"
            text={'Guest Type'}
            placeholder={'Select Guest Type'}
            data={GUEST_TYPE_LIST}
            value={guest.guestType}
            setSelected={(val) =>
              handleGuestFormChange(index, 'guestType', val)
            }
            autofill={true}
          />

          {guest.guestType &&
            guest.guestType !== 'VIP' &&
            guest.guestType.key !== 'VIP' && (
              <FormField
                text="Phone Number"
                prefix="+91"
                value={guest.mobno}
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
