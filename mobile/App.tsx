import React from "react";
import Login from "./login/login";
import AddSquadModal from "./squads/add_squad";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Squads from "./squads/squads";
import Events from "./events/events";
import AddEvent from "./events/add_event";
import EventDetails from "./events/event_details";
import EditEvent from "./events/edit_event";
import SquadMembers from "./squads/squad_members";
import { Ubuntu_400Regular, Ubuntu_400Regular_Italic, Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import { AppLoading } from 'expo';


const Stack = createStackNavigator();

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
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Squads" component={Squads} />
          <Stack.Screen name="Add Squad" component={AddSquadModal} />
          <Stack.Screen name="Events" component={Events} />
          <Stack.Screen name="Add Event" component={AddEvent} />
          <Stack.Screen name="EventDetails" component={EventDetails} />
          <Stack.Screen name="Edit Event" component={EditEvent} />
          <Stack.Screen name="SquadMembers" component={SquadMembers} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
