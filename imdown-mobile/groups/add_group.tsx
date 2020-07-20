import React, { Component } from "react";
import { View, Modal, TextInput, TouchableHighlight, Text } from "react-native";

export default class AddGroupModal extends Component {
  state = {
    modalVisible: false
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onAddGroup() {
    this.setModalVisible(false);
  }

  render() {
    return (
      <View>
        <Modal
          transparent={false}
          visible={this.state.modalVisible}
          presentationStyle={"formSheet"}
        >
          <View>
            <TextInput placeholder={"Add group name"} />
            <TouchableHighlight onPress={this.onAddGroup}>
              <Text>Add Group</Text>
            </TouchableHighlight>
          </View>
        </Modal>
      </View>
    );
  }
}
