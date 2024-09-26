import {
  View,
  Text,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInfiniteQuery } from '@tanstack/react-query';
import { colors, icons, status, types } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import PageHeader from '../../components/PageHeader';
import handleAPICall from '../../utils/HandleApiCall';
import CustomChipGroup from '../../components/CustomChipGroup';
import LottieView from 'lottie-react-native';
import CustomTag from '../../components/CustomTag';
import ExpandableItem from '../../components/ExpandableItem';
import HorizontalSeparator from '../../components/HorizontalSeparator';
import moment from 'moment';

const CHIPS = [
  types.MAINTENANCE_TYPE_ALL,
  types.MAINTENANCE_TYPE_OPEN,
  types.MAINTENANCE_TYPE_CLOSED
];

const maintenanceRequestList = () => {
  const { user } = useGlobalContext();
  const router = useRouter();

  const [selectedChip, setSelectedChip] = useState(types.MAINTENANCE_TYPE_ALL);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMaintenance = async ({ pageParam = 1 }) => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/maintenance',
        {
          cardno: user.cardno,
          page: pageParam,
          status: selectedChip
        },
        null,
        (res) => {
          resolve(Array.isArray(res.data) ? res.data : []);
        },
        () => reject(new Error('Failed to fetch transactions'))
      );
    });
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: queryStatus,
    isLoading,
    isError,
    refetch
  } = useInfiniteQuery({
    queryKey: ['maintenance', user.cardno, selectedChip],
    queryFn: fetchMaintenance,
    staleTime: 1000 * 60 * 30,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return pages.length + 1;
    }
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const renderItem = ({ item }) => (
    <ExpandableItem
      containerStyles={'mt-3'}
      visibleContent={
        <View className="flex flex-row items-center space-x-4">
          <Image source={icons.id} className="w-10 h-10" resizeMode="contain" />
          <View className="flex-col space-y-1">
            <View className="flex flex-row">
              <CustomTag
                text={item.status}
                textStyles={
                  item.status == status.STATUS_OPEN
                    ? 'text-red-200'
                    : 'text-green-200'
                }
                containerStyles={
                  item.status == status.STATUS_OPEN
                    ? 'bg-red-100'
                    : 'bg-green-100'
                }
              />
            </View>
            <View className="flex flex-row space-x-2">
              <Text className="text-black text-sm font-psemibold">
                Maintenance ID:
              </Text>
              <Text
                className="text-secondary text-sm font-psemibold"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ maxWidth: '50%' }}
              >
                {item.bookingid}
              </Text>
            </View>
            <Text className="font-pmedium text-gray-400">
              {moment(item.createdAt).format('Do MMMM, YYYY')}
            </Text>
          </View>
        </View>
      }
    >
      <HorizontalSeparator />
      <View className="flex px-2 pb-2 mt-2 flex-row space-x-2">
        <Image
          source={icons.department}
          className="w-4 h-4"
          resizeMode="contain"
        />
        <Text className="text-gray-400 font-pregular">Department:</Text>
        <Text className="text-black font-pmedium">{item.department}</Text>
      </View>
      <View className="flex px-2 pb-2 flex-row space-x-2">
        <Image source={icons.marker} className="w-4 h-4" resizeMode="contain" />
        <Text className="text-gray-400 font-pregular">place:</Text>
        <Text className="text-black font-pmedium">{item.area_of_work}</Text>
      </View>
      <View
        className="flex px-2 flex-row space-x-2 overflow-hidden"
        style={{ maxWidth: '90%' }}
      >
        <Image
          source={icons.description}
          className="w-4 h-4"
          resizeMode="contain"
        />
        <Text className="text-gray-400 font-pregular">Details:</Text>
        <Text className="text-black font-pmedium">{item.work_detail}</Text>
      </View>
    </ExpandableItem>
  );

  const renderHeader = () => (
    <View className="flex-col">
      <PageHeader title={'Maintenance History'} icon={icons.backArrow} />
      <View className="mb-6 mx-4">
        <CustomChipGroup
          chips={CHIPS}
          selectedChip={selectedChip}
          handleChipPress={(chip) => setSelectedChip(chip)}
        />
      </View>
    </View>
  );

  const renderFooter = () => (
    <View className="items-center">
      {(isFetchingNextPage || isLoading) && <ActivityIndicator />}
      {!hasNextPage && data?.pages?.[0]?.length > 0 && (
        <Text>No more bookings at the moment</Text>
      )}
      {!isFetchingNextPage && data?.pages?.[0]?.length == 0 && (
        <View className="flex-1 items-center justify-center">
          <LottieView
            style={{
              width: 200,
              height: 350,
              alignSelf: 'center'
            }}
            autoPlay
            loop
            source={require('../../assets/lottie/empty.json')}
          />
          <Text className="text-lg text-center font-pregular text-secondary">
            You dont have any maintenance requests yet
          </Text>
        </View>
      )}
    </View>
  );

  if (isError)
    return (
      <Text className="text-red-500 text-lg font-pregular items-center justify-center">
        An error occurred
      </Text>
    );

  return (
    <SafeAreaView className="h-full w-full bg-white">
      <FlashList
        className="flex-grow-1"
        contentContainerStyle={{ padding: 10 }}
        data={data?.pages?.flatMap((page) => page) || []}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={115}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity
        className="bg-secondary p-4 absolute right-6 bottom-8 rounded-2xl"
        onPress={() => router.push('/maintenanceRequest')}
      >
        <Image
          source={icons.add}
          tintColor={colors.white}
          className="w-6 h-6"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default maintenanceRequestList;
