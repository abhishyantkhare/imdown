/* eslint camelcase: ["error", {properties: "never", ignoreImports: true}] */
import React from 'react';
import { Image, View } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Ubuntu_400Regular,
  Ubuntu_400Regular_Italic,
  Ubuntu_700Bold, useFonts,
} from '@expo-google-fonts/ubuntu';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import { SourceSansPro_400Regular, SourceSansPro_700Bold, SourceSansPro_400Regular_Italic } from '@expo-google-fonts/source-sans-pro';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import FlashMessage from 'react-native-flash-message';

import Login from './login/Login';
import { AddNewSquad, AddExistingSquad } from './squads/AddSquad';
import Squads from './squads/Squads';
import Events from './events/Events';
import AddEditEvent from './events/AddEditEvent';
import EventDetails, { Event } from './events/EventDetails';
import EditEvent from './events/EditEvent';
import ViewSquad from './squads/ViewSquadSettings';
import EditSquad from './squads/EditSquadSettings';
import SquadMembers from './squads/SquadMembers';
import AuthLoadingScreen from './login/AuthLoadingScreen';
import { SquadRouteParams } from './types/Squad';

export type RootStackParamList = {
  AddSquad: {
    email: string;
  };
  AddEditEvent: {
    squadRouteParams: SquadRouteParams,
    isEditView: boolean,
    prevEvent?: Event
  };
  Events: SquadRouteParams;
  Login: undefined;
  Squads: {
    email: string;
  };
  SquadSettings: {
    squadId: number,
    squadAdminId?: number,
    squadCode: string,
    squadName: string,
    squadEmoji: string,
    squadImage: string,
    userId: number
  };
  AddNewSquad: {
    email: string
  };
  AddExistingSquad: {
    email: string
  };
  EventDetails: {
    squadRouteParams: SquadRouteParams,
    eventId: number
  };
  EditEvent: {
    event: Event,
    userEmail: string,
    setEvent?: Function,
    numUsers: number,
  };
  SquadMembers: {
    isInEditView: boolean,
    squadId: number,
    userId: number,
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const backButtonAsset = require('./assets/back_button.png');

const backButton = () => (
  <Image
    style={{ width: 75, height: 75 }}
    source={backButtonAsset}
  />
);

const hiddenHeaderOptions = {
  headerBackImage: backButton,
  headerBackTitleVisible: false,
  headerTitle: '',
  headerStyle: { shadowColor: 'transparent', height: 125 },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Ubuntu_700Bold,
    Ubuntu_400Regular,
    Inter_400Regular,
    Ubuntu_400Regular_Italic,
    Roboto_400Regular,
    Roboto_700Bold,
    SourceSansPro_400Regular_Italic,
    SourceSansPro_700Bold,
    SourceSansPro_400Regular,
  });

  if (!fontsLoaded) {
    return <AuthLoadingScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
          <Stack.Screen name='Squads' component={Squads} options={{ gestureEnabled: false, headerStyle: { shadowColor: 'transparent' }, headerTitle: '' }} />
          <Stack.Screen name='View Squad Settings' component={ViewSquad} options={hiddenHeaderOptions} />
          <Stack.Screen name='Edit Squad Settings' component={EditSquad} options={hiddenHeaderOptions} />
          <Stack.Screen name='AddNewSquad' component={AddNewSquad} options={hiddenHeaderOptions} />
          <Stack.Screen name='AddExistingSquad' component={AddExistingSquad} options={hiddenHeaderOptions} />
          <Stack.Screen name='Events' component={Events} options={hiddenHeaderOptions} />
          <Stack.Screen name='AddEditEvent' component={AddEditEvent} options={hiddenHeaderOptions} />
          <Stack.Screen name='EventDetails' component={EventDetails} />
          <Stack.Screen name='EditEvent' component={EditEvent} />
          <Stack.Screen name='Squad Members' component={SquadMembers} options={hiddenHeaderOptions} />
        </Stack.Navigator>
      </NavigationContainer>
      <FlashMessage position='top' hideStatusBar autoHide />
    </View>
  );
}
