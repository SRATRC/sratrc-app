import { View, Image, Modal, ImageBackground } from 'react-native';
import { Tabs } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { icons, images, colors } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import QRCodeStyled from 'react-native-qrcode-styled';
import PageHeader from '../../components/PageHeader';

const TabIcon = React.memo(({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
    </View>
  );
});

const QRModal = React.memo(({ isVisible, onClose, user }) => {
  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <PageHeader title={'QR Code'} icon={icons.cross} onPress={onClose} />
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
  );
});

const TabsLayout = () => {
  const { user } = useGlobalContext();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#BFBFBF',
          tabBarStyle: {
            backgroundColor: '#FFFCF5',
            borderTopColor: '#EEAA0B',
            borderTopWidth: 1
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
                // name="Home"
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
                // name="Book Now"
                focused={focused}
                style={{ margin: 10 }}
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
                // name="QR Code"
                focused={focused}
              />
            )
          }}
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault();
              openModal();
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
                // name="Bookings"
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
                // name="Profile"
                focused={focused}
              />
            )
          }}
        />
      </Tabs>

      <QRModal
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        user={user}
      />
    </>
  );
};

export default TabsLayout;
