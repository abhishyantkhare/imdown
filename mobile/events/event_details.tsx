import React, { useState, useCallback } from "react";
import { FlatList, Image, Linking, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { EventDetailsStyles } from "./event_details_styles";
import moment from 'moment';
import Divider from '../components/divider/divider'
import { callBackend } from "../backend/backend"
import { RSVPUser } from "./events"
import { DEFAULT_EVENT, DOWN_EMOJI_HEIGHT, DOWN_EMOJI_WIDTH, EVENT_PIC_HEIGHT, EVENT_PIC_WIDTH, ROW_BUTTON_HEIGHT, ROW_BUTTON_WIDTH } from "../constants"
import { useFocusEffect } from "@react-navigation/native";

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
  creator_user_id: number,
  squad_id: number
}

// Converts response from backend for a single event into an internally used Event object
// Event object contains all necessary and related information regarding an Event. It is used both on Event Details and Edit Event page
export const toEvent = (backendEvent) => {
  return ({
    id: backendEvent.id,
    name: backendEvent.title,
    description: backendEvent.description,
    emoji: backendEvent.event_emoji,
    image_url: backendEvent.image_url,
    start_ms: backendEvent.start_time,
    end_ms: backendEvent.end_time,
    rsvp_users: backendEvent.event_responses.accepted,
    declined_users: backendEvent.event_responses.declined,
    url: backendEvent.event_url,
    down_threshold: backendEvent.down_threshold,
    creator_user_id: backendEvent.creator_user_id,
    squad_id: backendEvent.squad_id
  });
}

