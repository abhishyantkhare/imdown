import React, { useState, useLayoutEffect } from "react";
import { View, FlatList, Text, Button } from "react-native";
import Divider from "../components/divider/divider";
import { event_styles } from "./events_styles";
import AddEventModal from "./add_event"
import moment from 'moment';

export type Event = {
  name: string,
  emoji?: string,
  description?: string,
  start_ms?: number,
  end_ms?: number
}


const Events = (props) => {
  const [addEventModalVisible, setAddEventModalVisible] = useState(false)
  const [events, setEvents] = useState(props.route.params.events)
  const groupName = props.route.params.groupName

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

  // Given event, returns string that describes how far (time-wise) event is from now.
  // For ex: "ended 3 days ago" / "starts 3 minutes from now" / "happening now!"
  const calcEventProximity = (event: Event) => {
    const now = parseInt(moment().format('x'))
    if (event.start_ms != null) {
      if (now < event.start_ms) {
        return "starts " + moment(event.start_ms).fromNow().toLocaleString()
      } else if (now >= event.start_ms && ((event.end_ms != null && now < event.end_ms) || event.end_ms == null)) {
        return "happening now!"
      } else {
        return "ended " + moment(event.end_ms).fromNow().toLocaleString()
      }
    } else if (event.end_ms != null && now > event.end_ms) {
      return "ended " + moment(event.end_ms).fromNow().toLocaleString()
    } else {
      return ""
    }
  }


  const renderEventItem = ({ item }: { item: Event }) => {    
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={event_styles.event_emoji_box}>
          <Text style={event_styles.event_emoji}>{item.emoji || "" }</Text>
        </View>

        <View style={event_styles.event_item}>
          <Text style={event_styles.event_time_proximity}>{`${calcEventProximity(item)}`}</Text>
          <Text style={event_styles.event_title}>{item.name}</Text>
          {item.description ? <Text>{`Description: ${item.description}\n`}</Text> : null}
          {item.start_ms ? <View>
            <Text style={event_styles.event_time}>
              <Text style={{color: 'green'}}>
                Start
              </Text>
              : {`${moment(item.start_ms).format('llll').toLocaleString()}`}
            </Text>
            <Text style={event_styles.event_time}>
              <Text style={{color: 'red'}}>
                End
              </Text>
              : {`${moment(item.end_ms).format('llll').toLocaleString()}`}
            </Text>
          </View> : <Text>{`Time: ${`TBD`}`}</Text>}
        </View>  
      </View>
      
    );
  };
  return (
    <View style={event_styles.container}>
      <Text style={event_styles.group_title}>
        {groupName}
      </Text>
      <View style={event_styles.event_list_container}>
        <FlatList
          data={events.sort((a, b) => (a.start_ms == null && b.start_ms != null || a.start_ms > b.start_ms) ? 1 : -1)}
          renderItem={renderEventItem}
          style={event_styles.event_list}
        />
      </View>
      <AddEventModal
        visible={addEventModalVisible}
        onPress={addEvent}
      />
    </View>
  );
}


export default Events;
