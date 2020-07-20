import React from "react";
import { View, Text, FlatList } from "react-native";
import Divider from "./divider";
import { group_styles } from "./groups_styles";

export default function Groups(props) {
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
        data={props.route.params.groups}
        renderItem={renderGroupItem}
        style={group_styles.group_list}
      />
    </View>
  );
}
