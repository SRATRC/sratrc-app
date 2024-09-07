import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const CustomChipGroup = ({ chips, selectedChip, handleChipPress }) => {
  return (
    <View className="mt-5">
      <FlatList
        data={chips}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`bg-gray-200 rounded-[12px] px-6 py-3 mr-2 ${
              selectedChip === item ? 'bg-secondary' : ''
            }`}
            activeOpacity={1}
            onPress={() => handleChipPress(item)}
          >
            <Text
              className={`font-pmedium ${
                selectedChip === item ? 'text-white' : 'text-gray-400'
              }`}
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
