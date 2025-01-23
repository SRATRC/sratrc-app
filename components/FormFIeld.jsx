import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
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
  containerStyles,
  inputStyles,
  autoCapitalize,
  autoComplete,
  autoCorrect,
  additionalText
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-600 font-pmedium">{text}</Text>
      <View
        className={`focus:border-2 w-full h-16 px-4 space-x-2 rounded-2xl focus:border-secondary items-center flex-row ${
          containerStyles
            ? containerStyles
            : Platform.OS === 'ios'
            ? 'shadow-lg shadow-gray-200 bg-white'
            : 'shadow-2xl shadow-gray-400 bg-white'
        }`}
      >
        <Text className="font-pmedium text-base text-gray-400">{prefix}</Text>
        <TextInput
          className={`flex-1 ${
            inputStyles ? inputStyles : 'font-pregular text-base'
          } `}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          onChangeText={handleChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
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
      {additionalText && (
        <Text className="font-pmedium text-gray-500">
          Name: <Text className="font-pregular">{additionalText}</Text>
        </Text>
      )}
    </View>
  );
};

export default FormField;
