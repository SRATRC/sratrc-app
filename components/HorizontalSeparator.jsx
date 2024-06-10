import { View, Text } from 'react-native';
import React from 'react';

const HorizontalSeparator = ({ otherStyles }) => {
  return (
    <View
      className={`flex-grow border-t border-gray-200 ${otherStyles}`}
    ></View>
  );
};

export default HorizontalSeparator;
