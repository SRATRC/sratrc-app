import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const SegmentedControl = ({ segments, onSegmentChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const translateValue = useRef(new Animated.Value(0)).current;

  const segmentWidth = (width - 32) / segments.length;

  const handlePress = (segment, index) => {
    setSelectedIndex(index);
    onSegmentChange(segment);

    Animated.timing(translateValue, {
      toValue: index * segmentWidth,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  useEffect(() => {
    translateValue.setValue(selectedIndex * segmentWidth);
  }, [segmentWidth]);

  return (
    <View className="flex-row bg-gray-200 rounded-3xl p-1 relative">
      <Animated.View
        className="absolute top-1 bottom-1 bg-white rounded-3xl"
        style={{
          width: segmentWidth - 16,
          transform: [{ translateX: translateValue }],
          marginHorizontal: 8,
          marginVertical: 1
        }}
      />

      {segments.map((segment, index) => (
        <TouchableOpacity
          key={index}
          className="justify-center items-center py-2 rounded-3xl"
          style={{ width: segmentWidth }}
          onPress={() => handlePress(segment, index)}
        >
          <Text className="text-sm text-black font-pregular text-center">
            {segment}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SegmentedControl;
