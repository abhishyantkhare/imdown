import React, { useLayoutEffect, useState } from "react";
import { View, Text, FlatList, TouchableHighlight } from "react-native";
import { squad_styles } from "./squads_styles";
import { Button } from "react-native";
import AddSquadModal from "./add_squad"
import { Event } from "../events/events"


type Squad = {
  name: string,
  events: Event[]
}

const dummySquads: Squad[] = [
  {
    name: "💩 BangerBrozz",
    events: [
      {
        name: "Beach BBQ",
        description: "A fun beach BBQ!",
        start_ms: 1587424800000,
        end_ms: 1587428400000
      }
    ]
  },
  {
    name: "🤡 SEP",
    events: [{ name: "Playland", description: "Can we just talk" }]
  },
  {
    name: "🤖 CodeBase",
    events: [{ name: "Zoom+Drinks" }]
  }
]

const Squads = (props) => {


  const [addSquadModalVisble, setAddSquadModalVisble] = useState(false)
  const [squads, setSquads] = useState(dummySquads)

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

  const addSquad = (squadName: string) => {
    const newSquad: Squad = {
      name: squadName,
      events: []
    }
    setSquads(squads.concat([newSquad]));
    setAddSquadModalVisble(false)
  }

  const goToEvents = (events: Event[], groupName: string) => {
    props.navigation.navigate("Events", {
      events: events,
      groupName: groupName
    })
  }


  const renderSquadItem = ({ item }: { item: Squad }) => {
    return (
      <View style={squad_styles.squad_item}>
        <TouchableHighlight onPress={() => { goToEvents(item.events, item.name) }}>
          <Text style={squad_styles.squad_text}>{item.name}</Text>
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
