import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';

const FormField = ({
  text,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  maxLength,
  prefix,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-600 font-pmedium">{text}</Text>
      <View className="focus:border-2 bg-white w-full h-16 px-4 rounded-2xl focus:border-secondary items-center flex-row shadow-lg shadow-gray-200">
        <Text className="font-pregular text-base pr-2">{prefix}</Text>
        <TextInput
          className="flex-1 font-pregular text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          onChangeText={handleChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
          secureTextEntry={text === 'Password' && !showPassword}
        />

        {text === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
