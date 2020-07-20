import React from "react";
import Login from "./login/login";
import AddSquadModal from "./squads/add_squad";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Squads from "./squads/squads";
import { Button, ShadowPropTypesIOS } from "react-native";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="Squads"
          component={Squads}
        />
        <Stack.Screen name="Add Squad" component={AddSquadModal} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
