import { View, TouchableOpacity, Image, Platform } from 'react-native';
import { useState } from 'react';
import { icons } from '../constants';
import * as Haptics from 'expo-haptics';

const AddonItem = ({
  children,
  visibleContent,
  containerStyles,
  backgroundColor,
  shadowShown,
  onCollapse
}) => {
  const [selected, setSelected] = useState(false);

  const toggleSelection = () => {
    setSelected(!selected);
    if (onCollapse) onCollapse();
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
      <View className="overflow-hidden flex-row justify-between">
        <View className="flex-1 flex-row items-center space-x-4">
          {visibleContent}
        </View>
        <TouchableOpacity
          onPress={toggleSelection}
          className="items-center justify-center"
        >
          <Image
            source={selected ? icons.remove : icons.addon}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View
        className={`${containerStyles}`}
        style={{ display: selected ? 'flex' : 'none' }}
      >
        {children}
      </View>
    </View>
  );
};

export default AddonItem;
