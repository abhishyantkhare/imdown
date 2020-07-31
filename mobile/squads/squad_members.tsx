import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image} from "react-native";
import { squad_members_styles } from "./squad_members_styles";
import {callBackend } from "../backend/backend"
import {User} from "../types/user"

type Users = {
    name: string,
    photo: string
}

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

    const renderUsersItem = ({ item }: { item: User }) => {
        return (
          <View style={squad_members_styles.user_info_view}>
            <View style={{paddingRight: 10}}>
                <Image style={squad_members_styles.user_image} source={{ uri: item.photo }} />
            </View>
            <View style={{paddingBottom: 8}}>
                <Text style={squad_members_styles.user_text}>{item.name} </Text>
            </View>
          </View>
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
