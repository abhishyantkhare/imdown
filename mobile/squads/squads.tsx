import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { squad_styles } from "./squads_styles";
import { Button } from "react-native";
import AddSquadModal from "./add_squad"
import { callBackend } from "../backend/backend"
import Swipeout from "react-native-swipeout";


export type Squad = {
    id: number,
    name: string,
    squad_emoji: string,
    code?: string,
    admin_id: number
}

const Squads = (props) => {

    const [addSquadModalVisble, setAddSquadModalVisble] = useState(false)
    const [squads, setSquads] = useState(props.route.params.squads)
    const [email, setEmail] = useState(props.route.params.email)
    const [userId, setUserId] = useState()


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

    const getUserId = () => {
        const endpoint = 'get_user_id?email=' + email
        const init: RequestInit = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        }
        callBackend(endpoint, init).then(response => {
            return response.json();
        }).then(data => {
            setUserId(data.user_id)
        });
    }

    const getSquads = () => {
        const endpoint = 'get_squads?email=' + email
        const init: RequestInit = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        }
        callBackend(endpoint, init).then(response => {
            return response.json();
        }).then(data => {
            setSquads(data.squads);
        });
    }

    useEffect(() => {
        getSquads();
        getUserId();
    }, []);



    const addSquad = (newSquad: Squad) => {
        //setSquads(squads.concat([newSquad]));
        setAddSquadModalVisble(false)
        getSquads()
    }


    const goToEvents = (id: number, name: string, squad_emoji: string, squad_code: string) => {
        props.navigation.navigate("Events", {
            squadId: id,
            squadName: name,
            squadEmoji: squad_emoji,
            squadCode: squad_code,
            userEmail: email
        })
    }

    const deleteSquad = (squadId: number) => {
        const endpoint = 'delete_squad'
        const data = {
            squad_id: squadId,
            user_id: userId
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
            setSquads(data.squads);
        });
    }

    const deletebtn = (squadName: string, squadId: number) => {
        return (
            [
                {
                  text: 'delete', 
                  onPress: () => { 
                    Alert.alert(
                       'Alert',
                       'Are you sure you want to delete ' + squadName   + '?',
                       [
                            {
                                text: 'Yes', 
                                onPress: () => { deleteSquad(squadId) },
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

    const renderSquadItem = ({ item }: { item: Squad }) => {
        if(item.admin_id == userId){
            return (
                <Swipeout right={deletebtn(item.name, item.id)} 
                    backgroundColor="white"
                    autoClose={true}
                >
                        <View style={squad_styles.squad_item}>
                            <TouchableOpacity onPress={() => { goToEvents(item.id, item.name, item.squad_emoji, item.code) }}>
                                <Text style={squad_styles.squad_text}>{item.squad_emoji} {item.name}</Text>
                            </TouchableOpacity>
                        </View>
                </Swipeout>
            );
            
        } else {
            return (
                <View style={squad_styles.squad_item}>
                    <TouchableOpacity onPress={() => { goToEvents(item.id, item.name, item.squad_emoji, item.code) }}>
                        <Text style={squad_styles.squad_text}>{item.squad_emoji} {item.name}</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };


    return (
        <View style={squad_styles.squads_container}>
            <FlatList
                data={squads}
                renderItem={renderSquadItem}
                style={squad_styles.squad_list}
            />
            <AddSquadModal
                visible={addSquadModalVisble}
                email={email}
                admin_id={userId}
                onPress={addSquad}
            />
        </View>
    );
}

export default Squads;
