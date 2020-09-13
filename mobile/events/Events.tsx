import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  View,
  FlatList,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, RouteProp } from '@react-navigation/native';
import { TabBar, TabView } from 'react-native-tab-view';
import moment from 'moment';
import { StackNavigationProp } from '@react-navigation/stack';

import { callBackend, getUsersInSquad } from '../backend/backend';
import EventsStyles from './EventsStyles';
import { TextStyles } from '../TextStyles';
import StandardButton from '../components/button/Button';
import { RootStackParamList } from '../App';

export type RSVPUser = {
  userId: String;
  email: String;
};

type EventsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Events'
>;

type EventsScreenRouteProp = RouteProp<RootStackParamList, 'Events'>;

type EventsProps = {
  navigation: EventsScreenNavigationProp;
  route: EventsScreenRouteProp;
};

const settingsButton = require('../assets/settings_button.png');
const blueCheckIcon = require('../assets/blue_check_icon.png');
const grayCheckIcon = require('../assets/gray_check_icon.png');
const arrowForwardBlue = require('../assets/arrow_forward_blue.png');
const arrowForwardGray = require('../assets/arrow_forward_gray.png');

const Events = ({ route, navigation }: EventsProps) => {
  const { userId } = route.params;
  const tabViewInitialLayout = { width: Dimensions.get('window').width };
  const [tabViewRoutes] = React.useState([
    { key: 'first', title: 'Pending' },
    { key: 'second', title: 'Past' },
  ]);

  type EventLite = {
    id: number,
    name: string,
    description?: string,
    emoji?: string,
    startMs?: number,
    endMs?: number,
    rsvpUsers: RSVPUser[],
    declinedUsers: RSVPUser[],
    downThreshold: number,
  };

  const [events, setEvents] = useState<EventLite[]>([]);
  // eslint-disable-next-line no-unused-vars
  const [squadId, setSquadId] = useState(route.params.squadId);
  // eslint-disable-next-line no-unused-vars
  const [squadCode, setSquadCode] = useState(route.params.squadCode);
  // eslint-disable-next-line no-unused-vars
  const [squadName, setSquadName] = useState(route.params.squadName);
  // eslint-disable-next-line no-unused-vars
  const [squadEmoji, setSquadEmoji] = useState(route.params.squadEmoji);
  // eslint-disable-next-line no-unused-vars
  const [squadImageUrl, setSquadImageUrl] = useState(route.params.squadImageUrl);
  // eslint-disable-next-line no-unused-vars
  const [userEmail, setUserEmail] = useState(route.params.userEmail);
  const [numUsers, setNumUsers] = useState(0);
  const [tabViewIndex, setTabViewIndex] = React.useState(0);

  // Converts response from backend for events into list of internally used EventLite objects
  // EventLite objects contain cursory details related to an Event, and is used solely
  // on the Events List Page
  const toEventLiteList = (backendEventLiteList: any[]) => (
    backendEventLiteList.map((it: any) => (
      {
        id: it.id,
        name: it.title,
        description: it.description,
        emoji: it.event_emoji,
        startMs: it.start_time,
        endMs: it.end_time,
        rsvpUsers: it.event_responses.accepted,
        declinedUsers: it.event_responses.declined,
        downThreshold: it.down_threshold,
      }
    ))
  );

  const goToAddEvent = () => {
    navigation.navigate('AddEvent', route.params);
  };

  const goToEditSquad = (editSquadId: number, editSquadName: string, editSquadEmoji: string) => {
    navigation.navigate('EditSquad', {
      squadId: editSquadId,
      squadName: editSquadName,
      squadEmoji: editSquadEmoji,
    });
  };

  const goToEventDetailsPage = (event: EventLite) => {
    navigation.navigate('EventDetails', {
      eventId: event.id,
      userEmail,
      userId,
      numUsers,
    });
  };

  const getEvents = () => {
    const endpoint = `get_events?squad_id=${squadId}`;
    const init: RequestInit = { // eslint-disable-line no-undef
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    callBackend(endpoint, init).then((response) => response.json())
      .then((data) => {
        setEvents(toEventLiteList(data));
      });
  };

  const getNumUsers = () => {
    getUsersInSquad(squadId).then((data) => {
      setNumUsers(data.user_info.length);
    });
  };

  useFocusEffect(
    useCallback(() => {
      getEvents();
      getNumUsers();
    }, []),
  );

  const renderSquadCode = () => (
    <View style={EventsStyles.squadCodeContainer}>
      <Text
        style={[TextStyles.secondary, EventsStyles.squadCodeDescriptionText]}
        selectable={false}
      >
        Code:
      </Text>
      <Text
        style={[TextStyles.secondary, EventsStyles.squadCodeValueText]}
        selectable
      >
        {squadCode}
      </Text>
    </View>
  );

  const renderSquadSettingsButton = () => (
    <TouchableOpacity
      onPress={() => goToEditSquad(squadId, squadName, squadEmoji)}
      style={EventsStyles.squadSettingsButtonImage}
    >
      <Image source={settingsButton} style={EventsStyles.squadSettingsButtonImage} />
    </TouchableOpacity>
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={EventsStyles.headerRight}>
          {renderSquadCode()}
          {renderSquadSettingsButton()}
        </View>
      ),
    });
  }, [navigation]);

  const renderSquadImage = () => (
    squadImageUrl && (
      <View style={EventsStyles.squadImageContainer}>
        {squadImageUrl
          ? <Image source={{ uri: squadImageUrl }} style={EventsStyles.squadImage} />
          : <View />}
      </View>
    )
  );

  const calcDownPercentage = (event: EventLite) => {
    const numDown = event.rsvpUsers.length;
    const percentage = Math.round((numDown * 100) / numUsers);
    return percentage;
  };

  const renderDownBarSection = (event: EventLite) => {
    const downPercentage = calcDownPercentage(event);
    const isOverThreshold = event.rsvpUsers.length >= event.downThreshold;
    // tabViewIndex = 0 means we are on 'Pending' tab, 1 means we are on 'Past' tab
    const onPendingEventsTab = tabViewIndex === 0;
    const barColor = onPendingEventsTab ? '#84D3FF' : '#BEBEBE';
    const borderRightRadii = downPercentage > 95 ? 5 : 0;
    const barWidth = `${downPercentage}%`;
    const inlineStyleJSON = {
      backgroundColor: barColor,
      borderBottomRightRadius: borderRightRadii,
      borderTopRightRadius: borderRightRadii,
      width: barWidth,
    };

    return (
      <View style={EventsStyles.downBarSectionContainer}>
        <View style={EventsStyles.downBarContainer}>
          <View style={[EventsStyles.downBarFilled, inlineStyleJSON]} />
          <View style={[EventsStyles.downBarEmpty]} />
        </View>
        <View style={EventsStyles.downThresholdReachedContainer}>
          {isOverThreshold
            && (
              <Image
                source={onPendingEventsTab ? blueCheckIcon : grayCheckIcon}
                style={EventsStyles.downThresholdReachedIcon}
              />
            )}
        </View>
      </View>
    );
  };

  // Given event, returns string that describes how far (time-wise) event is from now.
  // For ex: 'ended 3 days ago' / 'starts 3 minutes from now' / 'happening now!'
  const calcEventProximity = (event: EventLite) => {
    const now = parseInt(moment().format('x'), 10);
    if (event.startMs != null) {
      if (now < event.startMs) {
        return `starts ${moment(event.startMs).fromNow().toLocaleString()}`;
      }

      if (now >= event.startMs
        && ((event.endMs != null && now < event.endMs) || event.endMs == null)) {
        return 'happening now!';
      }

      return `ended ${moment(event.endMs).fromNow().toLocaleString()}`;
    }

    if (event.endMs != null && now > event.endMs) {
      return `ended ${moment(event.endMs).fromNow().toLocaleString()}`;
    }

    return '';
  };

  const renderEventItem = ({ item }: { item: EventLite }) => (
    <TouchableOpacity activeOpacity={0.7} onPress={() => { goToEventDetailsPage(item); }}>
      <View style={EventsStyles.eventItemOuterBox}>
        <View style={{ flexDirection: 'row' }}>
          <View style={EventsStyles.eventEmojiBox}>
            <Text style={EventsStyles.eventEmoji}>{item.emoji || ''}</Text>
          </View>
          <View style={EventsStyles.eventItem}>
            <Text numberOfLines={2} style={[TextStyles.paragraph, EventsStyles.eventTitle]}>
              {item.name}
            </Text>
            <Text style={[TextStyles.secondary, EventsStyles.eventTimeProximity]}>{`${calcEventProximity(item)}`}</Text>
            <Image
              source={tabViewIndex === 0 ? arrowForwardBlue : arrowForwardGray}
              style={EventsStyles.forwardArrowIcon}
            />
          </View>
        </View>
        {renderDownBarSection(item)}
      </View>
    </TouchableOpacity>
  );

  const PendingEventsTabContents = () => (
    <FlatList
      data={events
        .filter((event: EventLite) => !event.endMs || event.endMs > new Date().valueOf())
        .sort((a: EventLite, b: EventLite) => {
          if ((!a.startMs && b.startMs) || (a.startMs && b.startMs && a.startMs > b.startMs)) {
            return 1;
          }
          return -1;
        })}
      renderItem={renderEventItem}
      style={EventsStyles.eventList}
      keyExtractor={(item, index) => index.toString()}
    />
  );

  const PastEventsTabContents = () => (
    <FlatList
      data={events.filter((event: EventLite) => event.endMs && event.endMs < new Date().valueOf())
        .sort((a: EventLite, b: EventLite) => {
          if (a.endMs && b.endMs && a.endMs < b.endMs) {
            return 1;
          }
          return -1;
        })}
      renderItem={renderEventItem}
      style={EventsStyles.eventList}
      keyExtractor={(item, index) => index.toString()}
    />
  );

  // eslint-disable-next-line no-shadow
  const renderTabViewLabel = ({ route, focused }: {route: any, focused: boolean}) => (
    <View>
      <Text style={{ color: focused ? '#333333' : '#BEBEBE', fontFamily: 'Roboto_400Regular' }}>
        {route.title}
      </Text>
    </View>
  );

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#FFFFFF' }}
      style={{ backgroundColor: '#FFFFFF' }}
      renderLabel={renderTabViewLabel}
    />
  );

  return (
    <View style={EventsStyles.container}>
      <ScrollView style={[EventsStyles.scrollViewContainer]} contentContainerStyle={{ alignItems: 'center' }}>
        {renderSquadImage()}
        <View style={EventsStyles.squadNameEmojiContainer}>
          <Text style={TextStyles.headerLarge}>
            {squadEmoji}
          </Text>
          <Text style={[TextStyles.headerLarge, EventsStyles.squadTitleName]}>
            {squadName}
          </Text>
        </View>
        <View style={EventsStyles.eventListContainer}>
          <TabView
            initialLayout={tabViewInitialLayout}
            navigationState={{ index: tabViewIndex, routes: tabViewRoutes }}
            onIndexChange={setTabViewIndex}
            renderScene={() => null}
            renderTabBar={renderTabBar}
            swipeEnabled={false}
          />
          {tabViewIndex === 0 ? <PendingEventsTabContents /> : <PastEventsTabContents />}
        </View>
      </ScrollView>
      <View style={EventsStyles.addEventButtonContainer}>
        <StandardButton text='Add event' onPress={() => goToAddEvent()} />
      </View>
    </View>
  );
};

export default Events;
