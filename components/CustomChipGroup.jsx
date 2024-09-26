import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const CustomChipGroup = ({
  chips,
  selectedChip,
  handleChipPress,
  containerStyles,
  chipContainerStyles,
  textStyles
}) => {
  return (
    <View className={`mt-5 ${containerStyles}`}>
      <FlatList
        data={chips}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`bg-gray-200 rounded-[12px] px-6 py-3 mr-2 ${
              selectedChip === item ? 'bg-secondary' : ''
            } ${chipContainerStyles}`}
            activeOpacity={1}
            onPress={() => handleChipPress(item)}
          >
            <Text
              className={`font-pmedium ${
                selectedChip === item ? 'text-white' : 'text-gray-400'
              } ${textStyles}`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CustomChipGroup;
