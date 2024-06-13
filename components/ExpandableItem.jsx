import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { useState } from 'react';
import { icons } from '../constants';

const ExpandableItem = ({
  children,
  item,
  containerStyles,
  backgroundColor,
  shadowShown
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
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
        <View className="flex flex-row items-center space-x-4">
          {item.icon && (
            <Image
              source={item.icon}
              className="w-10 h-10"
              resizeMode="contain"
            />
          )}
          <Text className="font-pmedium">{item.title}</Text>
        </View>
        <View className="bg-gray-100 items-center justify-center rounded-md w-8 h-8">
          {expanded ? (
            <Image
              source={icons.collapseArrow}
              className="w-4 h-4"
              resizeMode="contain"
            />
          ) : (
            <Image
              source={icons.expandArrow}
              className="w-4 h-4"
              resizeMode="contain"
            />
          )}
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
