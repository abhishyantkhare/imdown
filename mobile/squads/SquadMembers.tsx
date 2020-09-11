import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
  Flatlist,
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import SquadMembersStyles from './SquadMembersStyles';
import { callBackend, getUsersInSquad, deleteRequest } from '../backend/backend';
import { StandardButton } from "../components/button/Button";
import { TextStyles } from "../TextStyles";
import AppNavRouteProp from '../types/navigation';

type SquadMembersProps = AppNavRouteProp<'SquadMembers'>;

const SquadMembers = ({ route }: SquadMembersProps) => {
  const userId = props.route.params.userId
  const squadId = props.route.params.squadId
  const [users, setUsers] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isInEditView, setIsInEditView] = useState(props.route.params.isInEditView)

  useFocusEffect(
    useCallback(() => {
      getUsersInSquad(squadId).then(data => {
        setUsers(data.user_info);
      });
    }, [])
  );

  const renderEditButton = () => {
    return (
      <StandardButton text="Edit" override_style={SquadMembersStyles.editToggle} onPress={() => { setIsInEditView(true);
        props.navigation.setOptions({
          headerRight: () => (
            <View style={SquadMembersStyles.headerRight}>
              {renderDoneEdittingButton()}
            </View>
          )
        });
      }} />
    );
  }

  const renderDoneEdittingButton = () => {
    return (
      <StandardButton text="Done" override_style={SquadMembersStyles.editToggle} onPress={() => { setIsInEditView(false);
        props.navigation.setOptions({
          headerRight: () => (
            <View style={SquadMembersStyles.headerRight}>
              {renderEditButton()}
            </View>
          )
        });
      }} />
    );
  }

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
      <View style={SquadMembersStyles.headerRight}>
        {isInEditView ? renderDoneEdittingButton() :  renderEditButton()}
      </View>
      ),
    });
  }, [props.navigation]);

  const alertPopUp = (id: number, name: string) => {
    return (
      Alert.alert(
        'Alert',
        `Are you sure you want to delete ${name}?`,
        [
          {
            text: 'Yes',
            onPress: () => {
              deleteRequest('delete_user', { user_id: id, squad_id: squadId }).then(data => {
                setUsers(data.user_info);
                if (id == userId) {
                  props.navigation.navigate("Squads");
                }
              });
            },
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ],
        { cancelable: true }
      )
    )
  }

  const renderUsersItem = ({ item }: { item: any}) => {
    return (
      <View style={SquadMembersStyles.userInfoView}>
        { isInEditView && <TouchableOpacity style={[SquadMembersStyles.deleteIcon, {marginRight: "5%"}]} onPress={() => alertPopUp(item.id, item.name)}>
          <Image source={require('../assets/list_delete_icon.png')} style={SquadMembersStyles.deleteIcon} />
        </TouchableOpacity> }
        <Image style={[SquadMembersStyles.userImage, {marginRight: "3%"}]} source={{ uri: item.photo }} />
        <Text style={[TextStyles.paragraph]}>{item.name}</Text>
      </View>
    )
  }

  return (
    <View style={SquadMembersStyles.squadsMembersContainer}>
      <Text style={[TextStyles.title, SquadMembersStyles.titleText]}>Squad Members</Text>
      <FlatList
        data={users}
        renderItem={renderUsersItem}
      />
    </View>
  );
}

export default SquadMembers;
