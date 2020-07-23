import React, { useLayoutEffect, useState } from "react";
import { View, Text, FlatList, TouchableHighlight, Image } from "react-native";
import { squad_styles } from "./squads_styles";
import { Button } from "react-native";
import AddSquadModal from "./add_squad"
import { Event } from "../events/events"
import { TouchableOpacity } from "react-native-gesture-handler";


export type Squad ={
  name: string,
  emoji: string,
  events: Event[]
}

const Squads = (props) => {

  const [addSquadModalVisble, setAddSquadModalVisble] = useState(false)
  const [squads, setSquads] = useState(props.route.params.squads)

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
