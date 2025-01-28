import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, Image, Text, TouchableOpacity, View } from 'react-native';
import { icons } from '../../constants';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import { handleUserNavigation } from '../../utils/navigationValidations';
import CustomButton from '../../components/CustomButton';
import * as ImageManipulator from 'expo-image-manipulator';

const camera = () => {
  const { setUser, setCurrentUser, user } = useGlobalContext();

  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (capturedImage) {
      setCurrentUser(user);
    }
  }, [user]);

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
    if (cameraRef.current) {
      try {
        // Step 1: Take picture with optimized settings
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8, // Reduced from 1 to improve processing speed
          skipProcessing: true, // Skip automatic rotation processing
          exif: false // Disable EXIF data to speed up capture
          // base64: false // Enable only if you need base64
        });

        // Step 2: Remove image manipulation if possible (prefer client-side transforms)
        setCapturedImage(photo.uri);

        // Step 3: Defer state updates that aren't immediately needed
        setUser((prev) => ({ ...prev, pfp: photo.uri }));

        // Optional: Process image in background if manipulation is absolutely needed
        /* requestIdleCallback(() => {
          ImageManipulator.manipulateAsync(
            photo.uri,
            [{ flip: ImageManipulator.FlipType.Horizontal }]
          ).then(mirrored => {
            setCapturedImage(mirrored.uri);
            setUser(prev => ({ ...prev, pfp: mirrored.uri }));
          });
        }); */
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  return (
    <View className="flex-1 justify-center">
      {capturedImage ? (
        <View className="flex-1 bg-gray-100">
          <Image
            className="flex-1"
            source={{ uri: capturedImage }}
            resizeMode="contain"
          />

          <View className="absolute bottom-0 w-full bg-white-100 pt-4 pb-8 px-8 rounded-t-3xl shadow-xl">
            <View className="flex-row justify-between space-x-4">
              <CustomButton
                text={'Retake'}
                handlePress={() => {
                  setCapturedImage(null);
                }}
                containerStyles={'flex-1 p-2 mx-1 mb-3 border border-secondary'}
                textStyles={'text-secondary'}
                bgcolor={'bg-white'}
              />
              <CustomButton
                text={'Save'}
                handlePress={() => {
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    handleUserNavigation(user, router);
                  }
                }}
                containerStyles={'flex-1 p-2 mx-1 mb-3'}
              />
            </View>
          </View>
        </View>
      ) : (
        <CameraView
          ref={cameraRef}
          className="flex-1"
          facing="front"
          enableTorch={false}
          enableZoomGesture={false}
          photoQuality={0.8}
          style={{ transform: [{ scaleX: -1 }] }} // Uncomment to handle mirroring
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
