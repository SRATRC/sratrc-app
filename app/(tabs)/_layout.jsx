import {
  View,
  Text,
  Image,
  Platform,
  Modal,
  ImageBackground
} from 'react-native';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { icons, images, colors } from '../../constants';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import QRCodeStyled from 'react-native-qrcode-styled';
import PageHeader from '../../components/PageHeader';
import * as Brightness from 'expo-brightness';
import { useGlobalContext } from '../../context/GlobalProvider';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [originalBrightness, setOriginalBrightness] = useState(null);

  // Function to handle brightness adjustments
  useEffect(() => {
    const adjustBrightness = async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === 'granted') {
        try {
          const currentBrightness = await Brightness.getBrightnessAsync();
          setOriginalBrightness(currentBrightness);
          await Brightness.setBrightnessAsync(0.7);
        } catch (e) {
          console.log('Error setting brightness:', e);
        }
      }
    };

    if (isModalVisible) {
      adjustBrightness();
    }

    return () => {
      if (originalBrightness !== null) {
        Brightness.setBrightnessAsync(originalBrightness);
      }
    };
  }, [isModalVisible, originalBrightness]);

  // Function to close the modal and restore brightness
  const closeModal = () => {
    if (originalBrightness !== null) {
      Brightness.setBrightnessAsync(originalBrightness);
    }
    setIsModalVisible(false);
  };

  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#BFBFBF',
          tabBarStyle: {
            backgroundColor: '#FFFCF5',
            borderTopColor: '#EEAA0B',
            borderTopWidth: 1,
            height: Platform.OS === 'ios' ? 90 : 60
          }
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="book-now"
          options={{
            title: 'Book Now',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="Book Now"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="qrModal"
          options={{
            title: 'QR Code',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.qrcode}
                color={color}
                name="QR Code"
                focused={focused}
              />
            )
          }}
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault();
              setIsModalVisible(true); // Show the modal
            }
          })}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: 'Bookings',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bookmark}
                color={color}
                name="Bookings"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            )
          }}
        />
      </Tabs>

      {/* QR Modal Component */}
      <Modal
        animationType="slide"
        visible={isModalVisible}
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <PageHeader
          title={'QR Code'}
          icon={icons.cross}
          onPress={() => {
            setIsModalVisible(false);
          }}
        />
        <View className="h-full mt-10">
          <ImageBackground
            source={images.ticketbg}
            resizeMode="contain"
            className="justify-center items-center"
          >
            <View className="h-[70%] items-center justify-center">
              <QRCodeStyled
                data={user.cardno}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  overflow: 'hidden'
                }}
                padding={20}
                pieceSize={10}
                color={colors.black_200}
                errorCorrectionLevel={'H'}
                innerEyesOptions={{
                  borderRadius: 12,
                  color: colors.black_200
                }}
                outerEyesOptions={{
                  borderRadius: 12,
                  color: colors.orange
                }}
                logo={{
                  href: require('../../assets/images/logo.png'),
                  padding: 4
                }}
              />
            </View>
          </ImageBackground>
        </View>
      </Modal>
    </>
  );
};

export default TabsLayout;
