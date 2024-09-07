import { View, Text, Image, ActivityIndicator, FlatList } from 'react-native';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { icons, status } from '../../constants';
import CustomButton from '../CustomButton';
import handleAPICall from '../../utils/HandleApiCall';
import ExpandableItem from '../ExpandableItem';
import CustomTag from '../CustomTag';
import moment from 'moment';
import HorizontalSeparator from '../HorizontalSeparator';
import { useGlobalContext } from '../../context/GlobalProvider';
import LottieView from 'lottie-react-native';

const TravelBookingCancellation = () => {
  const { user } = useGlobalContext();
  const queryClient = useQueryClient();

  const fetchTravels = async ({ pageParam = 1 }) => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/travel/history',
        {
          cardno: user.cardno,
          page: pageParam
        },
        null,
        (res) => {
          // Ensure res is an array, if not, wrap it in an array
          resolve(Array.isArray(res.data) ? res.data : []);
        },
        () => reject(new Error('Failed to fetch travels'))
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
    queryKey: ['travels', user.cardno],
    queryFn: fetchTravels,
    staleTime: 1000 * 60 * 5,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return pages.length + 1;
    }
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingid) => {
      return new Promise((resolve, reject) => {
        handleAPICall(
          'DELETE',
          '/travel/booking',
          null,
          {
            cardno: user.cardno,
            bookingid
          },
          (res) => resolve(res),
          () => reject(new Error('Failed to cancel booking'))
        );
      });
    },
    onSuccess: (_, bookingid) => {
      queryClient.setQueryData(['travels', user.cardno], (oldData) => {
        if (!oldData || !oldData.pages) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((booking) =>
              booking.bookingid === bookingid
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
            source={icons.travel}
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
            <Text className="font-pmedium">
              {moment(item.date).format('Do MMMM, YYYY')}
            </Text>
            <Text className="font-pmedium text-secondary">
              {item.pickup_point == 'RC'
                ? 'Research Centre to Mumbai'
                : 'Mumbai to Research Centre'}
            </Text>
          </View>
        </View>
      }
      containerStyles={'mt-3'}
    >
      <HorizontalSeparator />
      <View className="mt-3">
        {item.drop_point == 'RC' ? (
          <View className="flex px-2 mt-2 flex-row space-x-2">
            <Image
              source={icons.marker}
              className="w-4 h-4"
              resizeMode="contain"
            />
            <Text className="text-gray-400 font-pregular">Pickup Point: </Text>
            <Text className="text-black font-pmedium">{item.pickup_point}</Text>
          </View>
        ) : (
          <View className="flex px-2 mt-2 flex-row space-x-2">
            <Image
              source={icons.marker}
              className="w-4 h-4"
              resizeMode="contain"
            />
            <Text className="text-gray-400 font-pregular">Drop Point: </Text>
            <Text className="text-black font-pmedium">{item.drop_point}</Text>
          </View>
        )}
        <View className="flex px-2 mt-2 flex-row space-x-2">
          <Image
            source={icons.luggage}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Luggage: </Text>
          <Text className="text-black font-pmedium">{item.luggage}</Text>
        </View>
        {item.comments && (
          <View className="flex px-2 mt-2 flex-row space-x-2">
            <Image
              source={icons.request}
              className="w-4 h-4"
              resizeMode="contain"
            />
            <Text className="text-gray-400 font-pregular">
              Special Request:{' '}
            </Text>
            <Text className="text-black font-pmedium">{item.comments}</Text>
          </View>
        )}
        <View className="flex px-2 mt-2 flex-row space-x-2">
          <Image
            source={icons.charge}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Charge: </Text>
          <Text className="text-black font-pmedium">₹ {item.amount}</Text>
        </View>
        <View>
          {moment(item.date).diff(moment().format('YYYY-MM-DD')) > 0 &&
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
                    cancelBookingMutation.mutate(item.bookingid);
                  }}
                />
              </View>
            )}
        </View>
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
      <Text className="text-red-500 text-lg font-pregular">
        An error occurred
      </Text>
    );

  return (
    <View className="w-full">
      <FlatList
        className="py-2 mt-5 flex-grow-1"
        showsVerticalScrollIndicator={false}
        data={data?.pages?.flatMap((page) => page) || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.bookingid}
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
            You have not booked any travels yet
          </Text>
        </View>
      )}
    </View>
  );
};

export default TravelBookingCancellation;
