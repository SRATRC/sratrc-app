import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  SectionList
} from 'react-native';
import { useState, useCallback } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { icons } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import handleAPICall from '../../utils/HandleApiCall';
import CustomTag from '../CustomTag';
import moment from 'moment';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';

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

    const shakeTranslateX = useSharedValue(0);

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
        className={`mb-5 p-3 rounded-2xl bg-white ${
          Platform.OS === 'ios'
            ? 'shadow-lg shadow-gray-200'
            : 'shadow-2xl shadow-gray-400'
        } ${isSelected && 'border border-secondary'}`}
      >
        <TouchableOpacity
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
            <View
              className={`px-3 py-1.5 items-center justify-center flex-col rounded-full ${
                section.title === 'upcoming'
                  ? isSelected
                    ? 'bg-secondary'
                    : 'bg-secondary-50'
                  : 'bg-gray-100'
              }`}
            >
              <Text
                className={`${
                  section.title === 'upcoming'
                    ? isSelected
                      ? 'text-white'
                      : 'text-secondary'
                    : 'text-gray-400'
                } text-base font-psemibold`}
              >
                {moment(item.date).date()}
              </Text>
              <Text
                className={`${
                  section.title === 'upcoming'
                    ? isSelected
                      ? 'text-white'
                      : 'text-secondary'
                    : 'text-gray-400'
                } text-xs font-psemibold`}
              >
                {moment(item.date).format('MMM')}
              </Text>
            </View>

            <View className="flex-col space-y-2">
              <CustomTag
                icon={icons.spice}
                iconStyles={'w-4 h-4 items-center justify-center'}
                text={item.spicy ? 'Regular' : 'Non-Spicy'}
                textStyles={
                  section.title === 'upcoming'
                    ? item.spicy
                      ? 'text-red-200'
                      : 'text-green-200'
                    : 'text-gray-400'
                }
                containerStyles={
                  section.title === 'upcoming'
                    ? item.spicy
                      ? 'bg-red-100'
                      : 'bg-green-100'
                    : 'bg-gray-100'
                }
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

  const renderSectionHeader = ({ section: { title, data } }) => {
    const allSelected = data.every((item) =>
      selectedItems.some(
        (selected) =>
          selected.date === item.date && selected.mealType === item.mealType
      )
    );

    const handleSelectAll = () => {
      if (allSelected) {
        // Deselect all items in the upcoming section
        setSelectedItems(
          selectedItems.filter(
            (selected) =>
              !data.some(
                (item) =>
                  item.date === selected.date &&
                  item.mealType === selected.mealType
              )
          )
        );
      } else {
        // Select all items in the upcoming section
        const newSelections = data.map((item) => ({
          date: item.date,
          mealType: item.mealType
        }));
        setSelectedItems([...selectedItems, ...newSelections]);
      }
    };

    const handleDelete = () => {
      cancelBookingMutation.mutate();
    };

    return (
      <View className="flex-row justify-between items-center">
        <Text className="font-psemibold text-lg mb-2 mx-1">{title}</Text>
        {title === 'upcoming' && (
          <View className="flex-row space-x-2">
            <TouchableOpacity activeOpacity={1} onPress={handleSelectAll}>
              <Text className="font-plight text-xs mb-2 mx-1 text-gray-500">
                {allSelected ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
            {selectedItems.length > 0 && (
              <TouchableOpacity activeOpacity={1} onPress={handleDelete}>
                <Text className="font-pregular text-xs text-red-500 mb-2 mx-1">
                  Delete
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

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
      <SectionList
        className="py-2 px-4 mt-5 flex-grow-1"
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
