import React, { useLayoutEffect, useState } from "react";
import { View, Text, FlatList, TouchableHighlight, Image } from "react-native";
import { squad_styles } from "./squads_styles";
import { Button } from "react-native";
import AddSquadModal from "./add_squad"
import { Event } from "../events/events"
import { EmojiSelectorProps } from "react-native-emoji-selector";


// type Squad = {
//   name: string,
//   events: Event[]
// }
export type Squad ={
  name: string,
  emoji: EmojiSelectorProps,
  events: Event[]
}

// const dummySquads: Squad[] = [
//   {
//     name: "BangerBrozz",
//     emoji: "💩",
//     events: [
//       {
//         name: "Beach BBQ",
//         description: "A fun beach BBQ!",
//         start_ms: 1587424800000,
//         end_ms: 1587428400000
//       }
//     ]
//   },
//   {
//     name: "🤡 SEP",
//     emoji: "🤡",
//     events: [{ name: "Playland", description: "Can we just talk" }]
//   },
//   {
//     name: "🤖 CodeBase",
//     emoji: "🤖",
//     events: [{ name: "Zoom+Drinks" }]
//   }
// ]

/* TODO:
  - emojis propagate to squads scren */

const Squads = (props) => {

  const [addSquadModalVisble, setAddSquadModalVisble] = useState(false)
  const [squads, setSquads] = useState(props.route.params.squads)
  console.log(squads)

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

  const goToEvents = (events: Event[], groupName: string, groupEmoji: EmojiSelectorProps) => {
    props.navigation.navigate("Events", {
      events: events,
      groupName: groupName,
      groupEmoji: groupEmoji
    })
  }


  const renderSquadItem = ({ item }: { item: Squad }) => {
    return (
      <View style={squad_styles.squad_item}>
        <TouchableHighlight onPress={() => { goToEvents(item.events, item.name, item.emoji) }}>
          <Text style={squad_styles.squad_text}>{item.emoji}: {item.name}</Text>
        </TouchableHighlight>
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
