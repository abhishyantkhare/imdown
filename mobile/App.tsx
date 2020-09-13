import React from "react";
import Login from "./login/login";
import { AddNewSquad } from "./squads/add_squad";
import { AddExistingSquad } from "./squads/add_squad";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Squads from "./squads/squads";
import Events from "./events/events";
import AddEvent from "./events/AddEvent"
import EventDetails from "./events/event_details";
import EditEvent from "./events/edit_event";
import ViewSquad from "./squads/ViewSquadSettings";
import EditSquad from "./squads/EditSquadSettings";
import SquadMembers from "./squads/SquadMembers";
import { Ubuntu_400Regular, Ubuntu_400Regular_Italic, Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import { SourceSansPro_400Regular, SourceSansPro_700Bold, SourceSansPro_400Regular_Italic } from '@expo-google-fonts/source-sans-pro';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Image, View } from "react-native";
import FlashMessage from "react-native-flash-message";
import AuthLoadingScreen from './login/AuthLoadingScreen';
import { SquadRouteParams } from "./types/squad"


export type RootStackParamList = {
  AddSquad: {
    email: string;
  };
  AddEvent: SquadRouteParams;
  Events: SquadRouteParams;
  SquadMembers: {
    isInEditView: boolean;
    squadId: number;
    userId: number;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const backButton = () => {
  return (
    <Image style={{ width: 75, height: 75 }} source={require('./assets/back_button.png')} />
  );
}

const hiddenHeaderOptions = {
  headerBackImage: backButton,
  headerBackTitleVisible: false,
  headerTitle: "",
  headerStyle: { shadowColor: 'transparent', height: 125 }
}

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
    SourceSansPro_400Regular
  });

  if (!fontsLoaded) {
    return <AuthLoadingScreen />;
  } else {
    return (
      <View style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Squads" component={Squads} options={{ gestureEnabled: false, headerStyle:{ shadowColor: 'transparent' }, headerTitle: "" }} />
            <Stack.Screen name="View Squad Settings" component={ViewSquad} options={hiddenHeaderOptions} />
            <Stack.Screen name="Edit Squad Settings" component={EditSquad} options={hiddenHeaderOptions} />
            <Stack.Screen name="Add New Squad" component={AddNewSquad} options={hiddenHeaderOptions} />
            <Stack.Screen name="Add Existing Squad" component={AddExistingSquad} options={hiddenHeaderOptions} />
            <Stack.Screen name="Events" component={Events} options={hiddenHeaderOptions} />
            <Stack.Screen name="Add Event" component={AddEvent} options={hiddenHeaderOptions} />
            <Stack.Screen name="EventDetails" component={EventDetails} />
            <Stack.Screen name="Edit Event" component={EditEvent} />
            <Stack.Screen name="Squad Members" component={SquadMembers} options={hiddenHeaderOptions} />
          </Stack.Navigator>
        </NavigationContainer>
        <FlashMessage position="top" hideStatusBar={true} autoHide={true} />
      </View>
    );
  }
}
