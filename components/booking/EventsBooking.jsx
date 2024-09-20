import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SectionList,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { icons, status, types } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useRouter } from 'expo-router';
import CustomButton from '../CustomButton';
import handleAPICall from '../../utils/HandleApiCall';
import * as Haptics from 'expo-haptics';
import moment from 'moment/moment';

const EventsBooking = () => {
  const { user } = useGlobalContext();

  const fetchAdhyayans = async ({ pageParam = 1 }) => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/utsav/upcoming',
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
    queryKey: ['adhyayans', user.cardno],
    queryFn: fetchAdhyayans,
    staleTime: 1000 * 60 * 30,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return pages.length + 1;
    }
  });

  const renderItem = ({ item }) => <ExpandableListItem item={item} />;

  const renderSectionHeader = ({ section: { title } }) => (
    <Text className="font-psemibold text-lg mb-2 mx-1">{title}</Text>
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
        className="px-2 py-2 flex-grow-1"
        sections={data?.pages?.flatMap((page) => page) || []}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        nestedScrollEnabled={true}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
            There are no upcoming events at the moment
          </Text>
        </View>
      )}
    </View>
  );
};

//TODO: Migrate to use of ExpandableItem
const ExpandableListItem = ({ item }) => {
  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const registerEvent = async () => {
    router.push(`/booking/${types.ADHYAYAN_DETAILS_TYPE}`);
  };

  return (
    <View
      className={`mb-5 p-3 bg-white rounded-2xl ${
        Platform.OS === 'ios'
          ? 'shadow-md shadow-gray-200'
          : 'shadow-xl shadow-gray-400'
      }`}
    >
      <TouchableOpacity
        onPress={toggleExpand}
        className="overflow-hidden flex-row justify-between"
      >
        <View className="flex basis-11/12">
          <Text className="text-secondary font-psemibold">
            {moment(item.start_date).format('Do MMMM')} -{' '}
            {moment(item.end_date).format('Do MMMM, YYYY')}
          </Text>
          <Text className="font-pmedium text-gray-700">{item.name}</Text>
        </View>
        <View className="bg-gray-100 items-center justify-center rounded-md basis-1/12 h-6">
          {expanded ? (
            <Image
              source={icons.collapseArrow}
              className="w-3 h-3"
              resizeMode="contain"
            />
          ) : (
            <Image
              source={icons.expandArrow}
              className="w-3 h-3"
              resizeMode="contain"
            />
          )}
        </View>
      </TouchableOpacity>
      {expanded && (
        <View className="mt-3">
          <View className="flex-row space-x-2">
            <Text className="font-psemibold text-gray-400">
              Swadhyay Karta:
            </Text>
            <Text className="font-pregular">{item.speaker}</Text>
          </View>
          <View className="flex-row space-x-2">
            <Text className="font-psemibold text-gray-400">Charges:</Text>
            <Text className="font-pregular">{item.amount}</Text>
          </View>
          <CustomButton
            text={
              item.status == status.STATUS_CLOSED
                ? 'Add to waitlist'
                : 'Register'
            }
            handlePress={registerEvent}
            containerStyles="mt-3 min-h-[40px]"
            isLoading={isSubmitting}
          />
        </View>
      )}
    </View>
  );
};

export default EventsBooking;
