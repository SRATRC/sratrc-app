import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  SectionList
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { icons } from '../../constants';
import handleAPICall from '../../utils/HandleApiCall';
import CustomTag from '../CustomTag';
import moment from 'moment';
import * as Haptics from 'expo-haptics';

const FoodBookingCancellation = () => {
  const [foodList, setFoodList] = useState([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [listEnded, setListEnded] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (!listEnded && !isFetching) requestAPI();
    console.log('CURRENT PAGE', page);
  }, [page]);

  const requestAPI = async () => {
    setIsFetching(true);

    const onSuccess = (res) => {
      if (res.data.length == 0) setListEnded(true);
      setFoodList((prevFoodList) => [...prevFoodList, ...res.data]);
    };

    const onFinally = () => {
      setIsFetching(false);
    };

    await handleAPICall(
      'GET',
      '/food/get',
      {
        cardno: user.cardno,
        page
      },
      null,
      onSuccess,
      onFinally
    );
  };

  const renderItem = ({ item, section }) => {
    const itemKey = `${item.date}-${item.mealType}`;
    const isSelected = selectedItems.some(
      (selected) => `${selected.date}-${selected.mealType}` === itemKey
    );

    return (
      <View
        className={`mb-5 p-3 rounded-2xl ${
          Platform.OS === 'ios'
            ? 'shadow-lg shadow-gray-200'
            : 'shadow-2xl shadow-gray-400'
        } bg-white ${isSelected ? 'bg-secondary-50' : ''}`}
      >
        <TouchableOpacity
          onPress={() => {
            if (section.title == 'upcoming') {
              const prevSelectedItems = [...selectedItems];
              const itemKey = `${item.date}-${item.mealType}`;

              const itemExists = prevSelectedItems.some(
                (selected) =>
                  `${selected.date}-${selected.mealType}` === itemKey
              );

              if (itemExists) {
                setSelectedItems(
                  prevSelectedItems.filter(
                    (selected) =>
                      `${selected.date}-${selected.mealType}` !== itemKey
                  )
                );
              } else {
                setSelectedItems([
                  ...prevSelectedItems,
                  { date: item.date, mealType: item.mealType }
                ]);
              }
            }

            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          className="overflow-hidden flex-row justify-between"
        >
          <View className="flex-1 flex-row items-center space-x-4">
            <View className="px-3 py-1.5 items-center justify-center flex-col bg-secondary-50 rounded-full">
              <Text className="text-secondary text-base font-psemibold">
                {moment(item.date).date()}
              </Text>
              <Text className="text-secondary text-xs font-psemibold">
                {moment(item.date).format('MMM')}
              </Text>
            </View>

            <View className="flex-col space-y-2">
              <CustomTag
                icon={icons.spice}
                iconStyles={'w-4 h-4 items-center justify-center'}
                text={item.spicy ? 'Regular' : 'Non-Spicy'}
                textStyles={item.spicy ? 'text-red-200' : 'text-green-200'}
                containerStyles={item.spicy ? 'bg-red-100' : 'bg-green-100'}
              />
              <View className="flex-row items-center">
                <Image
                  source={icons.meal}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
                <Text className="ml-1 text-gray-400">{'Meal Type'}</Text>
                <Text className="ml-1 text-black font-pmedium">
                  {item.mealType}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmpty = () => (
    <View className="items-center">
      {!isFetching && <Text>No bookings to cancel</Text>}
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View className="flex-row justify-between">
      <Text className="font-psemibold text-lg mb-2 mx-1">{title}</Text>
      {title == 'upcoming' && (
        <Text className="font-plight text-gray-500 text-xs mb-2 mx-1">
          Tap to cancel
        </Text>
      )}
    </View>
  );

  const renderFooter = () => (
    <View className="items-center">
      {isFetching && <ActivityIndicator />}
      {listEnded && foodList.length !== 0 && (
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
      <SectionList
        className="py-2 mt-5 flex-grow-1"
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        nestedScrollEnabled={true}
        sections={foodList}
        renderItem={({ item, section }) => renderItem({ item, section })}
        keyExtractor={(item) => `${item.date}-${item.mealType}`}
        renderSectionHeader={renderSectionHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReachedThreshold={0.1}
        onEndReached={fetchMoreData}
      />
    </View>
  );
};

export default FoodBookingCancellation;
