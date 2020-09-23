import React, { useState, useCallback } from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

import EventDetailsStyles from './EventDetailsStyles';
import Divider from '../components/divider/Divider';
import { callBackend, getUsersInSquad } from '../backend/backend';
import { RSVPUser } from './Events';
import {
  DEFAULT_EVENT,
  DOWN_EMOJI_HEIGHT,
  DOWN_EMOJI_WIDTH,
  EVENT_PIC_HEIGHT,
  EVENT_PIC_WIDTH,
  ROW_BUTTON_HEIGHT,
  ROW_BUTTON_WIDTH,
} from '../constants';
import { AppNavigationProp, AppRouteProp } from '../types/navigation';

export type Event = {
  id: number,
  name: string,
  emoji?: string,
  description?: string,
  imageUrl?: string,
  startMs?: number,
  endMs?: number,
  rsvpUsers: RSVPUser[],
  declinedUsers: RSVPUser[],
  url?: string,
  downThreshold: number,
  creatorUserId: number,
  squadId?: number
}

const backendEventResponseListToRSVPUser = (backendERList: any[]) => backendERList.map(
  (backendUser: any) => (
    {
      userId: backendUser.user_id,
      email: backendUser.email,
    }),
);

// Converts response from backend for a single event into an internally used Event object
// Event object contains all necessary and related information regarding an Event. It is used
// both on Event Details and Edit Event page
export const toEvent = (backendEvent: any) => (
  {
    id: backendEvent.id,
    name: backendEvent.title,
    description: backendEvent.description,
    emoji: backendEvent.event_emoji,
    imageUrl: backendEvent.image_url,
    startMs: backendEvent.start_time,
    endMs: backendEvent.end_time,
    rsvpUsers: backendEventResponseListToRSVPUser(backendEvent.event_responses.accepted),
    declinedUsers: backendEventResponseListToRSVPUser(backendEvent.event_responses.declined),
    url: backendEvent.event_url,
    downThreshold: backendEvent.down_threshold,
    creatorUserId: backendEvent.creator_user_id,
    squadId: backendEvent.squad_id,
  }
);
type EventDetailsProps = {
  navigation: AppNavigationProp<'EventDetails'>;
  route: AppRouteProp<'EventDetails'>;
};

const deleteIcon = require('../assets/delete_icon.png');
const editEvent = require('../assets/edit_event.png');
const downButton = require('../assets/down.png');
const cancelRSVP = require('../assets/cancel_rsvp.png');
const acceptRSVP = require('../assets/accept_rsvp.png');

