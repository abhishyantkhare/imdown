import React, {useLayoutEffect, useState} from "react";
import { View, Text, FlatList } from "react-native";
import Divider from "./divider";
import { squad_styles } from "./squads_styles";
import { Button } from "react-native";
import AddSquadModal from "./add_squad"


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

  const addSquad = (squadName: string) => {
    setSquads(squads.concat([squadName]));
    setAddSquadModalVisble(false)
  }


  const renderSquadItem = ({ item, index, separators }) => {
    return (
      <View style={squad_styles.squad_item}>
        <Text>{item}</Text>
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
