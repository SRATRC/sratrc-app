import { Platform } from 'react-native';

export const generateBoxShadowStyle = (
  xOffset,
  yOffset,
  shadowColorIos,
  shadowOpacity,
  shadowRadius,
  elevation,
  shadowColorAndroid
) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: shadowColorIos,
      shadowOffset: { width: xOffset, height: yOffset },
      shadowOpacity,
      shadowRadius
    };
  } else {
    return {
      elevation,
      shadowColor: shadowColorAndroid
    };
  }
};

// USAGE:

// <View
//   className="flex flex-col bg-white rounded-2xl mt-4"
//   style={[
//     generateBoxShadowStyle(0, 0, colors.gray_400, 0.3, 10, 10, colors.gray_400)
//   ]}
// ></View>;
