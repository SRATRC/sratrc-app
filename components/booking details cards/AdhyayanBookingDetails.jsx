import { View, Text, Image, Platform } from 'react-native';
import { icons, status } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import HorizontalSeparator from '../HorizontalSeparator';
import CustomTag from '../CustomTag';
import moment from 'moment';

const AdhyayanBookingDetails = ({ containerStyles }) => {
  const { data } = useGlobalContext();

  return (
    <View className={`w-full px-4 ${containerStyles}`}>
      <Text className="text-xl font-psemibold text-secondary">
        Raj Adhyayan Booking
      </Text>
      {data.adhyayan.map((item, index) => {
        const formattedStartDate = moment(item.start_date).format('Do MMMM');
        const formattedEndDate = moment(item.end_date).format('Do MMMM, YYYY');
        return (
          <View
            key={index}
            className={`flex flex-col bg-white rounded-2xl mt-4 ${
              Platform.OS === 'ios'
                ? 'shadow-lg shadow-gray-200'
                : 'shadow-2xl shadow-gray-400'
            }`}
          >
            <View className="flex p-4 flex-row space-x-4 items-center">
              <Image
                source={icons.adhyayan}
                className="w-10 h-10"
                resizeMode="contain"
              />
              <View className="w-full flex-1 justify-center space-y-1">
                {item.booking_status && (
                  <CustomTag
                    text={item.booking_status}
                    textStyles={
                      item.booking_status == status.STATUS_WAITING
                        ? 'text-red-200'
                        : 'text-green-200'
                    }
                    containerStyles={
                      item.booking_status == status.STATUS_WAITING
                        ? 'bg-red-100'
                        : 'bg-green-100'
                    }
                  />
                )}
                <Text className="font-pmedium text-md">
                  {`${formattedStartDate} - ${formattedEndDate}`}
                </Text>
              </View>
            </View>

            <HorizontalSeparator otherStyles={'mb-4'} />

            <View className="flex px-6 pb-4 flex-row space-x-2">
              <Image
                source={icons.description}
                className="w-4 h-4"
                resizeMode="contain"
              />
              <Text className="text-gray-400 font-pregular">Name:</Text>
              <Text className="text-black font-pmedium">{item.name}</Text>
            </View>
            <View className="flex px-6 pb-4 flex-row space-x-2">
              <Image
                source={icons.person}
                className="w-4 h-4"
                resizeMode="contain"
              />
              <Text className="text-gray-400 font-pregular">
                Swadhyay Karta:
              </Text>
              <Text className="text-black font-pmedium">{item.speaker}</Text>
            </View>
            <View className="flex px-6 pb-4 flex-row space-x-2">
              <Image
                source={icons.charge}
                className="w-4 h-4"
                resizeMode="contain"
              />
              <Text className="text-gray-400 font-pregular">Charges:</Text>
              <Text className="text-black font-pmedium">₹ {item.amount}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default AdhyayanBookingDetails;