const EventDetails = ({ route, navigation }: EventDetailsProps) => {
  const {
    eventId,
    squadRouteParams,
  } = route.params;
  const [event, setEvent] = useState(DEFAULT_EVENT);
  const [isUserAccepted, setIsUserAccepted] = useState(false);
  const [numUsers, setNumUsers] = useState<number>(1);
  const isUserEventAccepted = (acceptedEvent: Event) => (
    acceptedEvent.rsvpUsers.some((item) => item.email === squadRouteParams.userEmail)
  );

  const getEventDetails = () => {
    const endpoint = `get_event?event_id=${eventId}`;
    const init: RequestInit = { // eslint-disable-line no-undef
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    callBackend(endpoint, init).then((response) => response.json())
      .then((data) => {
        const updatedEvent: Event = toEvent(data);
        setEvent(updatedEvent);
        const isUserAcceptedEvent = updatedEvent.rsvpUsers.some(
          (item) => item.email === squadRouteParams.userEmail,
        );
        setIsUserAccepted(isUserAcceptedEvent);
      });
  };

  const getNumUsers = () => {
    getUsersInSquad(squadRouteParams.squadId).then((data) => {
      setNumUsers(data.user_info.length);
    });
  };

  useFocusEffect(useCallback(() => {
    getNumUsers();
    getEventDetails();
  }, []));

  /* Event title + pic + details box */
  const renderTitlePicDetailsBox = () => (
    <View style={EventDetailsStyles.eventPicAndTitleContainer}>
      {event.imageUrl
        ? (
          <View style={EventDetailsStyles.eventPicture}>
            <Image
              source={{ uri: event.imageUrl }}
              style={{ width: EVENT_PIC_WIDTH, height: EVENT_PIC_HEIGHT, borderRadius: 15 }}
            />
          </View>
        ) : <View />}
      <View style={EventDetailsStyles.eventTitleContainer}>
        <Text style={EventDetailsStyles.eventTitle}>
          {event.name}
        </Text>
        <Text style={[EventDetailsStyles.eventTime, { paddingTop: 10 }]}>
          {event.startMs ? `🗓 Starts: ${moment(event.startMs).format('llll').toLocaleString()}` : 'Starts: TBD'}
        </Text>
        <Text style={EventDetailsStyles.eventTime}>
          {event.endMs ? `🗓 Ends: ${moment(event.endMs).format('llll').toLocaleString()}` : 'Ends: TBD'}
        </Text>
        {/* Commenting out URL for FMVP */}
        {/* { renderURLField() } */}
      </View>
    </View>
  );

  // const renderURLField = () => (
  //   event.url
  //     ? (
  //       <Text onPress={() => event.url && Linking.openURL(`https://${event.url}`)} style={EventDetailsStyles.event_url}>
  //         {event.url}
  //       </Text>
  //     ) : null
  // );

  /* Event description box */
  const renderEventDescriptionBox = () => (
    <Text style={EventDetailsStyles.eventDescription}>
      {event.description}
    </Text>
  );

  const renderRSVPUser = ({ item }: { item: RSVPUser }) => ( // eslint-disable-line
    <View>
      <Text style={EventDetailsStyles.rsvpUser}>{item.email}</Text>
    </View>
  );

  const callBackendRefreshEventInfo = () => {
    const endpoint = `get_event?event_id=${event.id}`;
    const init: RequestInit = { // eslint-disable-line no-undef
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    callBackend(endpoint, init).then((response) => response.json())
      .then((data) => {
        const updatedEvent = toEvent(data);
        setEvent(updatedEvent);
        setIsUserAccepted(isUserEventAccepted(updatedEvent));
      });
  };

  const callBackendRespondToEvent = (rsvpResponse: Boolean) => {
    const endpoint = 'respond_to_event';
    const data = {
      eventId: event.id,
      response: rsvpResponse,
    };
    const init: RequestInit = { // eslint-disable-line no-undef
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    callBackend(endpoint, init).then(callBackendRefreshEventInfo);
  };

  const calculateDownRSVPPercentage = (numAccepted: number) => (
    Math.round((numAccepted * 100) / (numUsers))
  );

  const renderEventDownListBox = () => (
    <View style={EventDetailsStyles.downListOuterContainer}>
      <View style={EventDetailsStyles.downListEmoji}>
        <Image source={downButton} style={{ width: DOWN_EMOJI_WIDTH, height: DOWN_EMOJI_HEIGHT }} />
      </View>
      <View style={EventDetailsStyles.downListInnerContainer}>
        <Text style={EventDetailsStyles.downListTitle}>
          {/* Hard code for now. Will calculate once hooked up */}
          {`${calculateDownRSVPPercentage(event.rsvpUsers.length)}% Down (${event.rsvpUsers.length}/${numUsers})`}
        </Text>
        <FlatList
          data={event.rsvpUsers}
          renderItem={renderRSVPUser}
          keyExtractor={(item) => item.userId.toString()}
        />
      </View>
    </View>
  );

  const renderRSVPButton = () => {
    if (isUserAccepted) {
      return (
        <TouchableOpacity
          onPress={() => { callBackendRespondToEvent(false); }}
          style={EventDetailsStyles.rsvpButtonContainer}
        >
          <Image
            source={cancelRSVP}
            style={{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }}
          />
          <Text style={EventDetailsStyles.buttonRowText}> decline </Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => { callBackendRespondToEvent(true); }}
        style={EventDetailsStyles.rsvpButtonContainer}
      >
        <Image source={acceptRSVP} style={{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }} />
        <Text style={EventDetailsStyles.buttonRowText}> accept </Text>
      </TouchableOpacity>
    );
  };

  const goToEditEvent = (editEvent: Event) => { // eslint-disable-line
    navigation.navigate('AddEditEvent', {
      isEditView: true,
      prevEvent: editEvent,
      squadRouteParams,
    });
  };

  const renderEditButton = () => {
    if (event.creatorUserId === squadRouteParams.userId) {
      return (
        <TouchableOpacity
          onPress={() => { goToEditEvent(event); }}
          style={EventDetailsStyles.editEventContainer}
        >
          <Image
            source={editEvent}
            style={{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }}
          />
          <Text style={EventDetailsStyles.buttonRowText}> edit </Text>
        </TouchableOpacity>
      );
    }
    return (<View />);
  };

  const deleteEvent = () => {
    const endpoint = `event?event_id=${event.id}`;
    const init: RequestInit = { // eslint-disable-line no-undef
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    callBackend(endpoint, init).then(() => { navigation.pop(); });
  };

  const renderDeleteButton = () => {
    if (event.creatorUserId === squadRouteParams.userId) {
      return (
        <TouchableOpacity
          onPress={() => { deleteEvent(); }}
          style={EventDetailsStyles.deleteEventContainer}
        >
          <Image
            source={deleteIcon}
            style={{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }}
          />
          <Text style={EventDetailsStyles.buttonRowText}> delete </Text>
        </TouchableOpacity>
      );
    }

    return (<View />);
  };

  /* Button row */
  const renderBottomRowButtons = () => (
    <View style={EventDetailsStyles.buttonRowContainer}>
      {renderDeleteButton()}
      {renderRSVPButton()}
      {renderEditButton()}
    </View>
  );

  return (
    <View style={EventDetailsStyles.container}>
      <ScrollView keyboardShouldPersistTaps='handled'>
        {/* Event title + pic + details box */}
        {renderTitlePicDetailsBox()}
        <Divider />
        {/* Event description box */}
        {renderEventDescriptionBox()}
        <Divider />
        {/* Event 'down list' box */}
        <Text style={EventDetailsStyles.downThresholdText}>
          {`A calendar invite will be created once ${event.downThreshold} ${event.downThreshold > 1 ? 'people are' : 'person is'} down!`}
        </Text>
        {renderEventDownListBox()}
        <Divider />
      </ScrollView>
      {/* Button row */}
      {renderBottomRowButtons()}
    </View>
  );
};

export default EventDetails;
