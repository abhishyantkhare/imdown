import React, { useLayoutEffect, useState } from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Button,
} from 'react-native';
import { SwipeRow, SwipeListView } from 'react-native-swipe-list-view';
import { useFocusEffect } from '@react-navigation/native';

import SquadsStyles from './SquadsStyles';
import TextStyles from '../TextStyles';
import { callBackend } from '../backend/backend';
import StandardButton from '../components/button/Button';
import BlurModal from '../components/blurmodal/BlurModal';
import AppNavRouteProp from '../types/navigation';

export type Squad = {
  id: number;
  name: string;
  squadEmoji: string;
  code: string;
  adminId: number;
};

type SquadsProps = AppNavRouteProp<'Squads'>;

const searchButton = require('../assets/search_button.png');
const addSquadButton = require('../assets/add_squad_button.png');

const Squads = ({ route, navigation }: SquadsProps) => {
  const [squads, setSquads] = useState([]);
  const [email, setEmail] = useState(route.params.email); // eslint-disable-line no-unused-vars
  const [userId, setUserId] = useState();
  const [addSquadModal, setAddSquadModal] = useState(false);

  const goToAddNewSquad = () => {
    setAddSquadModal(false);
    navigation.navigate('AddNewSquad', {
      email,
    });
  };

  const goToAddExistingSquad = () => {
    setAddSquadModal(false);
    navigation.navigate('AddExistingSquad', {
      email,
    });
  };

  const signOutUser = () => {
    const endpoint = 'sign_out';
    const init: RequestInit = { // eslint-disable-line no-undef
      method: 'POST',
    };
    callBackend(endpoint, init).then(() => {
      navigation.navigate('Login');
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          onPress={() => signOutUser()}
          title='Sign Out'
          color='#000'
        />
      ),
    });
  }, [navigation]);

  const getUserId = () => {
    const endpoint = `get_user_id?email=${email}`;
    const init: RequestInit = { // eslint-disable-line no-undef
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    callBackend(endpoint, init)
      .then((response) => response.json())
      .then((data) => {
        setUserId(data.user_id);
      });
  };

  const convertToKeyValDict = (squadsConvert: any) => (
    squadsConvert.map((_: any, i: number) => ({ key: i, squad: squadsConvert[i] }))
  );

  const getSquads = () => {
    const endpoint = 'get_squads';
    const init: RequestInit = { // eslint-disable-line no-undef
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    callBackend(endpoint, init).then((response) => response.json())
      .then((data) => { setSquads(convertToKeyValDict(data.squads)); });
  };

  useFocusEffect(
    React.useCallback(() => {
      getSquads();
      getUserId();
    }, []),
  );

  const goToEvents = (id: number, name: string, squadEmoji: string, squadCode: string) => {
    navigation.navigate('Events', {
      squadId: id,
      squadName: name,
      squadEmoji,
      squadCode,
      userEmail: email,
      userId,
    });
  };

  const deleteSquad = (squadId: number) => {
    const endpoint = 'delete_squad';
    const init: RequestInit = { // eslint-disable-line no-undef
      method: 'DELETE',
      mode: 'no-cors',
      body: JSON.stringify({ squadId }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    callBackend(endpoint, init)
      .then((response) => response.json())
      .then((deleteData) => { setSquads(convertToKeyValDict(deleteData.squads)); });
  };

  const alertPopUp = (squadId: number, squadName: string) => (
    Alert.alert(
      'Alert',
      `Are you sure you want to delete ${squadName}?`,
      [
        {
          text: 'Yes',
          onPress: () => { deleteSquad(squadId); },
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

  const deleteBtn = (squadId: number, squadName: string, rowKey: number, rowMap: any) => (
    <TouchableOpacity
      style={[SquadsStyles.backRightBtns, SquadsStyles.deleteBtn]}
      onPress={() => {
        closeRow(rowMap, rowKey);
        alertPopUp(squadId, squadName);
      }}
    >
      <Text style={SquadsStyles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const goToEditSquad = (squadId: number, squadName: string, squadEmoji: string) => {
    navigation.navigate('EditSquad', {
      squadId,
      squadName,
      squadEmoji,
    });
  };

  const editBtn = (
    squadId: number,
    squadName: string,
    squadEmoji: string,
    rowKey: number,
    rowMap: any,
  ) => (
    <TouchableOpacity
      style={[SquadsStyles.backRightBtns, SquadsStyles.editBtn]}
      onPress={() => {
        closeRow(rowMap, rowKey);
        goToEditSquad(squadId, squadName, squadEmoji);
      }}
    >
      <Text style={SquadsStyles.editText}>Edit</Text>
    </TouchableOpacity>
  );
  const renderNoSquadsView = () => (
    <View>
      <Text // eslint-disable-line 
        style={SquadsStyles.noSquadViewWave}
        accessibilityLabel='Handwave'
        accessibilityRole='text'
      >
        👋
      </Text>
      <Text
        style={[TextStyles.paragraph, SquadsStyles.noSquadViewText]}
      >
        Add a squad to get started planning your next hangout.
      </Text>
      <StandardButton text='Add a squad' onPress={() => setAddSquadModal(true)} />
    </View>
  );

  const renderSearchButton = () => (
    <TouchableOpacity style={SquadsStyles.searchButtonContainer}>
      <Image source={searchButton} style={SquadsStyles.searchButtonIcon} />
    </TouchableOpacity>
  );

  const renderAddSquadButton = () => (
    <TouchableOpacity
      onPress={() => setAddSquadModal(true)}
      style={SquadsStyles.addSquadContainer}
    >
      <Image source={addSquadButton} style={SquadsStyles.addSquadButton} />
    </TouchableOpacity>
  );

  const renderSquadItem = (data: any, rowMap: any) => (
    <SwipeRow
      disableLeftSwipe={data.item.squad.admin_id !== userId}
      rightOpenValue={-150}
      disableRightSwipe
    >
      <View style={SquadsStyles.rowBack}>
        {deleteBtn(data.item.squad.id, data.item.squad.name, data.item.key, rowMap)}
        {editBtn(
          data.item.squad.id,
          data.item.squad.name,
          data.item.squad.squad_emoji,
          data.item.key,
          rowMap,
        )}
      </View>

      <View style={SquadsStyles.rowFront}>
        <TouchableOpacity
          onPress={() => {
            goToEvents(
              data.item.squad.id,
              data.item.squad.name,
              data.item.squad.squad_emoji,
              data.item.squad.code,
            );
          }}
        >
          <View style={SquadsStyles.squadItem}>
            <Text style={SquadsStyles.squadText}>
              {data.item.squad.squad_emoji}
              {data.item.squad.name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SwipeRow>
  );

  const renderAddSquadModal = () => (
    <BlurModal visible={addSquadModal} cancel={() => setAddSquadModal(false)}>
      <StandardButton text='Join an existing squad' onPress={() => goToAddExistingSquad()} />
      <StandardButton text='Create a new squad' overrideStyle={{ marginTop: 10, marginBottom: 30 }} onPress={() => goToAddNewSquad()} />
    </BlurModal>
  );

  return (
    <View style={SquadsStyles.squadsContainer}>
      {renderSearchButton()}
      <View style={SquadsStyles.squadsTitleContainer}>
        <Text style={[TextStyles.title, SquadsStyles.squadsTitleText]}>Squads</Text>
        {renderAddSquadButton()}
      </View>
      {squads.length > 0 ? (
        <SwipeListView
          data={squads}
          renderItem={renderSquadItem}
        />
      ) : renderNoSquadsView()}
      {renderAddSquadModal()}
    </View>
  );
};

export default Squads;
