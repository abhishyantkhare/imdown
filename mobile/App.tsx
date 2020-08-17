import React from "react";
import Login from "./login/login";
import AddSquad from "./squads/add_squad";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Squads from "./squads/squads";
import Events from "./events/events";
import AddEventNavigator from "./events/AddEventNavigator";
import EventDetails from "./events/event_details";
import EditEvent from "./events/edit_event";
import EditSquad from "./squads/edit_squad"
import SquadMembers from "./squads/squad_members";
import { Ubuntu_400Regular, Ubuntu_400Regular_Italic, Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import { AppLoading } from 'expo';

export type RootStackParamList = {
  AddSquad: {
    email: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    Ubuntu_700Bold,
    Ubuntu_400Regular,
    Inter_400Regular,
    Ubuntu_400Regular_Italic
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Squads" component={Squads} options={{ gestureEnabled: false }} />
          <Stack.Screen name="Edit Squad" component={EditSquad} />
          <Stack.Screen name="Add Squad" component={AddSquad} />
          <Stack.Screen name="Events" component={Events} />
          <Stack.Screen name="Add Event" component={AddEventNavigator} />
          <Stack.Screen name="EventDetails" component={EventDetails} />
          <Stack.Screen name="Edit Event" component={EditEvent} />
          <Stack.Screen name="SquadMembers" component={SquadMembers} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
