import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

import BlurModal from '../components/blurmodal/BlurModal';
import EventDetailsStyles from './EventDetailsStyles';
import Divider from '../components/divider/Divider';
import { callBackend } from '../backend/backend';
import TextStyles from '../TextStyles';
import { RSVPUser } from './Events';
import StandardButton from '../components/button/Button';
import {
  DEFAULT_EVENT,
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
      photo: backendUser.photo,
      name: backendUser.name,
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

const editEvent = require('../assets/create_24px.png');
const eventScheduled = require('../assets/wb_sunny_24px.png');
const eventTime = require('../assets/event_24px.png');
const downThreshold = require('../assets/perm_contact_calendar_24px.png');
const excitedIcon = require('../assets/excited_notif.png');

const EventDetails = ({ route, navigation }: EventDetailsProps) => {
  const {
    eventId,
    squadRouteParams,
  } = route.params;
  const { userId } = squadRouteParams;
  const [event, setEvent] = useState(DEFAULT_EVENT);
  const [isUserAccepted, setIsUserAccepted] = useState(false);
  const [excitedModalVisible, setExcitedModalVisible] = useState(false);
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

  useFocusEffect(useCallback(() => {
    getEventDetails();
  }, []));

  const renderEditButton = () => {
    if (event.creatorUserId === userId) {
      return (
        <TouchableOpacity
          onPress={() => { goToEditEvent(event); }}
          style={EventDetailsStyles.editEventContainer}
        >
          <Image
            source={editEvent}
            style={{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }}
          />
        </TouchableOpacity>
      );
    }
    return (<View />);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={EventDetailsStyles.headerRight}>
          {renderEditButton()}
        </View>
      ),
    });
  }, [navigation, event]);

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

  const goToAcceptedDeclinedResponses = (tabViewIndex: number) => {
    navigation.navigate('AcceptedDeclinedScreen', {
      rsvpUsers: event.rsvpUsers,
      declinedUsers: event.declinedUsers,
      tabViewIndex,
    });
  };

  /* Event Image */
  const renderEventImage = () => (
    <View style={EventDetailsStyles.eventImageContainer}>
      {event.imageUrl
        ? (
          <View style={EventDetailsStyles.eventPicture}>
            <Image
              source={{ uri: event.imageUrl }}
              style={EventDetailsStyles.eventImage}
            />
          </View>
        )
        : <View />}

    </View>
  );

  /* Event name, emoji, and accepted/declined # */
  const renderEventScheduledNotice = () => {
    if (event.rsvpUsers.length === event.downThreshold) {
      return (
        <View style={EventDetailsStyles.eventScheduledNoticeContainer}>
          <Image source={eventScheduled} />
          <View style={EventDetailsStyles.eventNoticeTextContainer}>
            <Text style={EventDetailsStyles.eventNoticeHeader}>
              Event Scheduled!
            </Text>
            <Text style={EventDetailsStyles.eventNoticeText}>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              You'll receive a Calendar invite automatically if you accept the event.
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View />
    );
  };

  const goToEditEvent = (editEvent: Event) => { // eslint-disable-line
    navigation.navigate('AddEditEvent', {
      isEditView: true,
      prevEvent: editEvent,
      squadRouteParams,
    });
  };

  // TODO: Show event expired after rsvp deadline feature has been implemented

  // <View style={EventDetailsStyles.event_expired_notice_container}>
  //   <Image source={require('../assets/sentiment_dissatisfied_24px.png')} />
  //   <View style={EventDetailsStyles.event_notice_text_container}>
  //     <Text style={EventDetailsStyles.event_notice_header}>
  //       Event Expired!
  //     </Text>
  //     <Text style={EventDetailsStyles.event_notice_text}>
  //       Not enough people accepted the invitation in time.
  //     </Text>
  //   </View>
  // </View>

  const renderAcceptedDeclinedPartition = (
    tabViewIndex: number,
    userCount: number, text:
    string,
  ) => (
    <TouchableOpacity onPress={() => { goToAcceptedDeclinedResponses(tabViewIndex); }}>
      <View style={{ flexDirection: 'column', alignItems: 'center', alignContent: 'center' }}>
        <Text style={EventDetailsStyles.acceptedDeclinedNumber}>
          {userCount}
        </Text>
        <Text style={EventDetailsStyles.acceptedDeclinedText}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderAcceptedDeclinedSection = () => (
    <View style={EventDetailsStyles.acceptedDeclinedButton}>
      {renderAcceptedDeclinedPartition(0, event.rsvpUsers.length, 'ACCEPTED')}
      <Divider vertical />
      {renderAcceptedDeclinedPartition(1, event.declinedUsers.length, 'DECLINED')}
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
    <View style={EventDetailsStyles.eventDescriptionContainer}>
      <Text style={EventDetailsStyles.eventDescriptionAbout}>
        About this event
      </Text>
      <Text style={TextStyles.paragraph}>
        {event.description}
      </Text>
    </View>
  );

  /* Event time, down threshold, address */
  const renderOtherDetails = () => (
    <View style={EventDetailsStyles.otherEventDetailsContainer}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingBottom: 20, paddingTop: 20,
      }}
      >
        <Image source={eventTime} />
        <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
          <Text style={EventDetailsStyles.eventTime}>
            {event.startMs ? `${moment(event.startMs).format('LLLL').toLocaleString()}` : 'TBD'}
            {' '}
            -
            {event.endMs ? `${moment(event.endMs).format('LLL').toLocaleString()}` : 'TBD'}
          </Text>
        </View>
      </View>

      {/* TODO: Address field will go here */}

      <View style={{
        flexDirection: 'row', alignItems: 'center', alignContent: 'center', paddingBottom: 20,
      }}
      >
        <Image source={downThreshold} />
        <Text style={EventDetailsStyles.downThresholdText}>
          Minimum
          {' '}
          {event.downThreshold}
          {' '}
          attendees
        </Text>
      </View>
    </View>
  );

  const renderAcceptDeclineButton = (
    response: boolean,
    borderColor: string,
    backgroundColor: string,
    textColor: string, text:
    string,
  ) => (
    <StandardButton
      onPress={() => {
        if (response && isUserAccepted) {
          setExcitedModalVisible(true);
        } else {
          callBackendRespondToEvent(response);
        }
      }}
      overrideStyle={[EventDetailsStyles.buttonContainer,
        {
          borderColor,
          backgroundColor,
        }]}
      textOverrideStyle={[EventDetailsStyles.acceptDeclineButtonText,
        { color: textColor }]}
      text={text}
    />
  );

  const renderExcitedModal = () => (
    <BlurModal visible={excitedModalVisible}>
      <Image source={excitedIcon} style={EventDetailsStyles.excitedIcon} />
      <View style={EventDetailsStyles.excitedModalTextContainer}>
        <Text style={[TextStyles.paragraph, { textAlign: 'center' }]}>{'You have already accepted the invitation for this event.\n\nIf excited, you can send the squad a notification, prompting others to respond as well.'}</Text>
      </View>
      <View style={EventDetailsStyles.excitedModalButtonRow}>
        <StandardButton
          text='Cancel'
          overrideStyle={EventDetailsStyles.excitedModalCancelButton}
          textOverrideStyle={{ color: '#FC6E5E' }}
          onPress={() => { setExcitedModalVisible(false); }}
        />
        <StandardButton
          text='Proceed'
          overrideStyle={EventDetailsStyles.excitedModalProceedButton}
          onPress={() => {
            callBackendRespondToEvent(true); setExcitedModalVisible(false);
          }}
        />
      </View>
    </BlurModal>
  );

  /* Button row */
  const renderAcceptDeclineButtons = () => {
    const declineBorderColor = '#FC6E5E';
    const acceptBorderColor = '#84D3FF';
    const declineBackground = isUserAccepted ? 'white' : declineBorderColor;
    const acceptBackground = isUserAccepted ? acceptBorderColor : 'white';
    const declineTextColor = isUserAccepted ? declineBorderColor : 'white';
    const acceptTextColor = isUserAccepted ? 'white' : acceptBorderColor;
    const acceptText = isUserAccepted ? 'I\'m excited!' : 'Accept';
    return (
      <View style={EventDetailsStyles.buttonRowContainer}>
        {renderAcceptDeclineButton(
          false,
          declineBorderColor,
          declineBackground,
          declineTextColor,
          'Decline',
        )}
        {renderAcceptDeclineButton(
          true,
          acceptBorderColor,
          acceptBackground,
          acceptTextColor,
          acceptText,
        )}
      </View>
    );
  };

  return (
    <View style={EventDetailsStyles.container}>
      <ScrollView keyboardShouldPersistTaps='handled'>
        {/* Event pic if set */}
        {renderEventImage()}
        {/* Event name, emoji, and accepted/declined # */}
        <View style={EventDetailsStyles.eventNameAcceptedDeclinedContainer}>
          <View style={EventDetailsStyles.eventNameEmojiContainer}>
            <Text style={TextStyles.headerLarge}>
              {event.emoji}
            </Text>
            <Text style={[TextStyles.headerLarge, { paddingLeft: 10 }]}>
              {event.name}
            </Text>
          </View>
          {renderEventScheduledNotice()}
          {renderAcceptedDeclinedSection()}
        </View>
        <Divider />
        {/* Event description box */}
        {renderEventDescriptionBox()}
        <Divider />
        {/* Event time, down threshold, address */}
        {renderOtherDetails()}
      </ScrollView>
      <Divider />
      {/* Button row */}
      {renderAcceptDeclineButtons()}
      {renderExcitedModal()}
    </View>
  );
};

export default EventDetails;
