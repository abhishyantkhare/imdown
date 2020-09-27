import React, { useState } from 'react';
import {
  ScrollView, Text, View, Dimensions, FlatList, Image,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import AcceptedDeclinedStyles from './AcceptedDeclinedStyles';
import { RSVPUser } from './Events';
import Divider from '../components/divider/Divider';
import { AppNavigationProp, AppRouteProp } from '../types/navigation';

type AcceptedDeclinedScreenProps = {
  navigation: AppNavigationProp<'AcceptedDeclinedScreen'>;
  route: AppRouteProp<'AcceptedDeclinedScreen'>;
};

const AcceptedDeclinedScreen = ({ route }: AcceptedDeclinedScreenProps) => {
  const { tabViewIndex, rsvpUsers, declinedUsers } = route.params;
  const tabViewInitialLayout = { width: Dimensions.get('window').width };
  const [currentTabViewIndex, setCurrentTabViewIndex] = useState(tabViewIndex);
  const [tabViewRoutes] = useState([
    { key: 'first', title: 'Accepted' },
    { key: 'second', title: 'Declined' },
  ]);

  // eslint-disable-next-line no-shadow
  const renderTabViewLabel = ({ route, focused }: { route: any, focused: boolean }) => (
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

  const renderRSVPUser = ({ item }: { item: RSVPUser }) => (
    <View style={AcceptedDeclinedStyles.squadsMembersContainer}>
      <View style={{ paddingRight: 10 }}>
        <Image style={AcceptedDeclinedStyles.userImage} source={{ uri: item.photo }} />
      </View>
      <View style={{ paddingBottom: 8 }}>
        <Text style={AcceptedDeclinedStyles.userText}>
          {' '}
          {item.name}
          {' '}
        </Text>
      </View>
    </View>
  );

  const AcceptedUsers = () => (
    <View style={{ marginTop: 20 }}>
      <FlatList
        data={rsvpUsers}
        renderItem={renderRSVPUser}
        keyExtractor={(item) => item.userId.toString()}
      />
    </View>
  );

  const DeclinedUsers = () => (
    <View style={{ marginTop: 20 }}>
      <FlatList
        data={declinedUsers}
        renderItem={renderRSVPUser}
        keyExtractor={(item) => item.userId.toString()}
      />
    </View>
  );

  return (
    <ScrollView style={AcceptedDeclinedStyles.container}>
      <View>
        <TabView
          initialLayout={tabViewInitialLayout}
          navigationState={{ index: currentTabViewIndex, routes: tabViewRoutes }}
          onIndexChange={setCurrentTabViewIndex}
          renderScene={() => null}
          renderTabBar={renderTabBar}
          swipeEnabled={false}
        />
        <Divider />
        {currentTabViewIndex === 0 ? <AcceptedUsers /> : <DeclinedUsers />}
      </View>
    </ScrollView>
  );
};

export default AcceptedDeclinedScreen;
