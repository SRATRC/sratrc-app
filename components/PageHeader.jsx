import { View, Text, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { icons } from '../constants';
import { RectButton } from 'react-native-gesture-handler';

const PageHeader = ({ title, icon, onPress }) => {
  const router = useRouter();
  return (
    <View className="w-full px-4 mt-6 flex-row items-center">
      <RectButton
        onPress={onPress ? onPress : () => router.back()}
        activeOpacity={0}
      >
        <Image
          source={icon ? icon : icons.backArrow}
          className={`p-1 mx-2 ${
            Platform.OS == 'android' ? 'w-4 h-4' : 'w-6 h-6'
          }`}
          resizeMode="contain"
          tintColor={'#000000'}
        />
      </RectButton>
      <Text className="text-2xl font-psemibold">{title}</Text>
    </View>
  );
};

export default PageHeader;
