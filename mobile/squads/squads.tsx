import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { squad_styles } from "./squads_styles";
import { Button } from "react-native";
import AddSquadModal from "./add_squad"
import { callBackend } from "../backend/backend"
import { SwipeRow, SwipeListView } from "react-native-swipe-list-view"
import { useFocusEffect } from "@react-navigation/native";


export type Squad = {
    id: number,
    name: string,
    squad_emoji: string,
    code: string,
    admin_id: number
}

const Squads = (props) => {
    const [squads, setSquads] = useState(props.route.params.squads)
    const [email, setEmail] = useState(props.route.params.email)
    const [userId, setUserId] = useState()

    const goToAddSquad = () => {
        props.navigation.navigate("Add Squad", {
            email: email,
        });
    }

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => goToAddSquad()}
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

    useFocusEffect(
        React.useCallback(() => {
            getSquads();
            getUserId();
        }, [])
    );



    const goToEvents = (id: number, name: string, squad_emoji: string, squad_code: string) => {
        props.navigation.navigate("Events", {
            squadId: id,
            squadName: name,
            squadEmoji: squad_emoji,
            squadCode: squad_code,
            userEmail: email,
            userId: userId
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


    const deleteBtn = (squadId: number, squadName: string) => {
        return (
            <TouchableOpacity
                style={[squad_styles.backRightBtns, squad_styles.deleteBtn]}
                onPress={() =>
                    Alert.alert(
                        'Alert',
                        'Are you sure you want to delete ' + squadName + '?',
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
                        { cancelable: true }
                    )

                }
            >
                <Text style={squad_styles.deleteText}>Delete</Text>
            </TouchableOpacity>
        )
    }

    const goToEditSquad = (squadId: number, squadName: string, squadEmoji: string) => {
        props.navigation.navigate("Edit Squad", {
            squadId: squadId,
            squadName: squadName,
            squadEmoji: squadEmoji
        });
    }

    const editBtn = (squadId: number, squadName: string, squadEmoji: string) => {
        return (
            <TouchableOpacity
                style={[squad_styles.backRightBtns, squad_styles.editBtn]}
                onPress={() => { goToEditSquad(squadId, squadName, squadEmoji) }
                }
            >
                <Text style={squad_styles.editText}>Edit</Text>
            </TouchableOpacity>
        )
    }


    const renderSquadItem = ({ item, index }: { item: Squad, index: number }) => (
        <SwipeRow
            disableLeftSwipe={item.admin_id != userId}
            rightOpenValue={-150}
            disableRightSwipe={true}
        >
            <View style={squad_styles.rowBack}>
                {deleteBtn(item.id, item.name)}
                {editBtn(item.id, item.name, item.squad_emoji)}
            </View>

            <View style={squad_styles.rowFront}>
                <View style={squad_styles.squad_item}>
                    <TouchableOpacity onPress={() => { goToEvents(item.id, item.name, item.squad_emoji, item.code) }}>
                        <Text style={squad_styles.squad_text}>{item.squad_emoji} {item.name}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SwipeRow>
    );

    return (
        <View style={squad_styles.squads_container}>
            <SwipeListView
                data={squads}
                renderItem={renderSquadItem}
            />
        </View>
    );
}

export default Squads;
