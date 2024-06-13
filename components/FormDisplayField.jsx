import { View, Text, Platform } from 'react-native';

const FormDisplayField = ({
  text,
  value,
  backgroundColor,
  otherStyles,
  displayViewStyles,
  ...props
}) => {
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-600 font-pmedium">{text}</Text>
      <View
        className={`focus:border-2 w-full h-16 px-4 rounded-2xl focus:border-secondary items-center flex-row ${displayViewStyles} ${
          backgroundColor
            ? backgroundColor
            : Platform.OS === 'ios'
            ? 'shadow-lg shadow-gray-200 bg-white'
            : 'shadow-2xl shadow-gray-400 bg-white'
        }`}
      >
        <Text
          className="font-pmedium text-base text-gray-400"
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

export default FormDisplayField;
