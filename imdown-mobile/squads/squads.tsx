import React, { useLayoutEffect, useState } from "react";
import { View, Text, FlatList, TouchableHighlight } from "react-native";
import Divider from "../components/divider/divider";
import { squad_styles } from "./squads_styles";
import { Button } from "react-native";
import AddSquadModal from "./add_squad"


type Squad = {
  name: string,
  events: string[]
}

const dummySquads: Squad[] = [
  {
    name: "BangerBrozz",
    events: ["Beach BBQ"]
  },
  {
    name: "SEP",
    events: ["Playland"]
  },
  {
    name: "CodeBase",
    events: ["Zoom+Drinks"]
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

  const goToEvents = (events: string[]) => {
    props.navigation.navigate("Events", {
      events: events
    })
  }


  const renderSquadItem = ({ item }: { item: Squad }) => {
    return (
      <View style={squad_styles.squad_item}>
        <TouchableHighlight onPress={() => { goToEvents(item.events) }}>
          <Text>{item.name}</Text>
        </TouchableHighlight>
      </View>
    );
  };
  return (
    <View style={squad_styles.squads_container}>
      <FlatList
        ItemSeparatorComponent={Divider}
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
