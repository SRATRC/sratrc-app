import { View, Text } from 'react-native';
import React from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import { colors } from '../constants';

const CustomDropdown = ({
  otherStyles,
  text,
  placeholder,
  data,
  setSelected
}) => {
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-600 font-pmedium">{text}</Text>
      <SelectList
        search={false}
        setSelected={(val) => setSelected(val)}
        data={data}
        save="value"
        placeholder={placeholder}
        boxStyles={{
          borderRadius: 12,
          backgroundColor: colors.gray_100,
          borderWidth: 0
        }}
        inputStyles={{ color: colors.gray_400, fontFamily: 'Poppins-Medium' }}
        dropdownStyles={{
          borderRadius: 12,
          backgroundColor: colors.gray_100,
          borderWidth: 0
        }}
        dropdownTextStyles={{ color: colors.gray_400 }}
        maxHeight={data.length * 50 < 150 ? data.length * 50 : 150}
      />
    </View>
  );
};

export default CustomDropdown;
