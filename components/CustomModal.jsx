import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import { icons } from '../constants';
import CustomButton from './CustomButton';

const CustomModal = ({ visible, onClose, message, btnText, btnOnPress }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        className="flex-1 rounded flex-col justify-center items-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <View className="bg-white rounded-lg flex-col w-[300] p-[20]">
          <View className="flex-row justify-between">
            <Text className="text-black font-pmedium text-base">{message}</Text>
            <TouchableOpacity onPress={onClose}>
              <Image
                source={icons.cross}
                className="w-4 h-4 ms-2 ps-2"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-end">
            <CustomButton
              handlePress={btnOnPress ? btnOnPress : onClose}
              text={btnText ? btnText : 'Confirm'}
              bgcolor="bg-secondary"
              containerStyles="mt-5 rounded-md px-2 py-1 justify-end"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
