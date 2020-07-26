import React, { useLayoutEffect, useState } from "react";
import { View, Text, FlatList, TouchableHighlight, Image, TouchableOpacity } from "react-native";
import { squad_styles } from "./squads_styles";
import { Button } from "react-native";
import AddSquadModal from "./add_squad"
import { Event } from "../events/events"


export type Squad = {
  name: string,
  emoji: string,
  events: Event[]
}

const dummySquads: Squad[] = [
  {
    name: "💩 BangerBrozz",
    emoji: "🤠",
    events: [
      {
        name: "Beach BBQ",
        emoji: "🍗",
        description: "A fun beach BBQ!",
        image_url: "https://projectcamping.com/wp-content/uploads/2019/06/campfire-burning-1200x900.png",
        start_ms: 1587424800000,
        end_ms: 1587428400000,
        rsvp_users: ["codyzeng@gmail.com", "vivekjain@gmail.com", "brian.levis@gmail.com", "akhare@gmail.com"],
        url: "eventbrite.com/beachbbq"
      },
      {
        name: "Sea Ranch Retreat",
        emoji: "🌊",
        description: "A weekend of fun!",
        image_url: "https://images.squarespace-cdn.com/content/v1/5cddc10960d9750001030971/1572307517237-DIGRRC818CXBW35PI46L/ke17ZwdGBToddI8pDm48kP5YULpdfrV8g1A4PMosFmoUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcE45FfWrFMxCaRnm7W99c2Q3hnoLo1gEELBd4dJU78Q_YdTc-Mur95oaewuTQg7OD/Screen+Shot+2019-10-28+at+4.02.45+PM.png",
        start_ms: 1580329800000,
        end_ms: 1580524200000,
        rsvp_users: ["codyzeng@gmail.com"],
        url: "airb.nb/searanch"
      },
      {
        name: "Bar Crawl",
        emoji: "🍺",
        description: "Drink till you drop",
        image_url: "https://www.vietdaytrip.com/wp-content/uploads/2018/09/Drinks-in-bar.png",
        start_ms: 1608949800000,
        end_ms: 1608967800000,
        rsvp_users: ["codyzeng@gmail.com"],
        url: "eventbrite.com/barcrawl"
      }
    ]
  },
  {
    name: "SEP",
    emoji: "🤡",
    events: [{ name: "Playland", emoji: "🕺", description: "Can we just talk", rsvp_users: ["codyzeng@gmail.com"]}]
  },
  {
    name: "CodeBase",
    emoji: "🤖",
    events: [{ name: "Zoom+Drinks",  emoji: "👨‍💻", rsvp_users: ["codyzeng@gmail.com"]}]
  }
]

const Squads = (props) => {

  const [addSquadModalVisble, setAddSquadModalVisble] = useState(false)
  const [squads, setSquads] = useState(props.route.params.squads)
  // // Uncomment to test events using dummy data
  // const [squads, setSquads] = useState(dummySquads)

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => setAddSquadModalVisble(true)}
          title="Add"
          color="#000"
        />
      ),
    });
  }, [props.navigation]);

  const addSquad = (newSquad: Squad) => {
    setSquads(squads.concat([newSquad]));
    setAddSquadModalVisble(false)
  }

  const goToEvents = (events: Event[], squadName: string, squadEmoji: string) => {
    props.navigation.navigate("Events", {
      events: events,
      squadName: squadName,
      squadEmoji: squadEmoji
    })
  }

  const renderSquadItem = ({ item }: { item: Squad }) => {
    return (
      <View style={squad_styles.squad_item}>
        <TouchableOpacity onPress={() => { goToEvents(item.events, item.name, item.emoji) }}>
          <Text style={squad_styles.squad_text}>{item.emoji} {item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={squad_styles.squads_container}>
      <FlatList
        data={squads}
        renderItem={renderSquadItem}
        style={squad_styles.squad_list}
      />
      <AddSquadModal
        visible={addSquadModalVisble}
        onPress={addSquad}
      />
    </View>
  );
}

export default Squads;
