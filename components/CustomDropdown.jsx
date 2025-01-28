import { View, Text } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../constants';
import AntDesign from '@expo/vector-icons/AntDesign';

const CustomDropdown = ({
  otherStyles,
  text,
  placeholder,
  data,
  setSelected,
  value,
  boxbg = colors.gray_100,
  defaultOption,
  enableSearch,
  save = 'key',
  autofill = false
}) => {
  const renderDropdownItem = (item) => {
    const isSelected = value === item.value;
    return (
      <View
        style={[
          {
            padding: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomColor: '#fdf6e6',
            borderRadius: 12
          },
          isSelected && {
            backgroundColor: '#fdf6e6'
          }
        ]}
      >
        <Text
          style={[
            {
              fontSize: 16,
              fontFamily: 'Poppins-Medium',
              color: colors.gray_400
            },
            isSelected && {
              color: colors.orange,
              fontWeight: '500'
            }
          ]}
        >
          {item.label}
        </Text>
        {isSelected && (
          <AntDesign name="check" size={20} color={colors.orange} />
        )}
      </View>
    );
  };
  return (
    <View className={`w-full space-y-2 ${otherStyles}`}>
      {text && (
        <Text className="text-base text-gray-600 font-pmedium">{text}</Text>
      )}
      {autofill ? (
        <Dropdown
          data={data}
          value={value}
          labelField="label"
          valueField="value"
          onChange={(item) => setSelected(item.value)}
          placeholder={placeholder}
          search={enableSearch ? enableSearch : false}
          searchPlaceholder="Search..."
          autoScroll={false}
          renderItem={renderDropdownItem}
          style={{
            minheight: 60,
            backgroundColor: boxbg,
            borderRadius: 12,
            padding: 16
          }}
          containerStyle={{
            backgroundColor: 'white',
            borderRadius: 12,
            marginTop: 8
          }}
          placeholderStyle={{
            fontSize: 16,
            fontFamily: 'Poppins-Medium',
            color: colors.gray_400
          }}
          selectedTextStyle={{
            fontSize: 16,
            fontFamily: 'Poppins-Medium',
            color: colors.gray_400
          }}
          inputSearchStyle={{
            height: 45,
            fontSize: 16,
            fontFamily: 'Poppins-Medium',
            borderRadius: 12,
            padding: 16
          }}
          itemContainerStyle={{
            backgroundColor: boxbg
          }}
          itemTextStyle={{
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
          save={save}
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
