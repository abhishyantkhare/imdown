import React, { useState } from "react";
import { FlatList, Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { EventDetailsStyles } from "./event_details_styles";
import moment from 'moment';
import Divider  from '../components/divider/divider'
import { callBackend } from  "../backend/backend"
import { Event, toEvents, RSVPUser } from  "./events"

const DOWN_EMOJI_HEIGHT = 82
const DOWN_EMOJI_WIDTH = 85
const EVENT_PIC_HEIGHT = 130
const EVENT_PIC_WIDTH = 130
const ROW_BUTTON_HEIGHT = 40
const ROW_BUTTON_WIDTH = 40

const EventDetails = (props) => {
const [event, setEvent] = useState(props.route.params.event)
const userEmail = props.route.params.userEmail
const isUserEventAccepted = (event: Event) => {
	return event.rsvp_users.some(item => item.email === userEmail)
}
const [isUserAccepted, setIsUserAccepted] = useState(isUserEventAccepted(event))


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
									{`${calculateDownRSVPPercentage(event.rsvp_users.length, event.declined_users.length)}% Down (${event.rsvp_users.length}/${event.rsvp_users.length + event.declined_users.length})`}
							</Text>
							<FlatList
									data={event.rsvp_users}
									renderItem={renderRSVPUser}
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

	{/* Button row */}
	const renderBottomRowButtons = () => {
    return (
      <View style={EventDetailsStyles.button_row_container}>
            <TouchableOpacity style ={EventDetailsStyles.delete_event_container}>
                <Image source = {require('../assets/delete_icon.png')} style = {{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }}/>
                <Text style={EventDetailsStyles.button_row_text}> delete </Text>
            </TouchableOpacity>
						{ renderRSVPButton() }
            <TouchableOpacity style ={EventDetailsStyles.edit_event_container}>
                <Image source = {require('../assets/edit_event.png')} style = {{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }}/>
                <Text style={EventDetailsStyles.button_row_text}> edit </Text>
            </TouchableOpacity>
        </View>
    );
	};

	const renderRSVPButton = () => {
		if (isUserAccepted) {
			return(
				<TouchableOpacity onPress={() => { callBackendRespondToEvent(false) }} style={EventDetailsStyles.rsvp_button_container}>
					<Image source = {require('../assets/cancel_rsvp.png')} style = {{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }}/>
					<Text style={EventDetailsStyles.button_row_text}> decline </Text>
				</TouchableOpacity>
			);
		} else {
			return(
				<TouchableOpacity onPress={() => { callBackendRespondToEvent(true) }} style={EventDetailsStyles.rsvp_button_container}>
					<Image source = {require('../assets/accept_rsvp.png')} style = {{ width: ROW_BUTTON_HEIGHT, height: ROW_BUTTON_WIDTH }}/>
					<Text style={EventDetailsStyles.button_row_text}> accept </Text>
				</TouchableOpacity>
			);
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
			const updatedEvent = toEvents([data])[0]
			setEvent(updatedEvent)
			setIsUserAccepted(isUserEventAccepted(updatedEvent))
    });
	}


	const calculateDownRSVPPercentage = (num_accepted: number, num_declined: number) => {
		return Math.round(num_accepted*100/(num_accepted+num_declined))
	}

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
