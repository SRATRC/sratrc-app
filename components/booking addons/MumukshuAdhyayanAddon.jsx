import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { icons } from '../../constants';
import { useQuery } from '@tanstack/react-query';
import { useGlobalContext } from '../../context/GlobalProvider';
import AddonItem from '../AddonItem';
import handleAPICall from '../../utils/HandleApiCall';
import HorizontalSeparator from '../HorizontalSeparator';
import moment from 'moment';
import * as Haptics from 'expo-haptics';
import CustomMultiSelectDropdown from '../CustomMultiSelectDropdown';
import CustomEmptyMessage from '../CustomEmptyMessage';

const MumukshuAdhyayanAddon = ({
  adhyayanForm,
  setAdhyayanForm,
  updateAdhyayanForm,
  INITIAL_ADHYAYAN_FORM,
  mumukshu_dropdown
}) => {
  const { user, mumukshuData, setMumukshuData } = useGlobalContext();

  const fetchAdhyayans = async () => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/adhyayan/getrange',
        {
          cardno: user.cardno,
          start_date: mumukshuData.room?.startDay || mumukshuData.travel?.date,
          end_date: mumukshuData.room?.endDay
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
    queryKey: [
      'adhyayans',
      mumukshuData.room?.startDay && mumukshuData.room?.endDay
    ],
    queryFn: fetchAdhyayans,
    staleTime: 1000 * 60 * 30,
    retry: false
  });

  const renderItem = ({ item }) => {
    const isSelected = adhyayanForm.adhyayan?.id == item.id;

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
            if (isSelected) {
              setAdhyayanForm((prev) => ({
                ...prev,
                adhyayan: null
              }));
              setMumukshuData((prev) => {
                const { adhyayan, ...rest } = prev;
                return rest;
              });
            } else {
              setAdhyayanForm((prev) => ({
                ...prev,
                adhyayan: item
              }));
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
      {isError && <Text>Error fetching data: {error.message}</Text>}
    </View>
  );

  return (
    <AddonItem
      onCollapse={() => {
        setAdhyayanForm(INITIAL_ADHYAYAN_FORM);
        setMumukshuData((prev) => {
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
      {!isLoading && !isError && adhyayanList?.length == 0 && (
        <CustomEmptyMessage
          lottiePath={require('../../assets/lottie/empty.json')}
          message={'No Adhyayans available on selected dates!'}
        />
      )}
      {(adhyayanList?.length > 0 || isError) && (
        <View className="w-full flex-col items-center justify-center">
          <CustomMultiSelectDropdown
            otherStyles="mt-5 w-full"
            text={'Select Mumukshus'}
            placeholder="Select Mumukshus"
            data={mumukshu_dropdown}
            value={adhyayanForm.mumukshuIndices}
            setSelected={(val) => {
              updateAdhyayanForm('mumukshuIndices', val);
            }}
            guest={true}
          />
          <FlatList
            className="py-2 mt-2 flex-grow-1 w-full"
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            data={adhyayanList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListFooterComponent={renderFooter}
            scrollEnabled={false}
          />
        </View>
      )}
    </AddonItem>
  );
};

export default MumukshuAdhyayanAddon;
