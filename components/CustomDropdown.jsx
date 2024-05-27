import { View, Text } from 'react-native';
import React from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import { colors } from '../constants';

const CustomDropdown = ({
  otherStyles,
  text,
  placeholder,
  data,
  setSelected,
  save
}) => {
  return (
    <View className={`w-full space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-600 font-pmedium">{text}</Text>
      <SelectList
        search={false}
        setSelected={(val) => setSelected(val)}
        data={data}
        save={save ? save : 'key'}
        placeholder={placeholder}
        boxStyles={{
          borderRadius: 12,
          backgroundColor: colors.gray_100,
          borderWidth: 0,
          height: 60,
          alignItems: 'center'
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
