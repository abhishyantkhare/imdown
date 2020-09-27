import React, { useState } from "react";
import { ScrollView, Text, View, _View, Dimensions, FlatList, Image } from "react-native";
import { AcceptedDeclinedStyles } from "./AcceptedDeclinedStyles";
import { TabView, TabBar } from "react-native-tab-view";
import { RSVPUser } from "./Events"
import Divider from '../components/divider/Divider'

const AcceptedDeclinedScreen = (props) => { 
    const tabViewInitialLayout = { width: Dimensions.get('window').width };
    const [tabViewIndex, setTabViewIndex] = React.useState(props.route.params.tabViewIndex)
    const [tabViewRoutes] = React.useState([
        { key: 'first', title: 'Accepted' },
        { key: 'second', title: 'Declined' },
      ]);
    const [rsvpUsers, setRsvpUsers] = useState(props.route.params.rsvpUsers)
    const [declinedUsers, setDeclinedUsers] = useState(props.route.params.declinedUsers)

    const renderTabViewLabel = ({ route, focused, color }) => {
        return (
            <View>
                <Text style={{ color: focused ? "#333333": "#BEBEBE", fontFamily: "Roboto_400Regular" }}>
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

    const renderRSVPUser = ({ item }: { item: RSVPUser }) => {
        return (
            <View style={AcceptedDeclinedStyles.squads_members_container}>   
                <View style={{ paddingRight: 10 }}>
                    <Image style={AcceptedDeclinedStyles.user_image} source={{ uri: item.photo}} />
                </View>
                <View style={{ paddingBottom: 8 }}>
                    <Text style={AcceptedDeclinedStyles.user_text}> {item.name} </Text>
                </View>
            </View> 
        );
    };

    const AcceptedUsers = () => (
        <View style = {{marginTop: 20}}>
            <FlatList
                data={rsvpUsers}
                renderItem={renderRSVPUser}
                keyExtractor={item => item.userId.toString()}
            />
        </View>
    );

    const DeclinedUsers = () => (
        <View style = {{marginTop: 20}}>
            <FlatList
                data={declinedUsers}
                renderItem={renderRSVPUser}
                keyExtractor={item => item.userId.toString()}
            />
        </View>
    );

    return (
        <ScrollView style={AcceptedDeclinedStyles.container} >
            <View >
                <TabView
                    initialLayout={tabViewInitialLayout}
                    navigationState={{ index: tabViewIndex, routes: tabViewRoutes }}
                    onIndexChange={setTabViewIndex}
                    renderScene={() => null}
                    renderTabBar={renderTabBar}
                    swipeEnabled={false} 
                />
                <Divider />
                {tabViewIndex === 0 ? <AcceptedUsers /> : <DeclinedUsers />}
            </View>
         </ScrollView>
    );
}

export default AcceptedDeclinedScreen;
