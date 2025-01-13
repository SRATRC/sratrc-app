import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef
} from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../utils/registerForPushNotificationsAsync';
import { useRouter } from 'expo-router';

const NotificationContext = createContext(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  const notificationListener = useRef();
  const responseListener = useRef();

  const router = useRouter();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token),
      (error) => setError(error)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // Extract data from notification
        const data = response.notification.request.content.data;

        // Navigate using the router if the screen is specified
        if (data?.screen) {
          // For dynamic screens, you can pass additional params if necessary
          router.push(data.screen); // Or router.push(`${data.screen}/${data.someId}`) for dynamic routing
        }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
