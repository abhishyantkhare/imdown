import React, { useState, useCallback } from "react";
import { View, Text, Image, Alert, TouchableOpacity } from "react-native";
import { squad_members_styles } from "./squad_members_styles";
import { callBackend, getUsersInSquad } from "../backend/backend"
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import { useFocusEffect } from "@react-navigation/native";


const SquadMembers = (props) => {
    const [users, setUsers] = useState([])
    const [squadId, setSquadId] = useState(props.route.params.squadId)

    useFocusEffect(
        useCallback(() => {
            getUsersInSquad(squadId).then(data => {
                setUsers(convertToKeyValDict(data.user_info));
            });
        }, [])
    );

    const convertToKeyValDict = (users: any) => {
        return users.map((_, i) => ({ key: i, user: users[i] }))
    }

    const deleteUser = (userId: number) => {
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
            setUsers(convertToKeyValDict(data.user_info));
        });
    }

    const alertPopUp = (id: number, name: string) => {
        return (
            Alert.alert(
                'Alert',
                'Are you sure you want to delete ' + name + '?',
                [
                    {
                        text: 'Yes',
                        onPress: () => {
                            deleteUser(id)
                        },
                    },
                    {
                        text: 'Cancel',
                        style: "cancel"
                    }
                ],
                { cancelable: true }
            )
        )
    }

    const closeRow = (rowMap: any, rowKey: number) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteBtn = (id: number, name: string, rowKey: number, rowMap: any) => {
        return (
            <TouchableOpacity
                style={[squad_members_styles.backRightBtn, squad_members_styles.deleteBtn]}
                onPress={() => {
                    closeRow(rowMap, rowKey);
                    alertPopUp(id, name);
                }
                }
            >
                <Text style={squad_members_styles.deleteText}>Delete</Text>
            </TouchableOpacity>
        )
    }


    const renderUsersItem = (data: any, rowMap: any) => (
        <SwipeRow
            rightOpenValue={-75}
            disableRightSwipe={true}
        >
            <View style={squad_members_styles.rowBack}>
                {deleteBtn(data.item.user.id, data.item.user.name, data.item.key, rowMap)}
            </View>

            <View style={squad_members_styles.rowFront}>
                <View style={squad_members_styles.user_info_view}>
                    <View style={{ paddingRight: 10 }}>
                        <Image style={squad_members_styles.user_image} source={{ uri: data.item.user.photo }} />
                    </View>
                    <View style={{ paddingBottom: 8 }}>
                        <Text style={squad_members_styles.user_text}>{data.item.user.name} </Text>
                    </View>
                </View>
            </View>
        </SwipeRow>
    );

    return (
        <View style={squad_members_styles.squads_members_container}>
            <SwipeListView
                data={users}
                renderItem={renderUsersItem}
            />
        </View>
    );
}

export default SquadMembers;
