import { View, Text } from 'react-native';
import React from 'react';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { colors } from '../constants';

const CustomMultiSelectDropdown = ({
  otherStyles,
  text,
  placeholder,
  data,
  setSelected
}) => {
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-600 font-pmedium">{text}</Text>
      <MultipleSelectList
        search={false}
        setSelected={(val) => setSelected(val)}
        data={data}
        save="key"
        placeholder={placeholder}
        labelStyles={{
          display: 'none'
        }}
        boxStyles={{
          borderRadius: 12,
          backgroundColor: colors.gray_100,
          borderWidth: 0,
          height: 60,
          alignItems: 'center'
        }}
        inputStyles={{
          color: colors.gray_400,
          fontFamily: 'Poppins-Medium'
        }}
        dropdownStyles={{
          borderRadius: 12,
          backgroundColor: colors.gray_100,
          borderWidth: 0
        }}
        badgeStyles={{
          backgroundColor: colors.gray_400,
          color: colors.gray_400,
          fontFamily: 'Poppins-Medium',
          height: 25,
          alignItems: 'center'
        }}
        dropdownTextStyles={{ color: colors.gray_400 }}
      />
    </View>
  );
};

export default CustomMultiSelectDropdown;
