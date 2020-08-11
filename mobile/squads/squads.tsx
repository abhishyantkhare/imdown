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
    const [user_id, setUserId] = useState()


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

    const deletebtn = (squadName: string) => {
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
                                onPress: () => { console.log("deleted") },
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
        if(item.admin_id == user_id){
            return (
                <Swipeout right={deletebtn(item.name)} 
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
                admin_id={user_id}
                onPress={addSquad}
            />
        </View>
    );
}

export default Squads;
