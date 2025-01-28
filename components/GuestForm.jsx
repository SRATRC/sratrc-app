import { View, Text, Image, TouchableOpacity } from 'react-native';
import { colors, icons, dropdowns } from '../constants';
import { useQueries } from '@tanstack/react-query';
import { useGlobalContext } from '../context/GlobalProvider';
import React from 'react';
import CustomDropdown from './CustomDropdown';
import FormField from './FormField';
import handleAPICall from '../utils/HandleApiCall';

const GuestForm = ({
  guestForm,
  setGuestForm,
  handleGuestFormChange,
  addGuestForm,
  removeGuestForm,
  children = () => null
}) => {
  const { user } = useGlobalContext();

  const verifyGuest = async (mobno) => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        `/guest/check/${mobno}`,
        {
          cardno: user.cardno
        },
        null,
        (res) => {
          if (res.data) {
            setGuestForm((prevForm) => {
              const updatedGuests = [...prevForm.guests];
              const guestIndex = updatedGuests.findIndex(
                (guest) => guest.mobno === mobno
              );
              if (guestIndex !== -1) {
                updatedGuests[guestIndex] = {
                  ...updatedGuests[guestIndex],
                  ...res.data
                };
              }
              return { ...prevForm, guests: updatedGuests };
            });
          }
          resolve(res.data);
        },
        () => reject(new Error('Failed to fetch guests'))
      );
    });
  };

  const guestQueries = useQueries({
    queries: guestForm.guests.map((guest) => ({
      queryKey: ['verifyGuests', guest.mobno],
      queryFn: () => verifyGuest(guest.mobno),
      enabled: guest.mobno?.length === 10,
      // staleTime: 1000 * 60 * 30,
      retry: false
    }))
  });

  return (
    <View>
      {guestForm.guests.map((guest, index) => {
        const {
          data,
          isLoading: isVerifyGuestsLoading,
          isError: isVerifyGuestsError
        } = guest.mobno?.length === 10
          ? guestQueries[index]
          : { data: null, isLoading: false, isError: false };

        return (
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
              text="Phone Number"
              value={guest.mobno}
              handleChangeText={(e) => handleGuestFormChange(index, 'mobno', e)}
              otherStyles="mt-7"
              inputStyles="font-pmedium text-base text-gray-400"
              keyboardType="number-pad"
              placeholder="Enter Guest Phone Number"
              maxLength={10}
              containerStyles="bg-gray-100"
              additionalText={data?.name}
            />

            {!data && !isVerifyGuestsLoading && guest.mobno?.length == 10 && (
              <View>
                <FormField
                  text="Guest Name"
                  value={guest.name}
                  autoCorrect={false}
                  handleChangeText={(e) =>
                    handleGuestFormChange(index, 'name', e)
                  }
                  otherStyles="mt-4"
                  inputStyles="font-pmedium text-base text-gray-400"
                  containerStyles="bg-gray-100"
                  keyboardType="default"
                  placeholder="Guest Name"
                />

                <CustomDropdown
                  otherStyles="mt-7"
                  text={'Gender'}
                  placeholder={'Select Gender'}
                  data={dropdowns.GENDER_LIST}
                  value={guest.gender}
                  setSelected={(val) =>
                    handleGuestFormChange(index, 'gender', val)
                  }
                />

                <CustomDropdown
                  otherStyles="mt-7"
                  text={'Guest Type'}
                  placeholder={'Select Guest Type'}
                  data={dropdowns.GUEST_TYPE_LIST}
                  value={guest.type}
                  setSelected={(val) =>
                    handleGuestFormChange(index, 'type', val)
                  }
                />
              </View>
            )}
            {children(index)}
          </View>
        );
      })}
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
