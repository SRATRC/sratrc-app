import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';

const CustomChipGroup = ({ chips, selectedChip, handleChipPress }) => {
  return (
    <View>
      <ScrollView
        className="flex flex-row flex-wrap mt-5"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {chips.map((chip, index) => (
          <TouchableOpacity
            key={index}
            className={`bg-gray-200 rounded-[8px] px-6 py-3 mr-2 ${
              selectedChip === chip ? 'bg-secondary' : ''
            }`}
            activeOpacity={1}
            onPress={() => handleChipPress(chip)}
          >
            <Text
              className={`font-pmedium ${
                selectedChip === chip ? 'text-white' : 'text-gray-400'
              }`}
            >
              {chip}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CustomChipGroup;
