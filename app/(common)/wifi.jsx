import {
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Platform,
  Image
} from 'react-native';
import { useState, useCallback } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useQuery } from '@tanstack/react-query';
import { colors, icons } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import PageHeader from '../../components/PageHeader';
import handleAPICall from '../../utils/HandleApiCall';
import CustomButton from '../../components/CustomButton';
import HorizontalSeparator from '../../components/HorizontalSeparator';
import moment from 'moment';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import CustomEmptyMessage from '../../components/CustomEmptyMessage';
import CustomErrorMessage from '../../components/CustomErrorMessage';

const wifi = () => {
  const { user } = useGlobalContext();

  if (!user) {
    return (
      <SafeAreaView className="h-full bg-white items-center justify-center">
        <ActivityIndicator size="large" color={colors.orange} />
      </SafeAreaView>
    );
  }

  if (!user.cardno) {
    return (
      <SafeAreaView className="h-full bg-white items-center justify-center">
        <Text className="text-red-500 text-lg font-pregular">
          Missing card number
        </Text>
      </SafeAreaView>
    );
  }

  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWifiPasswords = async () => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/wifi',
        {
          cardno: user.cardno
        },
        null,
        (res) => {
          resolve(Array.isArray(res.data) ? res.data : []);
        },
        () => reject(new Error('Failed to fetch wifi passwords'))
      );
    });
  };

  const {
    isLoading,
    isError,
    error,
    data: wifiList,
    refetch
  } = useQuery({
    queryKey: ['wifi', user.cardno],
    queryFn: fetchWifiPasswords,
    staleTime: 1000 * 60 * 30,
    enabled: !!user.cardno
  });

  const generateNewWifiCode = async () => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/wifi/generate',
        { cardno: user.cardno },
        null,
        (res) => {
          resolve(res.data);
        },
        () => reject(new Error('Failed to generate new wifi code'))
      );
    });
  };

  const handleGenerateCode = async () => {
    setIsSubmitting(true);
    try {
      const newCode = await generateNewWifiCode();
      wifiList.push(newCode);
      refetch();
    } catch (error) {
      console.error('Error generating new WiFi code:', error);
    } finally {
      if (wifiList.length < 4) setIsSubmitting(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const renderItem = ({ item }) => {
    const copyToClipboard = async (text) => {
      await Clipboard.setStringAsync(text);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
      <View
        className={`bg-white mt-3 p-4 rounded-2xl ${
          Platform.OS === 'ios'
            ? 'shadow-lg shadow-gray-200'
            : 'shadow-2xl shadow-gray-400'
        }`}
      >
        <View className="flex flex-row justify-between">
          <View className="flex flex-row items-center space-x-2">
            <Text className="text-gray-400 font-pregular">WiFi Code: </Text>
            <Text className="text-black font-pmedium">{item.password}</Text>
          </View>
          <TouchableOpacity onPress={() => copyToClipboard(item.password)}>
            <Image
              source={icons.copy}
              className="w-5 h-5"
              resizeMode="contain"
              tintColor={colors.gray_400}
            />
          </TouchableOpacity>
        </View>
        <HorizontalSeparator otherStyles={'my-4'} />
        <View className="flex flex-col space-y-2">
          <View className="flex flex-row items-center space-x-2">
            <Text className="text-gray-400 font-pregular">Generated on:</Text>
            <Text className="text-black font-pmedium">
              {moment(item.createdAt).format('Do MMMM, YYYY')}
            </Text>
          </View>
          <View className="flex flex-row items-center space-x-2">
            <Text className="text-gray-400 font-pregular">Valid Till:</Text>
            <Text className="text-black font-pmedium">
              {moment(item.createdAt).add(15, 'days').format('Do MMMM, YYYY')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      {wifiList?.length > 0 && (
        <View>
          <Text className="text-gray-400 font-psemibold text-sm">
            {wifiList?.length}/4 Codes Generated
          </Text>
        </View>
      )}
    </View>
  );

  const renderFooter = () => (
    <View className="w-full h-full">
      {isLoading && (
        <View className="items-center justify-center">
          <ActivityIndicator />
        </View>
      )}
      {wifiList?.length == 0 ? (
        <View className="w-full h-full flex flex-col px-4 items-center justify-center space-y-6">
          <CustomEmptyMessage
            lottiePath={require('../../assets/lottie/empty.json')}
            message={'No WiFi code generated Yet!'}
          />
          <CustomButton
            text={'Generate new Code'}
            handlePress={handleGenerateCode}
            containerStyles={'px-4 py-2 mt-10 min-h-[56px]'}
            textStyles={'text-base font-pregular'}
            isLoading={isSubmitting}
          />
        </View>
      ) : (
        !isLoading && (
          <CustomButton
            text={'Generate WiFi Code'}
            handlePress={handleGenerateCode}
            containerStyles={'px-4 py-2 mt-10 min-h-[56px]'}
            textStyles={'text-base font-pregular'}
            isLoading={isSubmitting || wifiList?.length >= 4}
          />
        )
      )}
    </View>
  );

  if (isError)
    return (
      <SafeAreaView className="h-full bg-white">
        <PageHeader title={'Wifi Passwords'} icon={icons.backArrow} />
        <CustomErrorMessage />
      </SafeAreaView>
    );
  return (
    <SafeAreaView className="h-full bg-white">
      <PageHeader title={'Wifi Passwords'} icon={icons.backArrow} />
      <FlashList
        className="flex-grow-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 32 }}
        data={wifiList}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={100}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default wifi;
