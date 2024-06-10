import { View, Text, ScrollView, Image, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../../constants';
import ExpandableItem from '../../components/ExpandableItem';
import CustomDropdown from '../../components/CustomDropdown';
import CustomMultiSelectDropdown from '../../components/CustomMultiSelectDropdown';
import HorizontalSeparator from '../../components/HorizontalSeparator';
import CustomButton from '../../components/CustomButton';

const details = () => {
  const { booking } = useLocalSearchParams();
  const { data } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [foodForm, setFoodForm] = useState({
    startDay: '',
    endDay: '',
    spicy: '',
    hightea: ''
  });
  const [type, setType] = useState([]);

  const foodTypeList = [
    { key: 'breakfast', value: 'breakfast' },
    { key: 'lunch', value: 'lunch' },
    { key: 'dinner', value: 'dinner' }
  ];

  const spiceyList = [
    { key: 'Regular', value: 'Regular' },
    { key: 'Non Spicy', value: 'Non Spicy' }
  ];

  const highteaList = [
    { key: 'TEA', value: 'Tea' },
    { key: 'COFFEE', value: 'Coffee' },
    { key: 'NONE', value: 'None' }
  ];

  // useEffect(() => {
  //   console.log(booking);
  // }, [booking]);

  return (
    <SafeAreaView className="h-full bg-white" edges={['right', 'top', 'left']}>
      <ScrollView
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full px-4 my-6 items-center">
          <Text className="text-2xl font-psemibold">Booking Details</Text>
        </View>

        <View className="w-full px-4">
          <Text className="text-xl font-psemibold text-secondary">
            Room Booking
          </Text>
          <View
            className={`flex flex-col bg-white rounded-2xl mt-4 ${
              Platform.OS === 'ios'
                ? 'shadow-lg shadow-gray-200'
                : 'shadow-2xl shadow-gray-400'
            }`}
          >
            <View className="flex p-4 flex-row space-x-4">
              <Image
                source={icons.room}
                className="w-10 h-10"
                resizeMode="contain"
              />
              <View className="w-full flex-1">
                <View className="flex flex-row items-center space-x-2">
                  <Text className="text-black font-psemibold">BOOKING ID:</Text>
                  <Text
                    className="text-secondary font-pmedium flex-1"
                    numberOfLines={1}
                  >
                    b84ff248-19c0-462b-8ed7-551e70fb0396
                  </Text>
                </View>
                <Text className="font-pmedium text-gray-400">
                  6th JUNE - 8th june, 2024
                </Text>
              </View>
            </View>

            <HorizontalSeparator otherStyles={'mb-4'} />

            <View className="flex px-6 pb-4 flex-row space-x-2">
              <Image
                source={icons.ac}
                className="w-4 h-4"
                resizeMode="contain"
              />
              <Text className="text-gray-400 font-pregular">Room Type: </Text>
              <Text className="text-black font-pmedium">AC ROOM</Text>
            </View>
            <View className="flex px-6 pb-4 flex-row space-x-2">
              <Image
                source={icons.elder}
                className="w-4 h-4"
                resizeMode="contain"
              />
              <Text className="text-gray-400 font-pregular">
                Ground Floor Booking:
              </Text>
              <Text className="text-black font-pmedium">NO</Text>
            </View>
            <View className="flex px-6 pb-4 flex-row space-x-2">
              <Image
                source={icons.charge}
                className="w-4 h-4"
                resizeMode="contain"
              />
              <Text className="text-gray-400 font-pregular">Charges:</Text>
              <Text className="text-black font-pmedium">₹ 2000</Text>
            </View>
          </View>

          <Text className="text-xl font-psemibold text-secondary mt-4 mb-2">
            Add Ons
          </Text>

          {/* FOOD BOOKING COMPONENT */}
          <ExpandableItem
            item={{
              icon: icons.food,
              title: 'Raj Prasad Booking'
            }}
            containerStyles={'mt-3'}
          >
            <CustomMultiSelectDropdown
              otherStyles="mt-5 w-full px-1"
              text={'Food Type'}
              placeholder={'Select Food Type'}
              data={foodTypeList}
              setSelected={(val) => setType(val)}
              type={type}
            />

            <CustomDropdown
              otherStyles="mt-5 w-full px-1"
              text={'Spice Level'}
              placeholder={'How much spice do you want?'}
              data={spiceyList}
              setSelected={(val) => setFoodForm({ ...foodForm, spicy: val })}
            />

            <CustomDropdown
              otherStyles="mt-5 w-full px-1"
              text={'Hightea'}
              placeholder={'Hightea'}
              data={highteaList}
              setSelected={(val) => setFoodForm({ ...foodForm, hightea: val })}
            />
          </ExpandableItem>

          {/* ADHYAYAN BOOKING COMPONENT */}
          <ExpandableItem
            item={{
              icon: icons.adhyayan,
              title: 'Raj Adhyayan Booking'
            }}
            containerStyles={'mt-3'}
          ></ExpandableItem>

          {/* TRAVEL BOOKING COMPONENT */}
          <ExpandableItem
            item={{
              icon: icons.travel,
              title: 'Raj Pravas Booking'
            }}
            containerStyles={'mt-3'}
          >
            <View className="flex flex-row w-full p-3 mt-3 bg-gray-100 rounded-lg space-x-2 items-center">
              <Image
                source={icons.yellowArrowUp}
                className="w-10 h-10"
                resizeMode="contain"
              />
              <Text className="font-pmedium">Mumbai to Research Centre</Text>
            </View>

            <View className="flex flex-row w-full p-3 mt-3 bg-gray-100 rounded-lg space-x-2 items-center">
              <Image
                source={icons.yellowArrowDown}
                className="w-10 h-10"
                resizeMode="contain"
              />
              <Text className="font-pmedium">Research Centre to Mumbai</Text>
            </View>
          </ExpandableItem>

          <CustomButton
            text="Pay Now"
            handlePress={() => {}}
            containerStyles="mb-5 min-h-[62px]"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default details;
