import React, { useState } from "react";
import { FlatList, Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { EventDetailsStyles } from "./event_details_styles";
import moment from 'moment';
import Divider  from '../components/divider/divider'

const DOWN_EMOJI_HEIGHT = 82
const DOWN_EMOJI_WIDTH = 85
const EVENT_PIC_HEIGHT = 130
const EVENT_PIC_WIDTH = 130
const ROW_BUTTON_HEIGHT = 40
const ROW_BUTTON_WIDTH = 40

const EventDetails = (props) => {
const [event, setEvent] = useState(props.route.params.event)

	{/* Event title + pic + details box */}
	const renderTitlePicDetailsBox = () => {
		return (
			<View style={EventDetailsStyles.event_pic_and_title_container}>
				{ event.image_url ?
						<View style={EventDetailsStyles.event_picture}>
								<Image source = {{uri: event.image_url}}
								style = {{ width: EVENT_PIC_WIDTH, height: EVENT_PIC_HEIGHT, borderRadius: 15 }}
								/>
						</View> :
						<View></View>
				}
				<View style={EventDetailsStyles.event_title_container}>
						<Text style={EventDetailsStyles.event_title}>
								{event.name}
						</Text>
						<Text style={EventDetailsStyles.event_time}>
								{`🗓 ${moment(event.start_ms).format('llll').toLocaleString()}`}
						</Text>
						<Text onPress={ ()=> Linking.openURL(`https://${event.url}`) } style={EventDetailsStyles.event_url}>
								{ event.url }
						</Text>
				</View>
		  </View>
		);
	}

	{/* Event description box */}
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
					<View style ={EventDetailsStyles.down_list_emoji}>
							<Image source = {require('../assets/down.png')} style = {{ width: DOWN_EMOJI_WIDTH, height: DOWN_EMOJI_HEIGHT }}/>
					</View>
					<View style={EventDetailsStyles.down_list_inner_container}>
							<Text style={EventDetailsStyles.down_list_title}>
									{/* Hard code for now. Will calculate once hooked up */}
									{`90% Down (${event.rsvp_users.length}/8)`}
							</Text>
							<FlatList
									data={event.rsvp_users}
									renderItem={renderRSVPUser}
							/>
					</View>
			</View>
		);
	}

	const renderRSVPUser = ({ item }: { item: String }) => {
    return (
      <View>
            <Text style={EventDetailsStyles.rsvp_user}>{item}</Text>
      </View>
    );
	};

	{/* Button row */}
	const renderBottomRowButtons = () => {
    return (
      <View style={EventDetailsStyles.button_row_container}>
            <TouchableOpacity style ={EventDetailsStyles.delete_event_container}>
                <Image source = {require('../assets/delete_icon.png')} style = {{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }}/>
                <Text style={EventDetailsStyles.button_row_text}> delete </Text>
            </TouchableOpacity>
            <TouchableOpacity style={EventDetailsStyles.decline_rsvp_container}>
                <Image source = {require('../assets/cancel_rsvp.png')} style = {{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }}/>
                <Text style={EventDetailsStyles.button_row_text}> decline </Text>
            </TouchableOpacity>
            <TouchableOpacity style ={EventDetailsStyles.edit_event_container}>
                <Image source = {require('../assets/edit_event.png')} style = {{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }}/>
                <Text style={EventDetailsStyles.button_row_text}> edit </Text>
            </TouchableOpacity>
        </View>
    );
	};

  return (
    <View style={EventDetailsStyles.container}>
				{/* Event title + pic + details box */}
        { renderTitlePicDetailsBox() }
        {Divider()}
				{/* Event description box */}
        { renderEventDescriptionBox() }
        {Divider()}
				{/* Event "down list" box */}
        { renderEventDownListBox() }
        {Divider()}
        {/* Button row */}
        {renderBottomRowButtons()}
    </View>
  );
}

export default EventDetails;
