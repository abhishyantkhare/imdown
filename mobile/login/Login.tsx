import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';

import LoginStyles from './LoginStyles';
import { BACKEND_URL, callBackend } from '../backend/backend';
import { User } from '../types/user';
import AuthLoadingScreen from './AuthLoadingScreen';
import AppNavRouteProp from '../types/navigation';

type LoginProps = AppNavRouteProp<'Login'>;

const Login = ({ navigation }: LoginProps) => {
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);
  const IOS_CLIENT_ID = '1097983281822-8qr8vltrud1hj3rfme2khn1lmbj2s522.apps.googleusercontent.com';
  const WEB_ID = '1097983281822-8k2kede3hrgrqi15r869mf3u5at6q6ib.apps.googleusercontent.com';

  let deviceToken: string;
  const [isSignedIn, setIsSignedIn] = useState<boolean | undefined>(undefined);

  const requestNotificationPermission = async () => {
    await messaging().requestPermission();
  };

  const getDeviceToken = async () => {
    deviceToken = await messaging().getToken();
  };

  const notificationsSetup = async () => {
    await requestNotificationPermission();
    await getDeviceToken();
  };

  const googleSetup = () => {
    GoogleSignin.configure({
      iosClientId: IOS_CLIENT_ID,
      webClientId: WEB_ID,
      offlineAccess: true,
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });
  };

  const setBackendDeviceToken = () => {
    const endpoint = 'device_token';
    const data = {
      deviceToken,
    };
    const init: RequestInit = { // eslint-disable-line no-undef
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return callBackend(endpoint, init);
  };

  const goToSquads = async (email: string) => {
    await setBackendDeviceToken();
    navigation.navigate('Squads', {
      email,
    });
  };

  const checkIfUserSignedIn = async () => {
    const userEmail = await AsyncStorage.getItem('email');
    if (userEmail) {
      const endpoint = `is_signed_in?email=${userEmail}`;
      const resp = await callBackend(endpoint);
      if (resp.ok) {
        goToSquads(userEmail);
      }
    }
    setIsSignedIn(false);
  };

  const setup = async () => {
    await notificationsSetup();
    await checkIfUserSignedIn();
    googleSetup();
  };

  useEffect(() => {
    setup();
  }, []);

  const setCookieAndTransition = (sessionCookie: string, email: string) => {
    const items = [['sessionCookie', sessionCookie], ['email', email]];
    AsyncStorage.multiSet(items).then(() => {
      goToSquads(email);
    });
  };

  const signInOnBackend = (user: User, googleServerCode: string | null) => {
    const loginUrl = `${BACKEND_URL}login`;
    const data = { googleServerCode, deviceToken };
    fetch(loginUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp: Response) => {
      setCookieAndTransition(resp.headers.get('set-cookie') || '', user.email);
    });
  };

  const signIn = async () => {
    try {
      setIsSigninInProgress(true);
      await GoogleSignin.hasPlayServices();
      const resp = await GoogleSignin.signIn();
      const user: User = {
        email: resp.user.email,
        name: resp.user.name,
        photo: resp.user.photo,
      };
      setIsSigninInProgress(false);
      signInOnBackend(user, resp.serverAuthCode);
    } catch (error) {
      setIsSigninInProgress(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log(`Error signing into Google account. User cancelled the login flow. Error is ${error}`);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log(`Error signing into Google account. User is already in the process of logging in. Error is ${error}`);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log(`Error signing into Google account. Play services are not available. Error is ${error}`);
      } else {
        console.log(`Error signing into Google account. Unidentified error. It is ${error}`);
      }
    }
  };

  return (isSignedIn === undefined
    ? <AuthLoadingScreen />
    : (
      <View style={LoginStyles.loginContainer}>
        <LinearGradient
          colors={['#84D3FF', '#CFFFFF']}
          style={LoginStyles.gradientBackground}
        />
        <View style={LoginStyles.titleDescriptionContainer}>
          <Text style={LoginStyles.imdownTitle}>imdown</Text>
          <Text style={LoginStyles.imdownDescription}>a better way to manage</Text>
          <Text style={LoginStyles.imdownDescription}>group events.</Text>
          <GoogleSigninButton
            style={LoginStyles.googleSignInButton}
            size={GoogleSigninButton.Size.Wide}
            onPress={signIn}
            disabled={isSigninInProgress}
          />
        </View>
      </View>
    )
  );
};

export default Login;
