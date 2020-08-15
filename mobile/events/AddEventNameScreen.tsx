import React, { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { AddEventStyles } from "./add_event_styles";

/**
 * This is the entry screen. Enter a title and navigate directly to the details page, or navigate to the URL search
 * screen.
 */
const AddEventNameScreen = ({ navigation, route }) => {
  const [name, setName] = useState("");

  const goToAddMoreInfo = () => {
    navigation.navigate("Add Event Details", { name });
  };

  return (
    <View style={AddEventStyles.container}>
      {/*<View style={AddEventStyles.topRightButton}>*/}
      {/*  <Button title="From URL" onPress={() => navigation.navigate("Add Event URL")} />*/}
      {/*</View>*/}
      <TextInput autoFocus onChangeText={setName} placeholder="Event name" style={AddEventStyles.largeTextInput} />
      <View style={AddEventStyles.nextButton}>
        <Button title="Next" onPress={goToAddMoreInfo} disabled={!name} />
      </View>
    </View>
  );
};

export default AddEventNameScreen;
