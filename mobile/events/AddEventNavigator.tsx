import React from "react";
import AddEventUrlScreen from "./AddEventUrlScreen";
import { createStackNavigator } from "@react-navigation/stack";
import AddEventDetailsScreen from "./AddEventDetailsScreen";
import AddEventNameScreen from "./AddEventNameScreen";

const Stack = createStackNavigator();

const AddEventNavigator = ({ route }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Add Event Name" component={AddEventNameScreen} />
      <Stack.Screen name="Add Event URL" component={AddEventUrlScreen} />
      <Stack.Screen name="Add Event Details" component={AddEventDetailsScreen}
                    initialParams={{ squadId: route.params.squadId, userEmail: route.params.userEmail }} />
    </Stack.Navigator>
  );
};

export default AddEventNavigator;
