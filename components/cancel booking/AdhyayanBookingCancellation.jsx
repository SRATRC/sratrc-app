import { View, Text, Image, ActivityIndicator, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { icons, status } from '../../constants';
import CustomButton from '../CustomButton';
import handleAPICall from '../../utils/HandleApiCall';
import ExpandableItem from '../ExpandableItem';
import CustomTag from '../CustomTag';
import moment from 'moment';
import HorizontalSeparator from '../HorizontalSeparator';

const AdhyayanBookingCancellation = ({ user }) => {
  const [adhyayanList, setAdhyayanList] = useState([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [listEnded, setListEnded] = useState(false);

  useEffect(() => {
    if (!listEnded && !isFetching) requestAPI();
    console.log('CURRENT PAGE', page);
  }, [page]);

  const requestAPI = async () => {
    setIsFetching(true);

    const onSuccess = (res) => {
      if (res.data.length == 0) setListEnded(true);
      setAdhyayanList((prevAdhyayanList) => [...prevAdhyayanList, ...res.data]);
    };

    const onFinally = () => {
      setIsFetching(false);
    };

    await handleAPICall(
      'GET',
      '/adhyayan/getbooked',
      {
        cardno: user.cardno,
        page
      },
      null,
      onSuccess,
      onFinally
    );
  };

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
              <Text className="font-pmedium text-secondary-100">
                {moment(item.start_date).format('Do MMMM')} -{' '}
                {moment(item.end_date).format('Do MMMM, YYYY')}
              </Text>
              <Text className="font-pmedium text-gray-700">{item.name}</Text>
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
                    handlePress={async () => {
                      // const onSuccess = (_res) => {
                      //   setRoomList((prevRoomList) => {
                      //     return prevRoomList.map((it) =>
                      //       it.bookingid === item.bookingid
                      //         ? { ...it, status: status.STATUS_CANCELLED }
                      //         : it
                      //     );
                      //   });
                      // };
                      // const onFinally = () => {};
                      // await handleAPICall(
                      //   'POST',
                      //   '/stay/cancel',
                      //   null,
                      //   {
                      //     cardno: user.cardno,
                      //     bookingid: item.bookingid
                      //   },
                      //   onSuccess,
                      //   onFinally
                      // );
                    }}
                  />
                ))}

              <CustomButton
                text="Cancel Booking"
                containerStyles={'mt-5 py-3 mx-1 flex-1'}
                textStyles={'text-sm'}
                handlePress={async () => {
                  const onSuccess = (_res) => {
                    setAdhyayanList((prevAdhyayanList) => {
                      return prevAdhyayanList.map((it) =>
                        it.bookingid === item.bookingid
                          ? { ...it, status: status.STATUS_CANCELLED }
                          : it
                      );
                    });
                  };
                  const onFinally = () => {};
                  await handleAPICall(
                    'DELETE',
                    '/adhyayan/cancel',
                    null,
                    {
                      cardno: user.cardno,
                      shibir_id: item.shibir_id
                    },
                    onSuccess,
                    onFinally
                  );
                }}
              />
            </View>
          )}
      </View>
    </ExpandableItem>
  );

  const renderEmpty = () => (
    <View className="items-center">
      {!isFetching && <Text>No bookings to cancel</Text>}
    </View>
  );

  const renderFooter = () => (
    <View className="items-center">
      {isFetching && <ActivityIndicator />}
      {listEnded && adhyayanList.length !== 0 && (
        <Text>No more bookings at the moment</Text>
      )}
    </View>
  );

  const fetchMoreData = () => {
    if (!listEnded && !isFetching) {
      setPage(page + 1);
    }
  };

  return (
    <View className="w-full">
      <FlatList
        className="py-2 mt-5 flex-grow-1"
        showsVerticalScrollIndicator={false}
        data={adhyayanList}
        renderItem={renderItem}
        keyExtractor={(item) => item.bookingid}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReachedThreshold={0.1}
        onEndReached={fetchMoreData}
      />
    </View>
  );
};

export default AdhyayanBookingCancellation;
