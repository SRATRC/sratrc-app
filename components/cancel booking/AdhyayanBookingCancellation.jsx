import { View, Text, Image, ActivityIndicator } from 'react-native';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { icons, status } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import { FlashList } from '@shopify/flash-list';
import CustomButton from '../CustomButton';
import handleAPICall from '../../utils/HandleApiCall';
import ExpandableItem from '../ExpandableItem';
import CustomTag from '../CustomTag';
import moment from 'moment';
import HorizontalSeparator from '../HorizontalSeparator';
import LottieView from 'lottie-react-native';

const AdhyayanBookingCancellation = () => {
  const { user } = useGlobalContext();
  const queryClient = useQueryClient();

  const fetchAdhyayans = async ({ pageParam = 1 }) => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/adhyayan/getbooked',
        {
          cardno: user.cardno,
          page: pageParam
        },
        null,
        (res) => {
          resolve(Array.isArray(res.data) ? res.data : []);
        },
        () => reject(new Error('Failed to fetch adhyayans'))
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
    isError
  } = useInfiniteQuery({
    queryKey: ['cancelAdhyayans', user.cardno],
    queryFn: fetchAdhyayans,
    staleTime: 1000 * 60 * 5,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return pages.length + 1;
    }
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (shibirid) => {
      return new Promise((resolve, reject) => {
        handleAPICall(
          'DELETE',
          '/adhyayan/cancel',
          null,
          {
            cardno: user.cardno,
            shibir_id: shibirid
          },
          (res) => resolve(res),
          () => reject(new Error('Failed to cancel booking'))
        );
      });
    },
    onSuccess: (_, shibirid) => {
      queryClient.setQueryData(['cancelAdhyayans', user.cardno], (oldData) => {
        if (!oldData || !oldData.pages) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((booking) =>
              booking.shibir_id === shibirid
                ? { ...booking, status: status.STATUS_CANCELLED }
                : booking
            )
          )
        };
      });
    }
  });

  const renderItem = ({ item }) => (
    <ExpandableItem
      visibleContent={
        <View className="flex flex-row items-center space-x-4">
          <Image
            source={icons.adhyayan}
            className="w-10 h-10 items-center"
            resizeMode="contain"
          />
          <View className="flex-col space-y-2">
            <View className="flex flex-row">
              <CustomTag
                text={item.status}
                textStyles={
                  item.status == status.STATUS_CANCELLED ||
                  item.status == status.STATUS_ADMIN_CANCELLED
                    ? 'text-red-200'
                    : item.status == status.STATUS_WAITING
                    ? 'text-secondary-200'
                    : 'text-green-200'
                }
                containerStyles={
                  item.status == status.STATUS_CANCELLED ||
                  item.status == status.STATUS_ADMIN_CANCELLED
                    ? 'bg-red-100'
                    : item.status == status.STATUS_WAITING
                    ? 'bg-secondary-50'
                    : 'bg-green-100'
                }
              />
              <CustomTag
                text={
                  item.transaction_status == status.STATUS_CANCELLED ||
                  item.transaction_status == status.STATUS_ADMIN_CANCELLED
                    ? 'Payment Cancelled'
                    : item.transaction_status ==
                        status.STATUS_PAYMENT_PENDING ||
                      item.transaction_status == status.STATUS_CASH_PENDING
                    ? 'Payment Due'
                    : 'Paid'
                }
                textStyles={
                  item.transaction_status == status.STATUS_CANCELLED ||
                  item.transaction_status == status.STATUS_ADMIN_CANCELLED
                    ? 'text-red-200'
                    : item.transaction_status ==
                        status.STATUS_PAYMENT_PENDING ||
                      item.transaction_status == status.STATUS_CASH_PENDING
                    ? 'text-secondary-200'
                    : 'text-green-200'
                }
                containerStyles={`${
                  item.transaction_status == status.STATUS_CANCELLED ||
                  item.transaction_status == status.STATUS_ADMIN_CANCELLED
                    ? 'bg-red-100'
                    : item.transaction_status ==
                        status.STATUS_PAYMENT_PENDING ||
                      item.transaction_status == status.STATUS_CASH_PENDING
                    ? 'bg-secondary-50'
                    : 'bg-green-100'
                } mx-1`}
              />
            </View>
            <View className="flex-col">
              <Text className="font-pmedium text-gray-700">{item.name}</Text>
              <Text className="font-pmedium text-secondary-100">
                {moment(item.start_date).format('Do MMMM')} -{' '}
                {moment(item.end_date).format('Do MMMM, YYYY')}
              </Text>
            </View>
          </View>
        </View>
      }
      containerStyles={'mt-3'}
    >
      <HorizontalSeparator />
      <View className="mt-3">
        <View className="flex px-2 flex-row space-x-2">
          <Image
            source={icons.person}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Swadhyay Karta: </Text>
          <Text className="text-black font-pmedium">{item.speaker}</Text>
        </View>
        <View className="flex px-2 mt-2 flex-row space-x-2">
          <Image
            source={icons.charge}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Charge: </Text>
          <Text className="text-black font-pmedium">₹ {item.amount}</Text>
        </View>
        {moment(item.start_date).diff(moment().format('YYYY-MM-DD')) > 6 &&
          item.status !== status.STATUS_CANCELLED &&
          item.status !== status.STATUS_ADMIN_CANCELLED && (
            <View className="flex-row space-x-2">
              {item.transaction_status == status.STATUS_PAYMENT_PENDING ||
                (item.transaction_status == status.STATUS_CASH_PENDING && (
                  <CustomButton
                    text="Pay Now"
                    containerStyles={'mt-5 py-3 mx-1 flex-1'}
                    textStyles={'text-sm'}
                    handlePress={async () => {}}
                  />
                ))}

              <CustomButton
                text="Cancel Booking"
                containerStyles={'mt-5 py-3 mx-1 flex-1'}
                textStyles={'text-sm'}
                handlePress={() => {
                  cancelBookingMutation.mutate(item.shibir_id);
                }}
              />
            </View>
          )}
      </View>
    </ExpandableItem>
  );

  const renderFooter = () => (
    <View className="items-center">
      {(isFetchingNextPage || isLoading) && <ActivityIndicator />}
      {!hasNextPage && data?.pages?.[0]?.length > 0 && (
        <Text>No more bookings at the moment</Text>
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
    <View className="w-full">
      <FlashList
        className="flex-grow-1"
        contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
        data={data?.pages?.flatMap((page) => page) || []}
        estimatedItemSize={109}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
      />
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
            You have not booked any adhyayans yet
          </Text>
        </View>
      )}
    </View>
  );
};

export default AdhyayanBookingCancellation;