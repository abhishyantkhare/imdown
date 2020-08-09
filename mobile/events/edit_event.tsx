import React, { useLayoutEffect, useState } from "react";
import { Button, Image, SafeAreaView, ScrollView, Slider, Text, TextInput, TouchableOpacity, View } from "react-native";
import { EditEventStyles } from "./edit_event_styles";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import DatePickerModal from "../components/datepickermodal/datepickermodal";
import  { AddEventStyles } from "./add_event_styles";
import moment from 'moment';
import Divider  from '../components/divider/divider'
import { callBackend } from  "../backend/backend"
import { toEvents } from  "./events"
import { EVENT_PIC_HEIGHT, EVENT_PIC_WIDTH} from "../constants"

const EditEvent = (props) => {
	const event = props.route.params.event
	const userEmail = props.route.params.userEmail

	const [event_description, setEventDescription] = useState(event.description)
	const [event_down_threshold, setEventDownThreshold] = useState(event.down_threshold)
	const [event_emoji, setEventEmoji] = useState(event.emoji);
	const [event_name, setEventName] = useState(event.name)
	const [event_start_ms, setEventStartMS] = useState(event.start_ms)
	const [event_end_ms, setEventEndMS] = useState(event.end_ms)
	const [event_url, setEventURL] = useState(event.url)
	const [showStartDatePicker, setShowStartDatePicker] = useState(false);
	const [showEndDatePicker, setShowEndDatePicker] = useState(false);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);


	useLayoutEffect(() => {
		props.navigation.setOptions({
				headerLeft: () => (
					<Button
						onPress={() => props.navigation.pop()}
						title=" Cancel"
						color="#007AFF"
					/>
				),
		});
	}, [props.navigation]);

	{/* Event image circle */}
	const renderImageCircle = () => {
		return (
			<View style = {EditEventStyles.event_pic_container}>
				{ event.image_url ?
						<View style={EditEventStyles.event_picture}>
								<Image source={{uri: event.image_url}}
								style={{ borderColor: "#aaaaaa", borderWidth: 1, width: EVENT_PIC_WIDTH, height: EVENT_PIC_HEIGHT, borderRadius: EVENT_PIC_WIDTH/2 }}
								/>
						</View> :
						<View></View>
				}
			</View>
		)
	}

	{/* Event title box */}
	const renderEventTitleBox = () => {
		return (
			<View style={EditEventStyles.event_title_container}>
					<TextInput style={EditEventStyles.event_title} placeholder="Event Title" value={event_name} onChangeText={(value) => setEventName(value)} />
			</View>
		);
	}

	{/* Event details box (All fields shown on event details page) */}
	const renderEventDetailsBox = () => {
		return (
			<View style = {EditEventStyles.event_details_edit_container}>
				{ renderStartDate() }
				{ Divider() }
				{ renderEndDate() }
				{ Divider() }
				<TextInput style={[EditEventStyles.event_url, {textDecorationLine: event_url ? 'underline' : 'none'}]} placeholder="Event URL" value={event_url} onChangeText={(value) => setEventURL(value)} />
				{ Divider() }
				<TextInput style={EditEventStyles.event_description} placeholder="Event Description" value={event_description} onChangeText={(value) => setEventDescription(value)} />
			</View>
		);
	}


	{/* Additional event fields box (Fields related to event not shown on details page) */}
	const renderAdditionalFieldsBox = () => {
		return (
			<View style={EditEventStyles.additional_fields_container}>
				{ renderEmojiField() }
				{ Divider() }
				<Text style={EditEventStyles.down_threshold_text}>Number of people down to auto create event: {event_down_threshold}</Text>
				<View style = {{ marginHorizontal: 20, paddingBottom: 20 }} >
					<Slider minimumValue={0} maximumValue={event.rsvp_users.length + event.declined_users.length} step={1} value={event_down_threshold} onValueChange={(sliderValue: number) => setEventDownThreshold(sliderValue)}>
					</Slider>
      	</View>
			</View>
		);
	}


  const renderStartDate = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => { setShowStartDatePicker(true) }}>
					<Text style={EditEventStyles.event_time}>
						{`🗓 ${moment(event_start_ms).format('llll').toLocaleString()}`}
					</Text>
        </TouchableOpacity>
        {renderStartDatePicker()}
      </View>
    )
	}

	const renderStartDatePicker = () => {
    return (
      showStartDatePicker &&
      <DatePickerModal
          onSubmit={(chosenDate: Date) => {
						setEventStartMS(moment(chosenDate).valueOf())
            setShowStartDatePicker(false);
          }}
      />
    )
	}

	const renderEndDate = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => { setShowEndDatePicker(true) }}>
					<Text style={EditEventStyles.event_time}>
						{`🗓 ${moment(event_end_ms).format('llll').toLocaleString()}`}
					</Text>
        </TouchableOpacity>
        {renderEndDatePicker()}
      </View>
    )
	}

	const renderEndDatePicker = () => {
    return (
      showEndDatePicker &&
      <DatePickerModal
          onSubmit={(chosenDate: Date) => {
						setEventEndMS(moment(chosenDate).valueOf())
            setShowEndDatePicker(false);
          }}
      />
    )
	}

	const renderEmojiField = () => {
    return (
			<SafeAreaView style={EditEventStyles.emoji_container}>
				<Text style = {EditEventStyles.event_emoji_text}>
					Event Emoji:
				</Text>
				<View>
					<TouchableOpacity onPress={() => { setShowEmojiPicker(true) }}>
						<Text style={EditEventStyles.emoji}>
							{`${event_emoji}`}
						</Text>
					</TouchableOpacity>
					<View style={{ alignSelf: "center" }}>
						{renderEmojiPicker()}
					</View>
				</View>
			</SafeAreaView>
    )
  }

  const renderEmojiPicker = () => {
    return (
        showEmojiPicker &&
        <View style = {EditEventStyles.emoji_picker_container}>
          <EmojiSelector
            category={Categories.symbols}
            onEmojiSelected={emoji => {
							setEventEmoji(emoji);
							setShowEmojiPicker(false);
            }}
          />
        </View>
    )
  }


	const renderSaveButton = () => {
		return (
			<View style = {{ alignItems: 'center' }}>
				<TouchableOpacity onPress={saveEvent}>
					<View style = {EditEventStyles.save_button}>
						<Text style = {EditEventStyles.save_button_text}> Save </Text>
					</View>
				</TouchableOpacity>			
			</View>
		);
	}


	const saveEvent = () => {
		const endpoint = 'edit_event'
    const data = {
				event_id: event.id,
        email: userEmail,
        title: event_name || null,
				description: event_description || null,
				down_threshold: event_down_threshold,
        emoji: event_emoji,
        event_url: event_url || null,
        image_url: event.image_url || null,
				squad_id: event.squadId,
				start_time: event_start_ms ? moment(event_start_ms).valueOf() : null,
        end_time: event_end_ms ? moment(event_end_ms).valueOf() : null,
		}
    const init: RequestInit = {
        method: 'PUT',
        mode: 'no-cors',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    }
    callBackend(endpoint, init).then(() => { refreshFromBackend() })
	}

	const refreshFromBackend = () => {
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
			props.route.params.setEvent(updatedEvent)
			props.navigation.pop()
    });
	}

  return (
    <ScrollView style={EditEventStyles.container} >
				{/* Event image */}
				{ renderImageCircle() }
				{/* Event title */}
        { renderEventTitleBox() }
				{/* Event info shown on event details page */}
        { renderEventDetailsBox() }
				{/* Other additional event fields */}
        { renderAdditionalFieldsBox() }
				{ renderSaveButton() }
    </ScrollView>
  );
}

export default EditEvent;
