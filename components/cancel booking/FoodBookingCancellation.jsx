import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  SectionList,
  ScrollView
} from 'react-native';
import { useState, useCallback } from 'react';
import {
  useQuery,
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
import { colors, icons } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import handleAPICall from '../../utils/HandleApiCall';
import CustomTag from '../CustomTag';
import moment from 'moment';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';

const FOOD_TYPE_LIST = [
  { label: 'All', value: 'all' },
  { label: 'breakfast', value: 'breakfast' },
  { label: 'lunch', value: 'lunch' },
  { label: 'dinner', value: 'dinner' }
];

const SPICE_LIST = [
  { label: 'All', value: 'all' },
  { label: 'Regular', value: true },
  { label: 'Non Spicy', value: false }
];

const FoodBookingCancellation = () => {
  const { user } = useGlobalContext();
  const queryClient = useQueryClient();

  const [selectedItems, setSelectedItems] = useState([]);
  const [datePickerVisibility, setDatePickerVisibility] = useState(false);
  const [filter, setFilter] = useState({
    date: null,
    meal: null,
    spice: null,
    for: null
  });

  // Fetching food data using infinite query
  const fetchFoods = async ({ pageParam = 1 }) => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/food/get',
        {
          cardno: user.cardno,
          page: pageParam,
          date: filter.date,
          meal: filter.meal,
          spice: filter.spice,
          bookedFor: filter.for
        },
        null,
        (res) => resolve(Array.isArray(res.data) ? res.data : []),
        () => reject(new Error('Failed to fetch foods'))
      );
    });
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfiniteQuery({
    queryKey: [
      'foods',
      user.cardno,
      filter.date,
      filter.meal,
      filter.spice,
      filter.for
    ],
    queryFn: fetchFoods,
    staleTime: 1000 * 60 * 5,
    getNextPageParam: (lastPage, pages) =>
      lastPage?.length ? pages.length + 1 : undefined
  });

  // Fetching guest list for filters
  const fetchGuests = async () => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/food/getGuestsForFilter',
        { cardno: user.cardno },
        null,
        (res) => resolve(Array.isArray(res.data) ? res.data : []),
        () => reject(new Error('Failed to fetch guests'))
      );
    });
  };

  const { data: guestList, isLoading: isLoadingGuest } = useQuery({
    queryKey: ['foodGuestList', user.cardno],
    queryFn: fetchGuests,
    staleTime: 1000 * 60 * 60 * 2
  });

  // Mutation to cancel booking
  const cancelBookingMutation = useMutation({
    mutationFn: () => {
      return new Promise((resolve, reject) => {
        handleAPICall(
          'PATCH',
          '/food/cancel',
          null,
          { cardno: user.cardno, food_data: selectedItems },
          resolve,
          () => reject(new Error('Failed to cancel booking'))
        );
      });
    },
    onSuccess: () => {
      setSelectedItems([]);
      queryClient.invalidateQueries([
        'foods',
        user.cardno,
        filter.date,
        filter.meal,
        filter.spice,
        filter.for
      ]);
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

  const renderHeader = () => (
    <View className="space-y-1 mb-2">
      <Text className="text-black font-pregular">Filter By:</Text>
      <ScrollView className="flex w-full" horizontal>
        <View className="flex flex-row w-full items-center space-x-2">
          <View className="flex-row items-center justify-center space-x-2 border border-gray-200 rounded-xl p-2">
            <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
              <Text
                className={`${
                  filter.date ? 'text-black' : 'text-gray-400'
                } font-pregular`}
              >
                {filter.date
                  ? moment(filter.date).format('Do MMMM YYYY')
                  : 'Date'}
              </Text>
            </TouchableOpacity>

            {filter.date && (
              <TouchableOpacity
                onPress={() => setFilter((prev) => ({ ...prev, date: null }))}
              >
                <Image
                  source={icons.cross}
                  className="w-2.5 h-2.5"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>

          <DateTimePickerModal
            isVisible={datePickerVisibility}
            mode="date"
            onConfirm={(date) => {
              setFilter((prev) => ({
                ...prev,
                date: moment(date).format('YYYY-MM-DD')
              }));
              setDatePickerVisibility(false);
            }}
            onCancel={() => setDatePickerVisibility(false)}
          />

          <Dropdown
            data={FOOD_TYPE_LIST}
            labelField="label"
            valueField="value"
            placeholder="Meal Type"
            value={filter.meal}
            onChange={(item) =>
              setFilter((prev) => ({ ...prev, meal: item.value }))
            }
            style={{
              borderColor: colors.gray_200,
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 6
            }}
            containerStyle={{
              borderWidth: 1,
              shadowRadius: 0,
              shadowOpacity: 0,
              width: 120
            }}
            placeholderStyle={{
              color: colors.gray_400,
              fontFamily: 'Poppins-Regular',
              fontSize: 16
            }}
          />

          <Dropdown
            data={SPICE_LIST}
            labelField="label"
            valueField="value"
            placeholder="Spice Level"
            value={filter.spice}
            onChange={(item) =>
              setFilter((prev) => ({ ...prev, spice: item.value }))
            }
            style={{
              borderColor: colors.gray_200,
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 6
            }}
            containerStyle={{
              borderWidth: 1,
              shadowRadius: 0,
              shadowOpacity: 0,
              width: 120
            }}
            placeholderStyle={{
              color: colors.gray_400,
              fontFamily: 'Poppins-Regular',
              fontSize: 16
            }}
          />

          {guestList && (
            <Dropdown
              data={guestList}
              labelField="label"
              valueField="value"
              placeholder="Booked For"
              value={filter.for}
              onChange={(item) =>
                setFilter((prev) => ({ ...prev, for: item.value }))
              }
              style={{
                borderColor: colors.gray_200,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 6
              }}
              containerStyle={{
                borderWidth: 1,
                shadowRadius: 0,
                shadowOpacity: 0,
                width: 120
              }}
              placeholderStyle={{
                color: colors.gray_400,
                fontFamily: 'Poppins-Regular',
                fontSize: 16
              }}
            />
          )}
        </View>
      </ScrollView>
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
      <Text className="text-red-500 text-lg font-pregular items-center justify-center">
        An error occurred
      </Text>
    );

  return (
    <View className="w-full">
      <SectionList
        className="py-2 px-4 mt-2 flex-grow-1"
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        nestedScrollEnabled={true}
        sections={data?.pages?.flatMap((page) => page) || []}
        renderItem={({ item, section }) => renderItem({ item, section })}
        keyExtractor={(item) => `${item.date}-${item.mealType}`}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderHeader}
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
            Nothing to show for selected filter
          </Text>
        </View>
      )}
    </View>
  );
};

export default FoodBookingCancellation;
