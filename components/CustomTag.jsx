import { View, Text, Image } from 'react-native';
import React from 'react';

const CustomTag = ({ containerStyles, text, textStyles, icon, iconStyles }) => {
  return (
    <View
      className={`${containerStyles} self-start flex-row space-x-2 px-2 py-1 rounded-lg`}
    >
      {icon && (
        <Image className={`${iconStyles}`} source={icon} resizeMode="contain" />
      )}
      <Text className={`${textStyles} text-sm font-pregular`}>{text}</Text>
    </View>
  );
};

export default CustomTag;
