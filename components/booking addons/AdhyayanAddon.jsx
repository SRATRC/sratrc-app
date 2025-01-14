import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { icons, types } from '../../constants';
import { useQuery } from '@tanstack/react-query';
import { useGlobalContext } from '../../context/GlobalProvider';
import AddonItem from '../AddonItem';
import handleAPICall from '../../utils/HandleApiCall';
import HorizontalSeparator from '../HorizontalSeparator';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import * as Haptics from 'expo-haptics';

const AdhyayanAddon = ({
  adhyayanBookingList,
  setAdhyayanBookingList,
  booking
}) => {
  const { user, data, setData } = useGlobalContext();

  const fetchAdhyayans = async () => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/adhyayan/getrange',
        {
          cardno: user.cardno,
          start_date:
            booking == types.ROOM_DETAILS_TYPE
              ? data.room.startDay
              : data.travel.date,
          end_date: booking == types.ROOM_DETAILS_TYPE ? data.room.endDay : ''
        },
        null,
        (res) => {
          resolve(Array.isArray(res.data) ? res.data : []);
        },
        () => reject(new Error('Failed to fetch rooms'))
      );
    });
  };

  const {
    isLoading,
    isError,
    error,
    data: adhyayanList
  } = useQuery({
    queryKey: ['adhyayans', booking, data.room?.startDay, data.travel?.date],
    queryFn: fetchAdhyayans,
    staleTime: 1000 * 60 * 30
  });

  const renderItem = ({ item }) => {
    const isSelected = adhyayanBookingList.some(
      (selected) => selected.id === item.id
    );

    return (
      <View className="w-full bg-gray-50 rounded-2xl p-2 mb-2">
        <View className="flex flex-row justify-between items-center py-2">
          <Text className="font-pmedium text-base text-secondary">{`${moment(
            item.start_date
          ).format('Do MMMM')} - ${moment(item.end_date).format(
            'Do MMMM, YYYY'
          )}`}</Text>
        </View>
        <HorizontalSeparator />
        <View className="flex pt-2 pb-4 flex-row space-x-2">
          <Image
            source={icons.description}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Name: </Text>
          <Text className="text-black font-pmedium" numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        <View className="flex pb-4 flex-row space-x-2">
          <Image
            source={icons.person}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Swadhyay Karta: </Text>
          <Text className="text-black font-pmedium" numberOfLines={1}>
            {item.speaker}
          </Text>
        </View>
        <View className="flex flex-row space-x-2">
          <Image
            source={icons.charge}
            className="w-4 h-4"
            resizeMode="contain"
          />
          <Text className="text-gray-400 font-pregular">Charges:</Text>
          <Text className="text-black font-pmedium">₹ {item.amount}</Text>
        </View>
        <TouchableOpacity
          className={`border border-secondary rounded-lg w-full p-2 mt-4 justify-center items-center ${
            isSelected ? 'bg-secondary' : ''
          }`}
          onPress={() => {
            const prevSelectedItems = [...adhyayanBookingList];
            const isSelected = prevSelectedItems.some(
              (selected) => selected.id === item.id
            );
            if (isSelected) {
              const filteredList = prevSelectedItems.filter(
                (selected) => selected.id !== item.id
              );
              setAdhyayanBookingList(filteredList);
              if (filteredList.length === 0) {
                setData((prev) => {
                  const { adhyayan, ...rest } = prev;
                  return rest;
                });
              }
            } else {
              setAdhyayanBookingList([...prevSelectedItems, item]);
            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text
            className={`font-pmedium text-md ${
              isSelected ? 'text-white' : 'text-secondary-100'
            }`}
          >
            {isSelected ? 'Unregister' : 'Register'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFooter = () => (
    <View className="items-center justify-center w-full">
      {isLoading && <ActivityIndicator />}
      {isError && (
        <Text>
          Error fetching data: {error.message} {console.log(error.message)}
        </Text>
      )}
    </View>
  );

  return (
    <AddonItem
      onCollapse={() => {
        setAdhyayanBookingList([]);
        setData((prev) => {
          const { adhyayan, ...rest } = prev;
          return rest;
        });
      }}
      visibleContent={
        <View className="flex flex-row items-center space-x-4">
          <Image
            source={icons.adhyayan}
            className="w-10 h-10"
            resizeMode="contain"
          />
          <Text className="font-pmedium">Raj Adhyayan Booking</Text>
        </View>
      }
      containerStyles={'mt-3'}
    >
      {!isLoading && !isError && adhyayanList.length == 0 && (
        <View className="flex flex-col items-center justify-center">
          <LottieView
            style={{
              width: 200,
              height: 200
            }}
            autoPlay
            loop
            source={require('../../assets/lottie/notFound.json')}
          />
          <Text className="text-md font-psemibold text-secondary">
            No adhyayans available on selected dates!
          </Text>
        </View>
      )}
      <FlatList
        className="py-2 mt-2 w-full"
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        data={adhyayanList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListFooterComponent={renderFooter}
        scrollEnabled={false}
      />
    </AddonItem>
  );
};

export default AdhyayanAddon;
