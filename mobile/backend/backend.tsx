/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */

import AsyncStorage from '@react-native-community/async-storage';
import CookieManager from '@react-native-community/cookies';
import { Platform } from 'react-native';

// If you're testing on a real device and
// want to connect to your local backend
// Download ngrok (https://dashboard.ngrok.com/get-started/setup)
// Put the generated url here
// export const BACKEND_URL = NGROK_URL
export const LOCALHOST = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';
export const BACKEND_URL = __DEV__ ? `http://${LOCALHOST}:5000/` : 'https://app.imhelladown.com/';

export const callBackend = async (
  endpoint: string,
  init: RequestInit = { headers: {} }) => {
  if (!init.headers) {
    init.headers = {};
  }
  const sessionCookie = await AsyncStorage.getItem('sessionCookie');
  init.headers.Cookie = sessionCookie;
  init.credentials = 'include';
  // In theory we should only have to clear the cookies after
  // I'm doing it before and after to just be certain the cookies are cleared
  // Honestly screw iOS cookie handling
  await CookieManager.clearAll();
  return fetch(BACKEND_URL + endpoint, init);
};

export const getUsersInSquad = (squadId: number) => {
  const endpoint = `get_users?squadId=${squadId}`;
  const init: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return callBackend(endpoint, init).then((response) => response.json());
};

export const deleteRequest = (endpoint: string, data: object) => {
    const init: RequestInit = {
        method: 'DELETE',
        mode: 'no-cors',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    }
    return callBackend(endpoint, init).then(response => {
        return response.json();
    });
}

export const postRequest = (endpoint: string, data: object) => {
  const init: RequestInit = {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return callBackend(endpoint, init);
};