const EventDetails = (props) => {
  const eventId = props.route.params.eventId
  const userEmail = props.route.params.userEmail
  const userId = props.route.params.userId
  const numUsers = props.route.params.numUsers
  const [event, setEvent] = useState(DEFAULT_EVENT)
  const [isUserAccepted, setIsUserAccepted] = useState(false)
  const isUserEventAccepted = (event: Event) => {
    return event.rsvp_users.some(item => item.email === userEmail)
  }

  const getEventDetails = () => {
    const endpoint = 'get_event?event_id=' + eventId
    const init: RequestInit = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
    }
    callBackend(endpoint, init).then(response => {
      return response.json();
    }).then(data => {
      const updatedEvent: Event = toEvent(data);
      setEvent(updatedEvent);
      const isUserEventAccepted = updatedEvent.rsvp_users.some(item => item.email === userEmail);
      setIsUserAccepted(isUserEventAccepted);
    });
  }

  useFocusEffect(useCallback(getEventDetails, []))



  {/* Event title + pic + details box */ }
  const renderTitlePicDetailsBox = () => {
    return (
      <View style={EventDetailsStyles.event_pic_and_title_container}>
        {event.image_url ?
          <View style={EventDetailsStyles.event_picture}>
            <Image source={{ uri: event.image_url }}
              style={{ width: EVENT_PIC_WIDTH, height: EVENT_PIC_HEIGHT, borderRadius: 15 }}
            />
          </View> :
          <View></View>
        }
        <View style={EventDetailsStyles.event_title_container}>
          <Text style={EventDetailsStyles.event_title}>
            {event.name}
          </Text>
          <Text style={[EventDetailsStyles.event_time, { paddingTop: 10 }]}>
            {event.start_ms ? `🗓 Starts: ${moment(event.start_ms).format('llll').toLocaleString()}` : "Starts: TBD"}
          </Text>
          <Text style={EventDetailsStyles.event_time}>
            {event.end_ms ? `🗓 Ends: ${moment(event.end_ms).format('llll').toLocaleString()}` : "Ends: TBD"}
          </Text>
          {/* Commenting out URL for FMVP */}
          {/* { renderURLField() } */}
        </View>
      </View>
    );
  }

  const renderURLField = () => {
    return (
      event.url ?
        <Text onPress={() => event.url && Linking.openURL(`https://${event.url}`)} style={EventDetailsStyles.event_url}>
          {event.url}
        </Text> : null
    );
  };

  {/* Event description box */ }
  const renderEventDescriptionBox = () => {
    return (
      <Text style={EventDetailsStyles.event_description}>
        {event.description}
      </Text>
    );
  }

  const renderEventDownListBox = () => {
    return (
      <View style={EventDetailsStyles.down_list_outer_container}>
        <View style={EventDetailsStyles.down_list_emoji}>
          <Image source={require('../assets/down.png')} style={{ width: DOWN_EMOJI_WIDTH, height: DOWN_EMOJI_HEIGHT }} />
        </View>
        <View style={EventDetailsStyles.down_list_inner_container}>
          <Text style={EventDetailsStyles.down_list_title}>
            {/* Hard code for now. Will calculate once hooked up */}
            {`${calculateDownRSVPPercentage(event.rsvp_users.length)}% Down (${event.rsvp_users.length}/${numUsers})`}
          </Text>
          <FlatList
            data={event.rsvp_users}
            renderItem={renderRSVPUser}
            keyExtractor={item => item.user_id.toString()}
          />
        </View>
      </View>
    );
  }

  const renderRSVPUser = ({ item }: { item: RSVPUser }) => {
    return (
      <View>
        <Text style={EventDetailsStyles.rsvp_user}>{item.email}</Text>
      </View>
    );
  };

  {/* Button row */ }
  const renderBottomRowButtons = () => {
    return (
      <View style={EventDetailsStyles.button_row_container}>
        {renderDeleteButton()}
        {renderRSVPButton()}
        {renderEditButton()}
      </View>
    );
  };

  const renderDeleteButton = () => {
    if (event.creator_user_id == userId) {
      return (
        <TouchableOpacity onPress={() => { deleteEvent() }} style={EventDetailsStyles.delete_event_container}>
          <Image source={require('../assets/delete_icon.png')} style={{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }} />
          <Text style={EventDetailsStyles.button_row_text}> delete </Text>
        </TouchableOpacity>
      );
    } else {
      return (<View></View>);
    }
  }

  const renderRSVPButton = () => {
    if (isUserAccepted) {
      return (
        <TouchableOpacity onPress={() => { callBackendRespondToEvent(false) }} style={EventDetailsStyles.rsvp_button_container}>
          <Image source={require('../assets/cancel_rsvp.png')} style={{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }} />
          <Text style={EventDetailsStyles.button_row_text}> decline </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => { callBackendRespondToEvent(true) }} style={EventDetailsStyles.rsvp_button_container}>
          <Image source={require('../assets/accept_rsvp.png')} style={{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }} />
          <Text style={EventDetailsStyles.button_row_text}> accept </Text>
        </TouchableOpacity>
      );
    }
  }

  const renderEditButton = () => {
    if (event.creator_user_id == userId) {
      return (
        <TouchableOpacity onPress={() => { goToEditEvent(event) }} style={EventDetailsStyles.edit_event_container}>
          <Image source={require('../assets/edit_event.png')} style={{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }} />
          <Text style={EventDetailsStyles.button_row_text}> edit </Text>
        </TouchableOpacity>
      );
    } else {
      return (<View></View>);
    }
  }

  const callBackendRespondToEvent = (rsvpResponse: Boolean) => {
    const endpoint = 'respond_to_event'
    const data = {
      email: userEmail,
      event_id: event.id,
      response: rsvpResponse
    }
    const init: RequestInit = {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
    }
    callBackend(endpoint, init).then(() => { callBackendRefreshEventInfo() })
  }

  const callBackendRefreshEventInfo = () => {
    const endpoint = 'get_event?event_id=' + event.id
    const init: RequestInit = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
    }
    callBackend(endpoint, init).then(response => {
      return response.json();
    }).then(data => {
      const updatedEvent = toEvent(data)
      setEvent(updatedEvent)
      setIsUserAccepted(isUserEventAccepted(updatedEvent))
    });
  }

  const deleteEvent = () => {
    const endpoint = 'event?event_id=' + event.id
    const init: RequestInit = {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
    }
    callBackend(endpoint, init).then(() => { props.navigation.pop() });
  }


  const calculateDownRSVPPercentage = (num_accepted: number) => {
    return Math.round(num_accepted * 100 / (numUsers))
  }

  const goToEditEvent = (event: Event) => {
    props.navigation.navigate("Edit Event", {
      event: event,
      userEmail: userEmail,
      setEvent: setEvent,
      numUsers: numUsers
    });
  }

  return (
    <View style={EventDetailsStyles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" >
        {/* Event title + pic + details box */}
        {renderTitlePicDetailsBox()}
        <Divider />
        {/* Event description box */}
        {renderEventDescriptionBox()}
        <Divider />
        {/* Event "down list" box */}
        <Text style={EventDetailsStyles.down_threshold_text}> {`A calendar invite will be created once ${event.down_threshold} ${event.down_threshold > 1 ? "people are" : "person is"} down!`} </Text>
        {renderEventDownListBox()}
        <Divider />
      </ScrollView>
      {/* Button row */}
      {renderBottomRowButtons()}
    </View>
  );
}

export default EventDetails;
