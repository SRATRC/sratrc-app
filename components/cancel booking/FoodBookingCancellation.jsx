import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  SectionList
} from 'react-native';
import React, { useState, useCallback } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { icons } from '../../constants';
import handleAPICall from '../../utils/HandleApiCall';
import CustomTag from '../CustomTag';
import moment from 'moment';
import * as Haptics from 'expo-haptics';
import { useGlobalContext } from '../../context/GlobalProvider';
import LottieView from 'lottie-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming
} from 'react-native-reanimated';

const FoodBookingCancellation = () => {
  const { user } = useGlobalContext();
  const queryClient = useQueryClient();

  const [selectedItems, setSelectedItems] = useState([]);

  const fetchFoods = async ({ pageParam = 1 }) => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/food/get',
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
    queryKey: ['foods', user.cardno],
    queryFn: fetchFoods,
    staleTime: 1000 * 60 * 5,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return pages.length + 1;
    }
  });

  const cancelBookingMutation = useMutation({
    mutationFn: () => {
      return new Promise((resolve, reject) => {
        handleAPICall(
          'PATCH',
          '/food/cancel',
          null,
          {
            cardno: user.cardno,
            food_data: selectedItems
          },
          (res) => resolve(res),
          () => reject(new Error('Failed to cancel booking'))
        );
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(['foods', user.cardno], (oldData) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.filter(
              (booking) =>
                !selectedItems.some(
                  (selected) =>
                    selected.date === booking.date &&
                    selected.mealType === booking.mealType
                )
            )
          )
        };
      });
      setSelectedItems([]);
      queryClient.invalidateQueries(['foods', user.cardno]);
    }
  });

  const renderItem = ({ item, section }) => {
    const itemKey = `${item.date}-${item.mealType}`;
    const isSelected = selectedItems.some(
      (selected) => `${selected.date}-${selected.mealType}` === itemKey
    );

    // Create a unique shared value for each tile
    const shakeTranslateX = useSharedValue(0);

    // Function to trigger the shake animation
    const shake = useCallback(() => {
      shakeTranslateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }, [shakeTranslateX]);

    const rShakeStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: shakeTranslateX.value }]
      };
    }, [shakeTranslateX]);

    return (
      <Animated.View
        style={[rShakeStyle]}
        className={`mb-5 p-3 rounded-2xl ${
          section.title === 'upcoming'
            ? Platform.OS === 'ios'
              ? 'shadow-lg shadow-gray-200 bg-white'
              : 'shadow-2xl shadow-gray-400 bg-white'
            : 'bg-gray-300'
        } ${isSelected ? 'bg-secondary-50' : ''}`}
      >
        <TouchableOpacity
          activeOpacity={section.title !== 'upcoming' && 1}
          onPress={() => {
            if (section.title === 'upcoming') {
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
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } else {
              shake();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
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
      </Animated.View>
    );
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View className="flex-row justify-between">
      <Text className="font-psemibold text-lg mb-2 mx-1">{title}</Text>
      {title === 'upcoming' && (
        <TouchableOpacity
          activeOpacity={selectedItems.length <= 0 && 1}
          onPress={() =>
            selectedItems.length > 0 && cancelBookingMutation.mutate()
          }
        >
          <Text
            className={`font-plight text-xs mb-2 mx-1 ${
              selectedItems.length > 0 ? 'text-secondary' : 'text-gray-500'
            }`}
          >
            Tap to cancel
          </Text>
        </TouchableOpacity>
      )}
    </View>
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
      <SectionList
        className="py-2 mt-5 flex-grow-1"
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        nestedScrollEnabled={true}
        sections={data?.pages?.flatMap((page) => page) || []}
        renderItem={({ item, section }) => renderItem({ item, section })}
        keyExtractor={(item) => `${item.date}-${item.mealType}`}
        renderSectionHeader={renderSectionHeader}
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
            You have not booked any meals yet
          </Text>
        </View>
      )}
    </View>
  );
};

export default FoodBookingCancellation;
