import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { icons } from '../constants';

const PageHeader = ({ title, icon, onPress }) => {
  const router = useRouter();
  return (
    <View className="w-full px-4 mt-6 flex-row items-center">
      <TouchableOpacity onPress={onPress ? onPress : () => router.back()}>
        <Image
          source={icon ? icon : icons.backArrow}
          className="w-9 h-9 p-2 ml-2 mr-4"
          resizeMode="contain"
          tintColor={'#000000'}
        />
      </TouchableOpacity>
      <Text className="text-2xl font-psemibold">{title}</Text>
    </View>
  );
};

export default PageHeader;
