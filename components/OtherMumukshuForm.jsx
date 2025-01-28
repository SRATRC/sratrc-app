import { View, Text, Image, TouchableOpacity } from 'react-native';
import { colors, icons } from '../constants';
import { useQueries } from '@tanstack/react-query';
import { useGlobalContext } from '../context/GlobalProvider';
import React from 'react';
import FormField from './FormField';
import handleAPICall from '../utils/HandleApiCall';

const OtherMumukshuForm = ({
  mumukshuForm,
  setMumukshuForm,
  handleMumukshuFormChange,
  addMumukshuForm,
  removeMumukshuForm,
  children = () => null
}) => {
  const { user } = useGlobalContext();

  const verifyMumukshu = async (mobno) => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/mumukshu',
        {
          cardno: user.cardno,
          mobno: mobno
        },
        null,
        (res) => {
          if (res.data) {
            setMumukshuForm((prevForm) => {
              const updatedMumukshus = [...prevForm.mumukshus];
              const mumukshuIndex = updatedMumukshus.findIndex(
                (mumukshu) => mumukshu.mobno === mobno
              );
              if (mumukshuIndex !== -1) {
                updatedMumukshus[mumukshuIndex] = {
                  ...updatedMumukshus[mumukshuIndex],
                  ...res.data,
                  mobno: mobno
                };
              }
              return { ...prevForm, mumukshus: updatedMumukshus };
            });
          }
          resolve(res.data);
        },
        () => reject(new Error('Failed to fetch guests'))
      );
    });
  };

  const mumukshuQueries = useQueries({
    queries: mumukshuForm.mumukshus.map((mumukshu) => ({
      queryKey: ['verifyMumukshus', mumukshu.mobno],
      queryFn: () => verifyMumukshu(mumukshu.mobno),
      enabled: mumukshu.mobno?.length === 10,
      // staleTime: 1000 * 60 * 30,
      retry: false
    }))
  });

  return (
    <View>
      {mumukshuForm.mumukshus.map((mumukshu, index) => {
        const {
          data,
          isLoading: isVerifyMumukshusLoading,
          isError: isVerifyMumukshusError
        } = mumukshu.mobno?.length === 10
          ? mumukshuQueries[index]
          : { data: null, isLoading: false, isError: false };

        console.log('MUMUKSHU: ', JSON.stringify(mumukshu));

        return (
          <View key={index} className="mt-8">
            <View className="flex flex-row justify-between">
              <Text className="font-psemibold text-base underline text-black">
                Details for Mumukshu - {index + 1}
              </Text>
              {index !== 0 && (
                <TouchableOpacity
                  className="mr-3 bg-white"
                  onPress={() => removeMumukshuForm(index)}
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
              value={mumukshu.mobno}
              handleChangeText={(e) =>
                handleMumukshuFormChange(index, 'mobno', e)
              }
              otherStyles="mt-7"
              inputStyles="font-pmedium text-base text-gray-400"
              keyboardType="number-pad"
              placeholder="Enter Mumukshu's Phone Number"
              maxLength={10}
              containerStyles="bg-gray-100"
              additionalText={data?.issuedto}
            />
            {children(index)}
          </View>
        );
      })}
      <TouchableOpacity
        className="w-full justify-start items-center mt-4 flex-row space-x-1"
        onPress={addMumukshuForm}
      >
        <Image
          source={icons.addon}
          tintColor={colors.black}
          className="w-4 h-4"
          resizeMode="contain"
        />
        <Text className="text-base text-black underline">
          Add More Mumukshu's
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OtherMumukshuForm;
