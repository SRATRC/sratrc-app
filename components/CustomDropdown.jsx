import { View, Text } from 'react-native';
import React from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../constants';

const CustomDropdown = ({
  otherStyles,
  text,
  placeholder,
  data,
  setSelected,
  value,
  boxbg,
  defaultOption,
  enableSearch,
  save,
  autofill = false
}) => {
  return (
    <View className={`w-full space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-600 font-pmedium">{text}</Text>
      {autofill ? (
        <Dropdown
          className="p-3"
          data={data}
          value={value}
          onChange={(val) => setSelected(val)}
          labelField="value"
          valueField="key"
          placeholder={placeholder}
          search={enableSearch ? enableSearch : false}
          searchPlaceholder="Search..."
          defaultOption={defaultOption ? defaultOption : null}
          autoScroll={false}
          style={{
            backgroundColor: boxbg ? boxbg : colors.gray_100,
            height: 60,
            alignItems: 'center',
            borderRadius: 10
          }}
          containerStyle={{
            borderWidth: 1,
            shadowRadius: 0,
            shadowOpacity: 0
          }}
          itemContainerStyle={{
            backgroundColor: boxbg ? boxbg : colors.gray_100
          }}
          itemTextStyle={{
            color: colors.gray_400,
            fontFamily: 'Poppins-Medium',
            fontSize: 16
          }}
          inputSearchStyle={{
            color: colors.gray_400,
            fontFamily: 'Poppins-Medium',
            fontSize: 16,
            backgroundColor: colors.gray_100,
            borderWidth: 0
          }}
          selectedTextStyle={{
            color: colors.gray_400,
            fontFamily: 'Poppins-Medium',
            fontSize: 16
          }}
          placeholderStyle={{
            color: colors.gray_400,
            fontFamily: 'Poppins-Medium',
            fontSize: 16
          }}
        />
      ) : (
        <SelectList
          search={enableSearch ? enableSearch : false}
          setSelected={(val) => setSelected(val)}
          data={data}
          save={save ? save : 'key'}
          placeholder={placeholder}
          defaultOption={defaultOption ? defaultOption : null}
          boxStyles={{
            borderRadius: 12,
            backgroundColor: boxbg ? boxbg : colors.gray_100,
            borderWidth: 0,
            height: 60,
            alignItems: 'center'
          }}
          inputStyles={{
            color: colors.gray_400,
            fontFamily: 'Poppins-Medium',
            fontSize: 16,
            flex: 1,
            paddingEnd: 4
          }}
          dropdownStyles={{
            borderRadius: 12,
            backgroundColor: boxbg ? boxbg : colors.gray_100,
            borderWidth: 0
          }}
          dropdownTextStyles={{
            color: colors.gray_400,
            fontFamily: 'Poppins-Medium',
            fontSize: 16
          }}
          maxHeight={data?.length * 50 < 150 ? data?.length * 50 : 150}
        />
      )}
    </View>
  );
};

export default CustomDropdown;
