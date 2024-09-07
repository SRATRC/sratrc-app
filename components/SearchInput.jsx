import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { icons } from '../constants';

const SearchInput = ({
  value,
  placeholder,
  handleChangeText,
  inputStyles,
  autoComplete,
  autoCorrect
}) => {
  return (
    <View
      className={`w-full h-12 px-4 space-x-2 rounded-2xl border border-gray-300 focus:border-2 focus:border-secondary items-center flex-row`}
    >
      <TextInput
        className={`flex-1 ${
          inputStyles ? inputStyles : 'font-pregular text-base'
        } `}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        onChangeText={handleChangeText}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
      />

      <TouchableOpacity>
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
