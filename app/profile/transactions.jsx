import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Platform,
  RefreshControl
} from 'react-native';
import { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInfiniteQuery } from '@tanstack/react-query';
import { icons, status, types } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import { FlashList } from '@shopify/flash-list';
import PageHeader from '../../components/PageHeader';
import handleAPICall from '../../utils/HandleApiCall';
import CustomChipGroup from '../../components/CustomChipGroup';
import LottieView from 'lottie-react-native';
import CustomTag from '../../components/CustomTag';
import moment from 'moment';

const CHIPS = [
  types.transaction_type_all,
  types.transaction_type_pending,
  types.transaction_type_completed,
  types.transaction_type_cancelled,
  types.transaction_type_admin_cancelled
];

const transactions = () => {
  const { user } = useGlobalContext();

  const [selectedChip, setSelectedChip] = useState(types.transaction_type_all);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async ({ pageParam = 1 }) => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/profile/transactions',
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
    queryKey: ['transactions', user.cardno, selectedChip],
    queryFn: fetchTransactions,
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

  const renderItem = ({ item }) => <TransactionItem item={item} />;

  const renderHeader = () => (
    <View className="flex-col">
      <PageHeader title={'Transaction History'} icon={icons.backArrow} />
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
          <Text className="text-lg font-pregular text-secondary">
            You dont have any transactions yet
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
    <SafeAreaView className="h-full bg-white">
      <FlashList
        className="mt-2 flex-grow-1"
        data={data?.pages?.flatMap((page) => page) || []}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={103}
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
    </SafeAreaView>
  );
};

const TransactionItem = ({ item }) => {
  return (
    <View className="px-5">
      <View
        className={`mb-5 p-3 rounded-2xl bg-white ${
          Platform.OS === 'ios'
            ? 'shadow-lg shadow-gray-200'
            : 'shadow-2xl shadow-gray-400'
        }`}
      >
        <View className="flex flex-row items-center space-x-4">
          <View className="flex h-full justify-center">
            <Image
              source={
                item.category == types.ROOM_DETAILS_TYPE
                  ? icons.room
                  : item.category == types.TRAVEL_DETAILS_TYPE
                  ? icons.travel
                  : item.category == types.ADHYAYAN_DETAILS_TYPE
                  ? icons.adhyayan
                  : icons.logout //TODO: add event icon here
              }
              className="w-10 h-10"
              resizeMode="contain"
            />
          </View>
          <View className="flex flex-col space-y-2">
            <View className="flex flex-row items-center">
              <Text className="font-pmedium">
                {item.category == types.ROOM_DETAILS_TYPE
                  ? 'Room Booking'
                  : item.category == types.TRAVEL_DETAILS_TYPE
                  ? 'Travel Booking'
                  : item.category == types.ADHYAYAN_DETAILS_TYPE
                  ? 'Adhyayan Booking'
                  : 'Event Booking'}
              </Text>
              <CustomTag
                text={
                  item.status == status.STATUS_CANCELLED
                    ? 'Cancelled'
                    : item.status == status.STATUS_ADMIN_CANCELLED
                    ? 'Admin Cancelled'
                    : item.status == status.STATUS_PAYMENT_PENDING
                    ? 'Payment Due'
                    : item.status == status.STATUS_CASH_PENDING
                    ? 'Cash Due'
                    : 'Paid'
                }
                textStyles={
                  item.status == status.STATUS_CANCELLED ||
                  item.status == status.STATUS_ADMIN_CANCELLED
                    ? 'text-red-200'
                    : item.status == status.STATUS_PAYMENT_PENDING ||
                      item.status == status.STATUS_CASH_PENDING
                    ? 'text-secondary-200'
                    : 'text-green-200'
                }
                containerStyles={`${
                  item.status == status.STATUS_CANCELLED ||
                  item.status == status.STATUS_ADMIN_CANCELLED
                    ? 'bg-red-100'
                    : item.status == status.STATUS_PAYMENT_PENDING ||
                      item.status == status.STATUS_CASH_PENDING
                    ? 'bg-secondary-50'
                    : 'bg-green-100'
                } mx-1`}
              />
            </View>
            <Text className="font-pmedium text-secondary">
              {moment(item.createdAt).format('Do MMMM, YYYY')}
            </Text>
          </View>
        </View>
        <View className="absolute bottom-3 right-3">
          <Text className="font-pmedium text-lg text-black">
            ₹ {item.amount}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default transactions;
