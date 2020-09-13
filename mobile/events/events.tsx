import React, { useCallback, useLayoutEffect, useState } from "react";
import { Dimensions, Image, View, FlatList, Text, ScrollView, TouchableOpacity } from "react-native";
import { callBackend, getUsersInSquad } from "../backend/backend"
import { event_styles } from "./events_styles";
import { TextStyles } from "../TextStyles";
import { useFocusEffect } from "@react-navigation/native";
import { TabBar, TabView } from 'react-native-tab-view';
import { StandardButton } from "../components/button/Button"
import moment from 'moment';
import AppNavRouteProp from "../types/navigation";


export type RSVPUser = {
  user_id: String,
  email: String
}

type EventsProps = AppNavRouteProp<"Events">

const Events = (props: EventsProps) => {
  const userId = props.route.params.userId
  const tabViewInitialLayout = { width: Dimensions.get('window').width };
  const [tabViewRoutes] = React.useState([
    { key: 'first', title: 'Pending' },
    { key: 'second', title: 'Past' },
  ]);
  const [events, setEvents] = useState([])
  const [squadId, setSquadId] = useState(props.route.params.squadId)
  const [squadCode, setSquadCode] = useState(props.route.params.squadCode)
  const [squadName, setSquadName] = useState(props.route.params.squadName)
  const [squadEmoji, setSquadEmoji] = useState(props.route.params.squadEmoji)
  const [squadImage, setSquadImage] = useState(props.route.params.squadImage)
  const [userEmail, setUserEmail] = useState(props.route.params.userEmail)
  const [numUsers, setNumUsers] = useState(0)
  const [tabViewIndex, setTabViewIndex] = React.useState(0);

  type EventLite = {
    id: number,
    name: string,
    description?: string,
    emoji?: string,
    start_ms?: number,
    end_ms?: number,
    rsvp_users: RSVPUser[],
    declined_users: RSVPUser[],
    down_threshold: number,
  }

  // Converts response from backend for events into list of internally used EventLite objects
  // EventLite objects contain cursory details related to an Event, and is used solely on the Events List Page
  const toEventLiteList = (backendEventLiteList) => {
    return backendEventLiteList.map((it) => {
      return {
        id: it.id,
        name: it.title,
        description: it.description,
        emoji: it.event_emoji,
        start_ms: it.start_time,
        end_ms: it.end_time,
        rsvp_users: it.event_responses.accepted,
        declined_users: it.event_responses.declined,
        down_threshold: it.down_threshold,
      }
    })
  }

  const goToAddEvent = () => {
    props.navigation.navigate("Add Event", props.route.params);
  }

  const goToViewSquadSettings = (squadId: number, squadName: string, squadEmoji: string) => {
    props.navigation.navigate("View Squad Settings", {
      squadId: squadId,
      squadName: squadName,
      squadEmoji: squadEmoji,
      squadCode: squadCode,
      squadImage: squadImage,
      userId: userId
    });
  }

  const goToSquadMembers = () => {
    props.navigation.navigate("Squad Members", {
      userId: userId,
      squadId: squadId,
      isInEditView: false
    });
  }

  const goToEventDetailsPage = (event: EventLite) => {
    props.navigation.navigate("EventDetails", {
      eventId: event.id,
      userEmail: userEmail,
      userId: userId,
      numUsers: numUsers
    })
  }

  const getEvents = () => {
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
      setEvents(toEventLiteList(data));
    });
  }

  const getSquadDetails = () => {
    const endpoint = 'get_squad?squad_id=' + squadId
    const init: RequestInit = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
    }
    callBackend(endpoint, init).then(response => {
      return response.json();
    }).then(data => {
        setSquadName(data.name)
        setSquadEmoji(data.squad_emoji)
        setSquadImage(data.image)
    });
  }

  const getNumUsers = () => {
    getUsersInSquad(squadId).then((data) => {
      setNumUsers(data.user_info.length)
    })
  }

  useFocusEffect(
    useCallback(() => {
      getEvents();
      getSquadDetails()
      getNumUsers();
    }, []))

  const renderSquadCode = () => {
    return (
      <View style={event_styles.squadCodeContainer}>
        <Text style={[TextStyles.secondary, event_styles.squadCodeDescriptionText]} selectable={false}>Code: </Text>
        <Text style={[TextStyles.secondary, event_styles.squadCodeValueText]} selectable={true}>
          {squadCode}
        </Text>
      </View>
    )
  }

  const renderSquadSettingsButton = () => {
    return (
      <TouchableOpacity onPress={() => goToViewSquadSettings(squadId, squadName, squadEmoji)} style={event_styles.squadSettingsButtonImage} >
        <Image source={require('../assets/settings_button.png')} style={event_styles.squadSettingsButtonImage} />
      </TouchableOpacity>
    );
  }


  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={event_styles.headerRight}>
          {renderSquadCode()}
          {renderSquadSettingsButton()}
        </View>
      ),
    });
  }, [props.navigation]);


  const renderSquadImage = () => {
    return (
      <View style={event_styles.squadImageContainer}>
      {squadImage ? <Image source={{ uri: squadImage }} style={event_styles.squadImage} /> : <View></View>}
      </View>
    )
  };

  const PendingEventsTabContents = () => (
    <FlatList
      data={events.filter(event => !event.end_ms || event.end_ms > new Date()).sort((a, b) =>
        (!a.start_ms && b.start_ms || a.start_ms > b.start_ms) ? 1 : -1)}
      renderItem={renderEventItem}
      style={event_styles.eventList}
      keyExtractor={(item, index) => index.toString()}
    />
  );

  const PastEventsTabContents = () => (
    <FlatList
      data={events.filter(event => event.end_ms && event.end_ms < new Date()).sort((a, b) =>
        (a.end_ms < b.end_ms) ? 1 : -1)}
      renderItem={renderEventItem}
      style={event_styles.eventList}
      keyExtractor={(item, index) => index.toString()}
    />
  );

  const renderTabViewLabel = ({ route, focused, color }) => {
    return (
      <View>
        <Text style={{ color: focused ? "#333333" : "#BEBEBE", fontFamily: "Roboto_400Regular" }}>
          {route.title}
        </Text>
      </View>
    )
  }

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#FFFFFF' }}
      style={{ backgroundColor: '#FFFFFF' }}
      renderLabel={renderTabViewLabel}
    />
  );

  // Given event, returns string that describes how far (time-wise) event is from now.
  // For ex: "ended 3 days ago" / "starts 3 minutes from now" / "happening now!"
  const calcEventProximity = (event: EventLite) => {
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

  const calcDownPercentage = (event: EventLite) => {
    const numDown = event.rsvp_users.length
    const percentage = Math.round(numDown * 100 / numUsers)
    return percentage
  }

  const renderDownBarSection = (event: EventLite) => {
    const downPercentage = calcDownPercentage(event)
    const isOverThreshold = event.rsvp_users.length >= event.down_threshold
    // tabViewIndex = 0 means we are on "Pending" tab, 1 means we are on "Past" tab
    const onPendingEventsTab = tabViewIndex == 0
    const barColor = onPendingEventsTab ? "#84D3FF" : "#BEBEBE"
    const borderRightRadii = downPercentage > 95 ? 5 : 0
    const barWidth = `${downPercentage}%`
    const inlineStyleJSON = {
      backgroundColor: barColor,
      borderBottomRightRadius: borderRightRadii,
      borderTopRightRadius: borderRightRadii,
      width: barWidth
    }

    return (
      <View style={event_styles.downBarSectionContainer}>
        <View style={event_styles.downBarContainer}>
          <View style={[event_styles.downBarFilled, inlineStyleJSON]}></View>
          <View style={[event_styles.downBarEmpty]}></View>
        </View>
        <View style={event_styles.downThresholdReachedContainer}>
          {isOverThreshold && <Image source={onPendingEventsTab ? require('../assets/blue_check_icon.png') : require('../assets/gray_check_icon.png')} style={event_styles.downThresholdReachedIcon} />}
        </View>
      </View>);
  }

  const renderEventItem = ({ item }: { item: EventLite }) => {
    return (
      <TouchableOpacity activeOpacity={.7} onPress={() => { goToEventDetailsPage(item) }}>
        <View style={event_styles.eventItemOuterBox}>
          <View style={{ flexDirection: 'row' }}>
            <View style={event_styles.eventEmojiBox}>
              <Text style={event_styles.eventEmoji}>{item.emoji || ""}</Text>
            </View>
            <View style={event_styles.eventItem}>
              <Text numberOfLines={2} style={[TextStyles.paragraph, event_styles.eventTitle]}>{item.name}</Text>
              <Text style={[TextStyles.secondary, event_styles.eventTimeProximity]}>{`${calcEventProximity(item)}`}</Text>
              {<Image source={tabViewIndex == 0 ? require('../assets/arrow_forward_blue.png') : require('../assets/arrow_forward_gray.png')} style={event_styles.forwardArrowIcon} />}
            </View>
          </View>
          {renderDownBarSection(item)}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={event_styles.container}>
      <ScrollView style={[event_styles.scrollViewContainer]} contentContainerStyle={{ alignItems: "center" }}>
        {renderSquadImage()}
        <View style={event_styles.squadNameEmojiContainer}>
          <Text style={TextStyles.headerLarge}>
            {squadEmoji}
          </Text>
          <TouchableOpacity onPress={goToSquadMembers}>
            <Text style={[TextStyles.headerLarge, event_styles.squadTitleName]}>
              {squadName}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={event_styles.eventListContainer}>
          <TabView
            initialLayout={tabViewInitialLayout}
            navigationState={{ index: tabViewIndex, routes: tabViewRoutes }}
            onIndexChange={setTabViewIndex}
            renderScene={() => null}
            renderTabBar={renderTabBar}
            swipeEnabled={false} />
          {tabViewIndex === 0 ? <PendingEventsTabContents /> : <PastEventsTabContents />}
        </View>
      </ScrollView>
      <View style={event_styles.addEventButtonContainer}>
        <StandardButton text="Add event" onPress={() => goToAddEvent()} />
      </View>
    </View>
  );
}


export default Events;
