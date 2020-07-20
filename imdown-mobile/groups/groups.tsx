import React, {useLayoutEffect, useState} from "react";
import { View, Text, FlatList } from "react-native";
import Divider from "./divider";
import { group_styles } from "./groups_styles";
import { Button } from "react-native";
import AddGroupModal from "./add_group"


const Groups = (props) => {

  const [addGroupModalVisble, setAddGroupModalVisble] = useState(false)
  const [groups, setGroups] = useState(props.route.params.groups)

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => setAddGroupModalVisble(true)}
          title="Add"
          color="#000"
        />
      ),
    });
  }, [props.navigation]);

  const addGroup = (groupName: string) => {
    setGroups(groups.concat([groupName]));
    setAddGroupModalVisble(false)
  }


  const renderGroupItem = ({ item, index, separators }) => {
    return (
      <View style={group_styles.group_item}>
        <Text>{item}</Text>
      </View>
    );
  };
  return (
    <View style={group_styles.groups_container}>
      <FlatList
        ItemSeparatorComponent={Divider}
        data={groups}
        renderItem={renderGroupItem}
        style={group_styles.group_list}
      />
      <AddGroupModal
        visible={addGroupModalVisble}
        onPress={addGroup}
      />
    </View>
  );
}

export default Groups;
