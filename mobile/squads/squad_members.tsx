import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, Alert} from "react-native";
import { squad_members_styles } from "./squad_members_styles";
import { callBackend } from "../backend/backend"
import { User } from "../types/user"
import Swipeout from 'react-native-swipeout';

const SquadMembers = (props) => {
    const [users, setUsers] = useState([])
    const [squadId, setSquadId] = useState(props.route.params.squadId)

    useEffect(() => {
        const endpoint = 'get_users?squadId=' + squadId
        const init: RequestInit = {
            method: "GET",
            headers: {
            'Content-Type': 'application/json'
            },
        }
        callBackend(endpoint, init).then(response => { 
            return response.json();
        }).then(data => { 
            setUsers(users.concat(data.user_info));
        });
    }, []);  

    const deleteUser = (userId: number, index: number) => {
        const endpoint = 'delete_user'
        const data = {
            user_id: userId,
            squad_id: squadId
        }
        const init: RequestInit = {
            method: 'DELETE',
            mode: 'no-cors',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        }
        callBackend(endpoint, init).then(response => { 
            return response.json();
        }).then(data => { 
            setUsers(data.user_info);
        });
    }

    const deletebtn = (id: number, name: string, index: number) => {
        return (
            [
                {
                  text: 'delete', 
                  onPress: () => { 
                    Alert.alert(
                       'Alert',
                       'Are you sure you want to delete ' + name   + '?',
                       [
                            {
                                text: 'Yes', 
                                onPress: () => { deleteUser(id, index) },
                            },
                            {
                                text: 'Cancel', 
                                style: "cancel"
                            }
                       ],
                       { cancelable: true}
                    )   
                  },
                  backgroundColor: "red"
                }
            ]
        )
    } 
    

    const renderUsersItem = ({ item, index }: { item: User, index: number }) => {
        return (
          <Swipeout right={deletebtn(item.id, item.name, index)} 
                    backgroundColor="white"
                    autoClose={true}
                    >
                <View style={squad_members_styles.user_info_view}>
                    <View style={{paddingRight: 10}}>
                        <Image style={squad_members_styles.user_image} source={{ uri: item.photo }} />
                    </View>
                    <View style={{paddingBottom: 8}}>
                        <Text style={squad_members_styles.user_text}>{item.name} </Text>
                    </View>
                </View>
          </Swipeout>  
        );
      };

  return (
    <View style={squad_members_styles.squads_members_container}>
        <FlatList
            data={users}
            renderItem={renderUsersItem}
            style={squad_members_styles.users_list}
        />
    </View>
  );
}

export default SquadMembers;
