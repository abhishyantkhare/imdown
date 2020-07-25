import React from "react";
import Login from "./login/login";
import AddSquadModal from "./squads/add_squad";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Squads from "./squads/squads";
import Events from "./events/events";
import AddEvent from "./events/add_event";
import { Ubuntu_400Regular, Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';
import { Inter_400Regular } from '@expo-google-fonts/inter';


const Stack = createStackNavigator();

export default function App() {
  useFonts({
    Ubuntu_700Bold,
    Ubuntu_400Regular,
    Inter_400Regular
  });
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="Squads"
          component={Squads}
        />
        <Stack.Screen name="Add Squad" component={AddSquadModal} />
        <Stack.Screen name="Events" component={Events} />
        <Stack.Screen name="Add Event" component={AddEvent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
