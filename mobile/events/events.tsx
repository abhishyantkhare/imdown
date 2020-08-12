import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, FlatList, Text, Button, TouchableHighlight, TouchableOpacity } from "react-native";
import { callBackend } from "../backend/backend"
import Divider from "../components/divider/divider";
import { event_styles } from "./events_styles";
import moment from 'moment';
import  SquadMembers  from "../squads/squad_members"
import { useFocusEffect } from '@react-navigation/native';

const SQUAD_CODE_TITLE_TEXT = "Squad Code: "

export type Event = {
  id: number,
  name: string,
  emoji?: string,
  description?: string,
  image_url?: string,
  start_ms?: number,
  end_ms?: number,
  rsvp_users: RSVPUser[],
  declined_users: RSVPUser[],
  url?: string,
  down_threshold: number,
  creator_email: string
}


export type RSVPUser = {
  user_id: String,
  email: String
}

// Converts response from backend for events into list of internally used Event objects
export const toEvents = (backendEvent) => {
  return backendEvent.map( (it) => {
    return {
      id: it.id,
      name: it.title,
      description: it.description,
      emoji: it.event_emoji,
      image_url: it.image_url,
      start_ms: it.start_time,
      end_ms: it.end_time,
      rsvp_users: it.event_responses.accepted,
      declined_users: it.event_responses.declined,
      url: it.event_url,
      down_threshold: it.down_threshold,
      creator_email: it.creator_email
    }
  })
}

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
      userEmail: userEmail
    });
  }

  const goToSquadMembersPage = (squadId: number) => {
    props.navigation.navigate("SquadMembers", {
      squadId: squadId
    })
  }

  useFocusEffect(
      React.useCallback(() => {
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
        setEvents(toEvents(data));
      });
    }, [])
  );

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

  const goToEventDetailsPage = (event: Event) => {
    props.navigation.navigate("EventDetails", {
      eventId: event.id,
      userEmail: userEmail
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

  const calcDownPercentage = (event: Event) => {
    const numDown = event.rsvp_users.length
    const totalNumPeople = event.rsvp_users.length + event.declined_users.length
    const percentage = Math.round(numDown*100/totalNumPeople)
    return percentage
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

  const renderDownBar = (event: Event) => {
    const downPercentage = calcDownPercentage(event)
    const barColor = event.rsvp_users.length >= event.down_threshold ? '#68EDC6' : '#C7F9FF'
    const borderRightRadii = downPercentage > 95 ? 15 : 0
    const barWidth = `${downPercentage}%`
    const inlineStyleJSON = {
      backgroundColor: barColor,
      borderBottomRightRadius: borderRightRadii, 
      borderTopRightRadius: borderRightRadii,
      width: barWidth, 
    }
    return (<View style = {[ event_styles.down_bar, inlineStyleJSON]}>
          </View>);
  }

  const renderEventItem = ({ item }: { item: Event }) => {
    return (
      <TouchableOpacity activeOpacity={.7}  onPress={() => { goToEventDetailsPage(item) }}>
        <View style={event_styles.event_item_outer_box}>
          { renderDownBar(item) }
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
      </TouchableOpacity>
    );
  };
  return (
    <View style={event_styles.container}>
      <TouchableOpacity onPress={() => { goToSquadMembersPage(squadId) }}>
        <Text style={event_styles.group_title}>
          {squadEmoji} {squadName}
        </Text>
      </TouchableOpacity>
      {renderSquadCode()}
      <View style={event_styles.event_list_container}>
        <FlatList
          data={events.sort((a, b) => (a.start_ms == null && b.start_ms != null || a.start_ms > b.start_ms) ? 1 : -1)}
          renderItem={renderEventItem}
          style={event_styles.event_list}
          keyExtractor={(item, index) => index.toString()}
          />
      </View>
    </View>
  );
}


export default Events;
