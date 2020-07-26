import React, { useState } from "react";
import { FlatList, Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { EventDetailedStyles } from "./event_detailed_styles";
import moment from 'moment';
import Divider  from '../components/divider/divider'

const DOWN_EMOJI_HEIGHT = 82
const DOWN_EMOJI_WIDTH = 85
const EVENT_PIC_HEIGHT = 130
const EVENT_PIC_WIDTH = 130
const ROW_BUTTON_HEIGHT = 40
const ROW_BUTTON_WIDTH = 40

const EventDetailed = (props) => {
const [event, setEvent] = useState(props.route.params.event)

	const renderRSVPUser = ({ item }: { item: String }) => {
    return (
      <View>
            <Text style={EventDetailedStyles.rsvp_user}>{item}</Text>
      </View>
    );
	};
	
  return (
    <View style={EventDetailedStyles.container}>
				{/* Event title + pic + details box */}
        <View style={EventDetailedStyles.event_pic_and_title_container}>
            { event.image_url ?  
                <View style={EventDetailedStyles.event_picture}>
                    <Image source = {{uri: event.image_url}}
                    style = {{ width: EVENT_PIC_WIDTH, height: EVENT_PIC_HEIGHT, borderRadius: 15 }}
                    /> 
                </View> : 
                <View></View>
            }
            <View style={EventDetailedStyles.event_title_container}>
                <Text style={EventDetailedStyles.event_title}>
                    {event.name}
                </Text>
                <Text style={EventDetailedStyles.event_time}>
                    {`🗓 ${moment(event.start_ms).format('llll').toLocaleString()}`}
                </Text>
                <Text onPress={ ()=> Linking.openURL(`https://${event.url}`) } style={EventDetailedStyles.event_url}>
                    { event.url }
                </Text>
            </View>
        </View>
        {Divider()}
				{/* Event description box */}
        <Text style={EventDetailedStyles.event_description}>
            {event.description}
        </Text>
        {Divider()}
				{/* Event "down list" box */}
        <View style={EventDetailedStyles.down_list_outer_container}>
            <View style ={EventDetailedStyles.down_list_emoji}>
                <Image source = {require('../assets/down.png')} style = {{ width: DOWN_EMOJI_WIDTH, height: DOWN_EMOJI_HEIGHT }}/> 
            </View>
            <View style={EventDetailedStyles.down_list_inner_container}>
                <Text style={EventDetailedStyles.down_list_title}>
                    {/* Hard code for now. Will calculate once hooked up */}
                    {`80% Down (${event.rsvp_users.length}/8)`}
                </Text>
                <FlatList
                    data={event.rsvp_users}
                    renderItem={renderRSVPUser}
                />
            </View>
        </View>
        {Divider()}
				{/* Button row */}
        <View style={EventDetailedStyles.button_row_container}>
            <TouchableOpacity style ={EventDetailedStyles.delete_event_container}>
                <Image source = {require('../assets/delete_icon.png')} style = {{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }}/> 
                <Text style={EventDetailedStyles.button_row_text}> delete </Text>
            </TouchableOpacity>
            <TouchableOpacity style={EventDetailedStyles.decline_rsvp_container}>
                <Image source = {require('../assets/cancel_rsvp.png')} style = {{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }}/> 
                <Text style={EventDetailedStyles.button_row_text}> decline </Text>
            </TouchableOpacity>
            <TouchableOpacity style ={EventDetailedStyles.edit_event_container}>
                <Image source = {require('../assets/edit_event.png')} style = {{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }}/> 
                <Text style={EventDetailedStyles.button_row_text}> edit </Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

export default EventDetailed;