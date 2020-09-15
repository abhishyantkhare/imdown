import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { useFocusEffect } from '@react-navigation/native';

import SquadMembersStyles from './SquadMembersStyles';
import { callBackend, getUsersInSquad } from '../backend/backend';
import AppNavRouteProp from '../types/navigation';

type SquadMembersProps = AppNavRouteProp<'SquadMembers'>;

const SquadMembers = ({ route }: SquadMembersProps) => {
  const [users, setUsers] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [squadId, setSquadId] = useState(route.params.squadId);

  const convertToKeyValDict = (usersInput: any) => (
    usersInput.map((_: any, i: number) => ({ key: i, user: usersInput[i] }))
  );

  useFocusEffect(
    useCallback(() => {
      getUsersInSquad(squadId).then((data) => {
        setUsers(convertToKeyValDict(data.user_info));
      });
    }, []),
  );

  const deleteUser = (userId: number) => {
    const endpoint = 'delete_user';
    const data = {
      user_id: userId, // eslint-disable-line camelcase
      squad_id: squadId, // eslint-disable-line camelcase
    };
    const init: RequestInit = { // eslint-disable-line no-undef
      method: 'DELETE',
      mode: 'no-cors',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    callBackend(endpoint, init).then((response) => response.json())
      .then((responseData) => {
        setUsers(convertToKeyValDict(responseData.user_info));
      });
  };

  const alertPopUp = (id: number, name: string) => (
    Alert.alert(
      'Alert',
      `Are you sure you want to delete ${name}?`,
      [
        {
          text: 'Yes',
          onPress: () => { deleteUser(id); },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    )
  );

  const closeRow = (rowMap: any, rowKey: number) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteBtn = (id: number, name: string, rowKey: number, rowMap: any) => (
    <TouchableOpacity
      style={[SquadMembersStyles.backRightBtn, SquadMembersStyles.deleteBtn]}
      onPress={() => {
        closeRow(rowMap, rowKey);
        alertPopUp(id, name);
      }}
    >
      <Text style={SquadMembersStyles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderUsersItem = (data: any, rowMap: any) => (
    <SwipeRow
      rightOpenValue={-75}
      disableRightSwipe
    >
      <View style={SquadMembersStyles.rowBack}>
        {deleteBtn(data.item.user.id, data.item.user.name, data.item.key, rowMap)}
      </View>

      <View style={SquadMembersStyles.rowFront}>
        <View style={SquadMembersStyles.userInfoView}>
          <View style={{ paddingRight: 10 }}>
            <Image style={SquadMembersStyles.userImage} source={{ uri: data.item.user.photo }} />
          </View>
          <View style={{ paddingBottom: 8 }}>
            <Text style={SquadMembersStyles.userText}>
              {data.item.user.name}
            </Text>
          </View>
        </View>
      </View>
    </SwipeRow>
  );

  return (
    <View style={SquadMembersStyles.squadsMembersContainer}>
      <SwipeListView
        data={users}
        renderItem={renderUsersItem}
      />
    </View>
  );
};

export default SquadMembers;
