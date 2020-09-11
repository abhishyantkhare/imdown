import React, { useState, useCallback, useLayoutEffect } from "react";
import { FlatList, View, Text, Image, Alert, TouchableOpacity } from "react-native";
import { TextStyles } from "../TextStyles";
import { SquadMembersStyles } from "./SquadMembersStyles";
import { callBackend, getUsersInSquad } from "../backend/backend"
import { useFocusEffect } from "@react-navigation/native";
import { StandardButton } from "../components/button/Button";


const EditSquadMembers = (props) => {
    const squadId = props.route.params.squadId
    const [users, setUsers] = useState([])
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
            <StandardButton text="Edit" override_style={{width: 100}} onPress={() => { setIsInEditView(true); 
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
            <StandardButton text="Done" override_style={{width: 100}} onPress={() => { setIsInEditView(false);
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
            setUsers(data.user_info);
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
            <FlatList
                data={users}
                renderItem={renderUsersItem}
            />
        </View>
    );
}

export {EditSquadMembers};

