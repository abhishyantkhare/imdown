import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, FlatList, Text, Button, TouchableHighlight } from "react-native";
import { callBackend } from "../backend/backend"
import Divider from "../components/divider/divider";
import { event_styles } from "./events_styles";
import moment from 'moment';

export type Event = {
  name: string,
  emoji?: string,
  description?: string,
  image_url?: string,
  start_ms?: number,
  end_ms?: number,
  rsvp_users: String[]
  url?: string
}

const SQUAD_CODE_TITLE_TEXT = "Squad Code: "

const Events = (props) => {
  const [events, setEvents] = useState([])
  const [squadId, setSquadId] = useState(props.route.params.squadId)
  const [squadCode, setSquadCode] = useState(props.route.params.squadCode)
  const [squadName, setSquadName] = useState(props.route.params.squadName)
  const [squadEmoji, setSquadEmoji] = useState(props.route.params.squadEmoji)
  const [userEmail, setUserEmail] = useState(props.route.params.userEmail)

  const goToAddEvent = () => {
    props.navigation.navigate("Add Event", {
      squadId: squadId,
      userEmail: userEmail,
      addEvent: addEvent
    });
  }

  // Converts response from backend for events into list of internally used Event objects
  const toEvents = (backendEvent) => {
    return backendEvent["events"].map((it) => {
      return {
        name: it.title,
        description: it.description,
        emoji: "🍗",
        image_url: it.image_url,
        start_ms: it.start_time,
        end_ms: it.end_time,
        // TODO: Query backend to get list of users.
        rsvp_users: [],
        url: it.event_url
      }
    })
  }

  useEffect(() => {
    const endpoint = 'get_events?squad_id=' + squadId
    const init: RequestInit = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
    }
    callBackend(endpoint, init).then(response => {
      return response.json();
    }).then(data => {
      setEvents(events.concat(toEvents(data)));
    });
  }, []);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={goToAddEvent}
          title="Add"
          color="#000"
        />
      ),
    });
  }, [props.navigation]);

  const addEvent = (newEvent: Event) => {
    setEvents(events.concat([newEvent]));
  }

  const goToEventDetailsPage = (event: Event) => {
    props.navigation.navigate("EventDetails", {
      event: event
    })
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



  const renderSquadCode = () => {
    return (
      <View style={event_styles.squad_code_container}>
        <View style={event_styles.squad_code}>
          <Text style={event_styles.squad_code_title_text}>
            {SQUAD_CODE_TITLE_TEXT}
          </Text>
          <Text style={event_styles.squad_code_value_text}>
            {squadCode}
          </Text>
        </View>
      </View>
    )
  }

  const renderEventItem = ({ item }: { item: Event }) => {
    return (
      <TouchableHighlight onPress={() => { goToEventDetailsPage(item) }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={event_styles.event_emoji_box}>
            <Text style={event_styles.event_emoji}>{item.emoji || ""}</Text>
          </View>

          <View style={event_styles.event_item}>
            <Text style={event_styles.event_time_proximity}>{`${calcEventProximity(item)}`}</Text>
            <Text style={event_styles.event_title}>{item.name}</Text>
            {item.description ? <Text>{`Description: ${item.description}\n`}</Text> : null}
            {item.start_ms ? <View>
              <Text style={event_styles.event_time}>
                <Text style={{ color: 'green' }}>
                  Start
                </Text>
                : {`${moment(item.start_ms).format('llll').toLocaleString()}`}
              </Text>
              <Text style={event_styles.event_time}>
                <Text style={{ color: 'red' }}>
                  End
                </Text>
                : {`${moment(item.end_ms).format('llll').toLocaleString()}`}
              </Text>
            </View> : <Text>{`Time: ${`TBD`}`}</Text>}
          </View>
        </View>
      </TouchableHighlight>
    );
  };
  return (
    <View style={event_styles.container}>
      <Text style={event_styles.group_title}>
        {squadEmoji} {squadName}
      </Text>
      {renderSquadCode()}
      <View style={event_styles.event_list_container}>
        <FlatList
          data={events.sort((a, b) => (a.start_ms == null && b.start_ms != null || a.start_ms > b.start_ms) ? 1 : -1)}
          renderItem={renderEventItem}
          style={event_styles.event_list}
        />
      </View>
    </View>
  );
}


export default Events;