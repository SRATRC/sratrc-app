import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Platform
} from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';
import CustomButton from './CustomButton';

const CustomExpandableList = ({ data }) => {
  const renderItem = ({ item }) => <ExpandableListItem item={item} />;

  return (
    <FlatList
      className="px-4 py-6"
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const ExpandableListItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View
      className={`mb-5 p-3 bg-white rounded-2xl ${
        Platform.OS === 'ios'
          ? 'shadow-lg shadow-gray-200'
          : 'shadow-2xl shadow-gray-400'
      }`}
    >
      <TouchableOpacity
        onPress={toggleExpand}
        className="overflow-hidden flex-row justify-between"
      >
        <View>
          <Text className="text-secondary font-psemibold">{item.date}</Text>
          <Text className="font-pmedium">{item.title}</Text>
        </View>
        <View className="bg-gray-100 items-center justify-center rounded-md w-8 h-8">
          {expanded ? (
            <Image
              source={icons.collapseArrow}
              className="w-4 h-4"
              resizeMode="contain"
            />
          ) : (
            <Image
              source={icons.expandArrow}
              className="w-4 h-4"
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
          {item.status == 'closed' ? (
            <CustomButton
              text="Add to waitlist"
              handlePress={() => {}}
              containerStyles="mt-3 min-h-[40px]"
              isLoading={isSubmitting}
            />
          ) : (
            <CustomButton
              text="Register"
              handlePress={() => {}}
              containerStyles="mt-3 min-h-[40px]"
              isLoading={isSubmitting}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default CustomExpandableList;
