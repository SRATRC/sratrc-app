import { Text, View, ActivityIndicator } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, icons } from '../../constants/index';
import { useQuery } from '@tanstack/react-query';
import { useGlobalContext } from '../../context/GlobalProvider';
import handleAPICall from '../../utils/HandleApiCall';
import PageHeader from '../../components/PageHeader';
import moment from 'moment';

const getFirstAndLastDate = (menuData) => {
  if (!menuData || Object.keys(menuData).length === 0) {
    return { firstDate: null, lastDate: null };
  }

  const dateKeys = Object.keys(menuData).sort((a, b) =>
    moment(a).diff(moment(b))
  );

  return {
    firstDate: dateKeys[0],
    lastDate: dateKeys[dateKeys.length - 1]
  };
};

const Menu = () => {
  const { user } = useGlobalContext();

  const fetchMenu = async () => {
    return new Promise((resolve, reject) => {
      handleAPICall(
        'GET',
        '/food/menu',
        { cardno: user.cardno },
        null,
        (res) => {
          resolve(res.data);
        },
        () => reject(new Error('Failed to fetch menu items'))
      );
    });
  };

  const {
    isLoading,
    isError,
    error,
    data: menuData
  } = useQuery({
    queryKey: ['menu', user.cardno],
    queryFn: fetchMenu,
    staleTime: 1000 * 60 * 60 * 24 * 3
  });

  const renderItem = (reservation) => (
    <View className="bg-white p-4 rounded-2xl my-1 mr-3">
      <Text className="text-lg font-psemibold text-black">
        {reservation.meal}
      </Text>
      <Text className="text-base font-pregular text-gray-500">
        {reservation.name}
      </Text>
      <Text className="text-sm font-plight text-gray-400 mt-2">
        {reservation.time}
      </Text>
    </View>
  );

  const renderEmptyDate = () => (
    <View
      style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}
    >
      <Text>No menu available</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.orange} />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>{error.message || 'Error loading menu data'}</Text>
      </View>
    );
  }

  const { firstDate, lastDate } = getFirstAndLastDate(menuData);

  return (
    <SafeAreaView className="h-full bg-white" edges={['right', 'top', 'left']}>
      <PageHeader title={'Menu'} icon={icons.backArrow} />
      <Agenda
        items={menuData}
        selected={moment(firstDate).format('YYYY-MM-DD')}
        minDate={moment(firstDate).format('YYYY-MM-DD')}
        maxDate={moment(lastDate).format('YYYY-MM-DD')}
        pastScrollRange={1}
        futureScrollRange={2}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        showClosingKnob={true}
        theme={{
          selectedDayBackgroundColor: colors.orange,
          agendaTodayColor: colors.orange,
          dotColor: 'transparent',
          selectedDotColor: 'transparent',
          todayTextColor: colors.orange,
          textDayFontFamily: 'Poppins-Light'
        }}
      />
    </SafeAreaView>
  );
};

export default Menu;
