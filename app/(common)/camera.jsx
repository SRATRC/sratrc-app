import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, Image, Text, TouchableOpacity, View } from 'react-native';
import { icons } from '../../constants';
import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import * as ImageManipulator from 'expo-image-manipulator';
import CustomButton from '../../components/CustomButton';
// import * as MediaLibrary from 'expo-media-library';

const camera = () => {
  const { setUser, setCurrentUser } = useGlobalContext();

  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);
  const router = useRouter();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center">
        <Text className="pb-2 text-center">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const captureImage = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          skipProcessing: false
        });

        const mirroredImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ flip: ImageManipulator.FlipType.Horizontal }]
        );

        setCapturedImage(mirroredImage.uri);
        setUser({ ...user, pfp: mirroredImage.uri });
        setCurrentUser({ ...user, pfp: mirroredImage.uri });
        // await MediaLibrary.saveToLibraryAsync(mirroredImage.uri);
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    } else {
      console.log('camera ref is null');
    }
  };

  return (
    <View className="flex-1 justify-center">
      {capturedImage ? (
        <View className="flex-1">
          <Image className="flex-1" source={{ uri: capturedImage }} />
          <CustomButton
            text={'Save'}
            handlePress={() => {
              router.back();
            }}
            containerStyles={'absolute bottom-20 left-20 right-20 p-2'}
          />
        </View>
      ) : (
        <CameraView
          ref={cameraRef}
          className="flex-1"
          facing="front"
          // style={{ transform: [{ scaleX: -1 }] }}
        >
          <TouchableOpacity
            className="absolute bottom-16 self-center"
            onPress={captureImage}
          >
            <Image
              source={icons.shutter}
              className="w-20 h-20"
              tintColor={'#fff'}
            />
          </TouchableOpacity>
        </CameraView>
      )}
    </View>
  );
};

export default camera;
