import { View, Text, Image, ActivityIndicator } from 'react-native';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { icons, status } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import CustomButton from '../CustomButton';
import handleAPICall from '../../utils/HandleApiCall';
import ExpandableItem from '../ExpandableItem';
import HorizontalSeparator from '../HorizontalSeparator';
import moment from 'moment';
import CustomTag from '../CustomTag';
import LottieView from 'lottie-react-native';

const RoomBookingCancellation = () => {
  const { user } = useGlobalContext();
  const queryClient = useQueryClient();

  const fetchRooms = async ({ pageParam = 1 }) => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/stay/bookings',
        {
          cardno: user.cardno,
          page: pageParam
        },
        null,
        (res) => {
          resolve(Array.isArray(res) ? res : []);
        },
        () => reject(new Error('Failed to fetch rooms'))
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
    queryKey: ['rooms', user.cardno],
    queryFn: fetchRooms,
    staleTime: 1000 * 60 * 5,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return pages.length + 1;
    }
  });

  const cancelBookingMutation = useMutation({
    mutationFn: ({ bookingid, bookedFor }) => {
      return new Promise((resolve, reject) => {
        handleAPICall(
          'POST',
          '/stay/cancel',
          null,
          {
            cardno: user.cardno,
            bookingid,
            bookedFor
          },
          (res) => resolve(res),
          () => reject(new Error('Failed to cancel booking'))
        );
      });
    },
    onSuccess: (_, { bookingid, bookedFor }) => {
      queryClient.setQueryData(['rooms', user.cardno], (oldData) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((booking) => {
              const isMatchingBooking =
                booking.bookingid === bookingid &&
                (booking.bookedFor !== null
                  ? booking.bookedFor == bookedFor
                  : true);

              if (!isMatchingBooking) {
                return booking;
              }

              const isPending =
                booking.transaction_status === status.STATUS_PAYMENT_PENDING ||
                booking.transaction_status === status.STATUS_CASH_PENDING;

              const isCompleted =
                booking.transaction_status ===
                  status.STATUS_PAYMENT_COMPLETED ||
                booking.transaction_status === status.STATUS_CASH_COMPLETED;

              const newTransactionStatus = isPending
                ? status.STATUS_CANCELLED
                : isCompleted
                ? status.STATUS_CREDITED
                : booking.transaction_status;

              return {
                ...booking,
                status: status.STATUS_CANCELLED,
                transaction_status: newTransactionStatus
              };
            })
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
            source={icons.room}
            className="w-10 h-10"
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
                    : item.transaction_status == status.STATUS_CREDITED
                    ? 'Credited'
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
              {moment(item.checkin).format('Do MMMM')} -{' '}
              {moment(item.checkout).format('Do MMMM, YYYY')}
            </Text>
            {item.name && (
              <Text className="font-pmedium">
                Booked For: <Text className="text-secondary">{item.name}</Text>
              </Text>
            )}
          </View>
        </View>
      }
      containerStyles={'mt-3'}
    >
      <HorizontalSeparator />
      <View className="flex px-2 mt-2 flex-row space-x-2">
        <Image source={icons.ac} className="w-4 h-4" resizeMode="contain" />
        <Text className="text-gray-400 font-pregular">Room Type: </Text>
        <Text className="text-black font-pmedium">
          {item.roomtype === 'ac' ? 'AC Room' : 'Non AC Room'}
        </Text>
      </View>
      <View className="flex px-2 mt-2 flex-row space-x-2">
        <Image source={icons.elder} className="w-4 h-4" resizeMode="contain" />
        <Text className="text-gray-400 font-pregular">
          Ground Floor Booking:
        </Text>
        <Text className="text-black font-pmedium">
          {item.gender.includes('SC') ? 'Yes' : 'No'}
        </Text>
      </View>
      {(item.transaction_status == status.STATUS_CASH_COMPLETED ||
        item.transaction_status == status.STATUS_PAYMENT_COMPLETED) && (
        <View className="flex px-2 flex-row space-x-2">
          <Image
            source={icons.roomNumber}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Room Number:</Text>
          <Text className="text-black font-pmedium">{item.roomno}</Text>
        </View>
      )}
      <View className="flex px-2 mt-2 flex-row space-x-2">
        <Image source={icons.charge} className="w-4 h-4" resizeMode="contain" />
        <Text className="text-gray-400 font-pregular">Charge: </Text>
        <Text className="text-black font-pmedium">₹ {item.amount}</Text>
      </View>

      {moment(item.checkin).diff(moment().format('YYYY-MM-DD')) > 0 &&
        item.status !== status.STATUS_CANCELLED &&
        item.status !== status.STATUS_ADMIN_CANCELLED && (
          <View className="flex-row space-x-2">
            {(item.transaction_status == status.STATUS_PAYMENT_PENDING ||
              item.transaction_status == status.STATUS_CASH_PENDING) && (
              <CustomButton
                text="Pay Now"
                containerStyles={'mt-5 py-3 mx-1 flex-1'}
                textStyles={'text-sm'}
                handlePress={async () => {}}
              />
            )}

            <CustomButton
              text="Cancel Booking"
              containerStyles={'mt-5 py-3 mx-1 flex-1'}
              textStyles={'text-sm'}
              handlePress={() =>
                cancelBookingMutation.mutate({
                  bookingid: item.bookingid,
                  bookedFor: item.bookedFor
                })
              }
            />
          </View>
        )}
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
        estimatedItemSize={99}
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
            You have not booked any rooms yet
          </Text>
        </View>
      )}
    </View>
  );
};

export default RoomBookingCancellation;
