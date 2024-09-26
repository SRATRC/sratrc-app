import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Platform
} from 'react-native';
import { colors } from '../constants';

const FormField = ({
  text,
  value,
  placeholder,
  handleChangeText,
  suggestions = [],
  onSelectItem,
  otherStyles,
  keyboardType,
  maxLength,
  prefix,
  containerStyles,
  inputStyles,
  autoCapitalize,
  autoComplete,
  autoCorrect,
  multiline = false,
  minHeight = 60,
  maxHeight = 120,
  showAutocomplete = false
}) => {
  const [query, setQuery] = useState(value || '');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleTextChange = (input) => {
    setQuery(input);
    handleChangeText(input);
    if (showAutocomplete && input.length > 0) {
      setFilteredSuggestions(
        suggestions.filter((item) =>
          item.toLowerCase().includes(input.toLowerCase())
        )
      );
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSelectItem = (item) => {
    setQuery(item);
    setFilteredSuggestions([]);
    onSelectItem(item);
    Keyboard.dismiss();
  };

  const containerStyle = containerStyles
    ? containerStyles
    : Platform.OS === 'ios'
    ? 'shadow-lg shadow-gray-200 bg-white'
    : 'shadow-2xl shadow-gray-400 bg-white';

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-600 font-pmedium">{text}</Text>
      <View
        className={`focus:border-2 w-full ${
          multiline ? 'h-auto' : 'h-16'
        } px-4 space-x-2 rounded-2xl focus:border-secondary items-center flex-row ${containerStyle}`}
      >
        {prefix && (
          <Text className="font-pmedium text-base text-gray-400">{prefix}</Text>
        )}
        <TextInput
          className={`flex-1 ${inputStyles || 'font-pmedium text-base'} ${
            multiline ? 'text-start' : ''
          }`}
          value={query}
          placeholder={placeholder}
          placeholderTextColor={colors.gray_400}
          onChangeText={handleTextChange}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={() => setIsFocused(true)}
          style={{
            minHeight: multiline ? minHeight : undefined,
            maxHeight: multiline ? maxHeight : undefined
          }}
        />
      </View>

      {showAutocomplete && filteredSuggestions.length > 0 && isFocused && (
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.gray_200,
            borderRadius: 10,
            marginTop: 5,
            backgroundColor: colors.gray_100,
            zIndex: 1
          }}
        >
          <FlatList
            data={filteredSuggestions}
            keyExtractor={(_item, index) => index.toString()}
            keyboardShouldPersistTaps="always"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectItem(item)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15
                }}
              >
                <Text className="font-pregular text-base">{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default FormField;
