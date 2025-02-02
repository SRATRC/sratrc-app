import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { useState } from 'react';
import { icons } from '../constants';
import * as Haptics from 'expo-haptics';

const ExpandableItem = ({
  children,
  visibleContent,
  containerStyles,
  backgroundColor,
  shadowShown,
  onToggle
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    if (onToggle) {
      onToggle(newExpandedState);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View
      className={`mb-5 p-3 rounded-2xl ${
        shadowShown == false
          ? ''
          : Platform.OS === 'ios'
          ? 'shadow-lg shadow-gray-200'
          : 'shadow-2xl shadow-gray-400'
      } ${backgroundColor ? backgroundColor : 'bg-white'}`}
    >
      <TouchableOpacity
        onPress={toggleExpand}
        className="overflow-hidden flex-row justify-between"
      >
        <View className="flex-1 flex-row items-center space-x-4">
          {visibleContent}
        </View>
        <View className="bg-gray-100 items-center justify-center rounded-md w-8 h-8">
          <Image
            source={expanded ? icons.collapseArrow : icons.expandArrow}
            className="w-4 h-4"
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
      <View
        className={`${containerStyles}`}
        style={{ display: expanded ? 'flex' : 'none' }}
      >
        {children}
      </View>
    </View>
  );
};

export default ExpandableItem;
