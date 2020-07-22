import React, { useState, useLayoutEffect } from "react";
import { View, FlatList, Text, Button } from "react-native";
import Divider from "../components/divider/divider";
import { event_styles } from "./events_styles";
import AddEventModal from "./add_event"
import moment from 'moment';

export type Event = {
  name: string,
  description?: string,
  start_ms?: number,
  end_ms?: number
}


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

  const addEvent = (newEvent: Event) => {
    setEvents(events.concat([newEvent]));
    setAddEventModalVisible(false)
  }


  const renderSquadItem = ({ item }: { item: Event }) => {
    return (
      <View style={event_styles.event_item}>
        <Text>{`Name: ${item.name}`}</Text>
        {item.description ? <Text>{`Description: ${item.description}`}</Text> : null}
        {item.start_ms ? <View>
          <Text>{`Start: ${moment(item.start_ms).toLocaleString()}`}</Text>
          <Text>{`End: ${moment(item.end_ms).toLocaleString()}`}</Text>
        </View> : <Text>{`Time: ${`TBD`}`}</Text>}
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
