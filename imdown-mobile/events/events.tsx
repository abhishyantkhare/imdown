import React, { useState, useLayoutEffect } from "react";
import { View, FlatList, Text, Button } from "react-native";
import Divider from "../components/divider/divider";
import { event_styles } from "./events_styles";
import AddEventModal from "./add_event"


const Events = (props) => {
  const [addEventModalVisible, setAddEventModalVisible] = useState(false)
  const [events, setEvents] = useState(props.route.params.events)

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => setAddEventModalVisible(true)}
          title="Add"
          color="#000"
        />
      ),
    });
  }, [props.navigation]);

  const addEvent = (eventName: string) => {
    setEvents(events.concat([eventName]));
    setAddEventModalVisible(false)
  }


  const renderSquadItem = ({ item, index, separators }) => {
    return (
      <View style={event_styles.event_item}>
        <Text>{item}</Text>
      </View>
    );
  };
  return (
    <View style={event_styles.events_container}>
      <FlatList
        ItemSeparatorComponent={Divider}
        data={events}
        renderItem={renderSquadItem}
        style={event_styles.event_list}
      />
      <AddEventModal
        visible={addEventModalVisible}
        onPress={addEvent}
      />
    </View>
  );
}


export default Events;
