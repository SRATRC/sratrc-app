import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SectionList,
  ActivityIndicator,
  Alert
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { icons } from '../../constants';
import CustomButton from '../CustomButton';
import handleAPICall from '../../utils/HandleApiCall';

const AdhyayanBooking = ({ user }) => {
  const [adhyayanList, setAdhyayanList] = useState([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [listEnded, setListEnded] = useState(false);

  useEffect(() => {
    if (!listEnded) requestAPI();
    console.log('CURRENT PAGE', page);
  }, [page]);

  const requestAPI = async () => {
    setIsFetching(true);

    const onSuccess = (res) => {
      if (res.data.length == 0) setListEnded(true);
      const finalList = mergeLists(adhyayanList, res.data);
      setAdhyayanList(finalList);
    };

    const onFinally = () => {
      setIsFetching(false);
    };

    await handleAPICall(
      'GET',
      '/adhyayan/getall',
      {
        cardno: user.cardno,
        page
      },
      null,
      onSuccess,
      onFinally
    );
  };

  const renderItem = ({ item }) => <ExpandableListItem item={item} />;

  const renderSectionHeader = ({ section: { title } }) => (
    <Text className="font-psemibold text-lg mb-2 mx-1">{title}</Text>
  );

  const renderFooter = () => (
    <View className="items-center">
      {isFetching && <ActivityIndicator />}
      {listEnded && <Text>No more adhyayans at the moment</Text>}
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
        className="px-2 py-2 flex-grow-1"
        sections={adhyayanList}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        nestedScrollEnabled={true}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={renderSectionHeader}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.1}
        onEndReached={fetchMoreData}
      />
    </View>
  );
};

const ExpandableListItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const registerAdhyayan = async () => {
    setIsSubmitting(true);

    const onSuccess = (_data) => {
      Alert.alert('Booking Successful');
    };

    const onFinally = () => {
      setIsSubmitting(false);
    };

    await handleAPICall(
      'POST',
      '/adhyayan/register',
      null,
      {
        cardno: user.cardno,
        shibir_id: item.id
      },
      onSuccess,
      onFinally
    );
  };

  return (
    <View className="mb-5 p-3 shadow-md shadow-gray-200 bg-white rounded-2xl">
      <TouchableOpacity
        onPress={toggleExpand}
        className="overflow-hidden flex-row justify-between"
      >
        <View className="flex basis-11/12">
          <Text className="text-secondary font-psemibold">
            {item.start_date}
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
            text={item.status == 'closed' ? 'Add to waitlist' : 'Register'}
            handlePress={registerAdhyayan}
            containerStyles="mt-3 min-h-[40px]"
            isLoading={isSubmitting}
          />
        </View>
      )}
    </View>
  );
};

function mergeLists(list1, list2) {
  // Create an object to store values by titles
  const mergedObj = {};

  // Merge values from both lists
  for (const list of [list1, list2]) {
    for (const item of list) {
      const { title, data } = item;
      if (!mergedObj[title]) {
        mergedObj[title] = data.slice(); // Create a copy of the array
      } else {
        mergedObj[title].push(...data);
      }
    }
  }

  // Convert merged object back to array
  const finalList = Object.keys(mergedObj).map((title) => ({
    title,
    data: mergedObj[title]
  }));

  return finalList;
}

export default AdhyayanBooking;
