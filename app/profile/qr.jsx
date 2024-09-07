import { View, ImageBackground, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { icons, images, colors } from '../../constants';
import QRCodeStyled from 'react-native-qrcode-styled';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';
import * as Brightness from 'expo-brightness';

const QrScreen = () => {
  const { user } = useGlobalContext();
  const [originalBrightness, setOriginalBrightness] = useState(null);

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

    adjustBrightness();

    return () => {
      if (originalBrightness !== null) {
        Brightness.setBrightnessAsync(originalBrightness);
      }
    };
  }, [originalBrightness]);

  const closeModal = () => {
    if (originalBrightness !== null) {
      Brightness.setBrightnessAsync(originalBrightness);
    }
    router.back();
  };

  return (
    <Modal
      animationType="slide"
      visible={true}
      presentationStyle="pageSheet"
      onRequestClose={closeModal}
    >
      <PageHeader title={'QR Code'} icon={icons.cross} />
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
};

export default QrScreen;
