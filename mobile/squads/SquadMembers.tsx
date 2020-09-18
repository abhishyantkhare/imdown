import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import SquadMembersStyles from './SquadMembersStyles';
import { getUsersInSquad, deleteRequest } from '../backend/backend';
import StandardButton from '../components/button/Button';
import TextStyles from '../TextStyles';
import { AppNavigationProp, AppRouteProp } from '../types/navigation';

type SquadMembersProps = {
  navigation: AppNavigationProp<'SquadMembers'>;
  route: AppRouteProp<'SquadMembers'>;
};

const deleteIcon = require('../assets/list_delete_icon.png');

const SquadMembers = ({ route, navigation }: SquadMembersProps) => {
  const { userId, squadId } = route.params;
  const [users, setUsers] = useState([]);
  const [isInEditView, setIsInEditView] = useState(route.params.isInEditView);

  useFocusEffect(
    useCallback(() => {
      getUsersInSquad(squadId).then((data) => {
        setUsers(data.user_info);
      });
    }, []),
  );

  const renderEditButton = () => (
    <StandardButton
      text='Edit'
      overrideStyle={SquadMembersStyles.editToggle}
      onPress={() => {
        setIsInEditView(true);
        navigation.setOptions({
          headerRight: () => (
            <View style={SquadMembersStyles.headerRight}>
              {renderDoneEdittingButton()}
            </View>
          ),
        });
      }}
    />
  );

  const renderDoneEdittingButton = () => (
    <StandardButton
      text='Done'
      overrideStyle={SquadMembersStyles.editToggle}
      onPress={() => {
        setIsInEditView(false);
        navigation.setOptions({
          headerRight: () => (
            <View style={SquadMembersStyles.headerRight}>
              {renderEditButton()}
            </View>
          ),
        });
      }}
    />
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={SquadMembersStyles.headerRight}>
          {isInEditView ? renderDoneEdittingButton() : renderEditButton()}
        </View>
      ),
    });
  }, [navigation]);

  const alertPopUp = (id: number, name: string) => (
    Alert.alert(
      'Alert',
      `Are you sure you want to delete ${name}?`,
      [
        {
          text: 'Yes',
          onPress: () => {
            deleteRequest('delete_user', { user_id: id, squad_id: squadId }).then((data) => { // eslint-disable-line camelcase
              setUsers(data.user_info);
              if (id === userId) {
                navigation.navigate('Squads');
              }
            });
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    )
  );

  const renderUsersItem = (
    { item }: { item: any }, // eslint-disable-line react/no-unused-prop-types
  ) => (
    <View style={SquadMembersStyles.userInfoView}>
      { isInEditView && (
      <TouchableOpacity style={[SquadMembersStyles.deleteIcon, { marginRight: '5%' }]} onPress={() => alertPopUp(item.id, item.name)}>
        <Image source={deleteIcon} style={SquadMembersStyles.deleteIcon} />
      </TouchableOpacity>
      ) }
      <Image style={[SquadMembersStyles.userImage, { marginRight: '3%' }]} source={{ uri: item.photo }} />
      <Text style={[TextStyles.paragraph]}>{item.name}</Text>
    </View>
  );

  return (
    <View style={SquadMembersStyles.squadsMembersContainer}>
      <Text style={[TextStyles.title, SquadMembersStyles.titleText]}>Squad Members</Text>
      <FlatList
        data={users}
        renderItem={renderUsersItem}
      />
    </View>
  );
};

export default SquadMembers;
