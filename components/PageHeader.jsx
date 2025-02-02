import { View, Text, Image, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { icons } from '../constants';

const PageHeader = ({ title, icon, onPress }) => {
  const router = useRouter();
  return (
    <View className="w-full px-4 mt-6 flex-row items-center">
      <Pressable onPress={onPress ? onPress : () => router.back()}>
        <Image
          source={icon ? icon : icons.backArrow}
          className={`p-1 mx-2 ${
            Platform.OS == 'android' ? 'w-4 h-4' : 'w-6 h-6'
          }`}
          resizeMode="contain"
          tintColor={'#000000'}
        />
      </Pressable>
      <Text className="text-2xl font-psemibold">{title}</Text>
    </View>
  );
};

export default PageHeader;
