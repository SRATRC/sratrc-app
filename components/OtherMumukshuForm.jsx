import { View, Text, Image, TouchableOpacity } from 'react-native';
import { colors, icons } from '../constants';
import { useQuery } from '@tanstack/react-query';
import { useGlobalContext } from '../context/GlobalProvider';
import React from 'react';
import FormField from './FormField';
import handleAPICall from '../utils/HandleApiCall';

const OtherMumukshuForm = ({
  mumukshuForm,
  handleMumukshuFormChange,
  addMumukshuForm,
  removeMumukshuForm,
  children = () => null
}) => {
  const { user } = useGlobalContext();

  return (
    <View>
      {mumukshuForm.mumukshus.map((mumukshu, index) => (
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
          />
          {children(index)}
        </View>
      ))}
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
