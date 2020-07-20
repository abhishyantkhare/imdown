import React from "react";
import Login from "./login/login";
import AddGroupModal from "./groups/add_group";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Groups from "./groups/groups";
import { Button, ShadowPropTypesIOS } from "react-native";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="Groups"
          component={Groups}
          options={({ navigation }) => ({
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate("Add Group")}
                title="Add"
                color="#000"
              />
            )
          })}
        />
        <Stack.Screen name="Add Group" component={AddGroupModal} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
