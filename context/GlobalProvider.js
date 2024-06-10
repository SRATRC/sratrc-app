import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const getCurrentUser = async () => {
  const data = await AsyncStorage.getItem('user');
  user = data ? JSON.parse(data) : null;
  return user;
};

const setCurrentUser = async (user) => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

const removeItem = async (key) => {
  await AsyncStorage.removeItem(key);
};

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  // const rootSegment = useSegments()[0];
  // const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // useEffect(() => {
  //   if (!user && !isLoggedIn && rootSegment !== '(auth)') {
  //     router.replace('/sign-in');
  //   } else if (user && isLoggedIn && rootSegment !== '(tabs)') {
  //     router.replace('/');
  //   }
  // }, [user, rootSegment]);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        data,
        setData,
        loading,
        setCurrentUser,
        removeItem
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
