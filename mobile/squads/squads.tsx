import React, { useLayoutEffect, useState } from "react";
import { Image, Modal, View, Text, TouchableOpacity, Alert } from "react-native";
import { squad_styles } from "./squads_styles";
import { Button } from "react-native";
import { callBackend } from "../backend/backend"
import { SwipeRow, SwipeListView } from "react-native-swipe-list-view"
import { useFocusEffect } from "@react-navigation/native";
import { StandardButton } from "../components/button/Button"


export type Squad = {
    id: number,
    name: string,
    squad_emoji: string,
    code: string,
    admin_id: number
}

const Squads = (props) => {
    const [squads, setSquads] = useState([])
    const [email, setEmail] = useState(props.route.params.email)
    const [userId, setUserId] = useState()
    const [addSquadModal, setAddSquadModal] = useState(false)


    const goToAddNewSquad = () => {
        setAddSquadModal(false)
        props.navigation.navigate("Add New Squad", {
            email: email,
        });
    }

    const goToAddExistingSquad = () => {
        setAddSquadModal(false)
        props.navigation.navigate("Add Existing Squad", {
            email: email,
        });
    }

    const signOutUser = () => {
        const endpoint = 'sign_out'
        const init: RequestInit = {
            method: "POST",
        }
        callBackend(endpoint, init).then(() => {
            props.navigation.navigate("Login")
        })
    }

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => (
                <Button
                    onPress={() => signOutUser()}
                    title="Sign Out"
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

    const convertToKeyValDict = (squads: any) => {
        return squads.map((_, i) => ({ key: i, squad: squads[i] }))
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
            setSquads(convertToKeyValDict(data.squads));
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
            setSquads(convertToKeyValDict(data.squads));
        });
    }

    const alertPopUp = (squadId: number, squadName: string) => {
        return (
            Alert.alert(
                'Alert',
                'Are you sure you want to delete ' + squadName + '?',
                [
                    {
                        text: 'Yes',
                        onPress: () => {
                            deleteSquad(squadId)
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


    const deleteBtn = (squadId: number, squadName: string, rowKey: number, rowMap: any) => {
        return (
            <TouchableOpacity
                style={[squad_styles.backRightBtns, squad_styles.deleteBtn]}
                onPress={() => {
                    closeRow(rowMap, rowKey);
                    alertPopUp(squadId, squadName);
                }
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

    const editBtn = (squadId: number, squadName: string, squadEmoji: string, rowKey: number, rowMap: any) => {
        return (
            <TouchableOpacity
                style={[squad_styles.backRightBtns, squad_styles.editBtn]}
                onPress={() => {
                    closeRow(rowMap, rowKey);
                    goToEditSquad(squadId, squadName, squadEmoji);
                }
                }
            >
                <Text style={squad_styles.editText}>Edit</Text>
            </TouchableOpacity>
        )
    }

    const closeRow = (rowMap: any, rowKey: number) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const renderNoSquadsView = () => {
        return (
            <View>
                <Text style={squad_styles.noSquadViewWave}>👋</Text>
                <Text style={squad_styles.noSquadViewText}>Add a squad to get started planning your next hangout.</Text>
                <StandardButton text="Add a squad" onPress={() => setAddSquadModal(true)} />
            </View>
        );
    }

    const renderSearchButton = () => {
        return (
            <TouchableOpacity style={squad_styles.searchButtonContainer} >
                <Image source={require('../assets/search_button.png')} style={squad_styles.searchButtonIcon} />
            </TouchableOpacity>
        );
    }

    const renderAddSquadButton = () => {
        return (
            <TouchableOpacity onPress={() => setAddSquadModal(true)} style={squad_styles.addSquadContainer} >
                <Image source={require('../assets/add_squad_button.png')} style={squad_styles.addSquadButton} />
            </TouchableOpacity>
        );
    }

    const renderSquadItem = (data: any, rowMap: any) => (
        <SwipeRow
            disableLeftSwipe={data.item.squad.admin_id != userId}
            rightOpenValue={-150}
            disableRightSwipe={true}
        >
            <View style={squad_styles.rowBack}>
                {deleteBtn(data.item.squad.id, data.item.squad.name, data.item.key, rowMap)}
                {editBtn(data.item.squad.id, data.item.squad.name, data.item.squad.squad_emoji, data.item.key, rowMap)}
            </View>

            <View style={squad_styles.rowFront}>
                <TouchableOpacity onPress={() => { goToEvents(data.item.squad.id, data.item.squad.name, data.item.squad.squad_emoji, data.item.squad.code) }}>
                    <View style={squad_styles.squad_item}>
                        <Text style={squad_styles.squad_text}>{data.item.squad.squad_emoji} {data.item.squad.name}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SwipeRow>
    );

    const renderAddSquadModal = () => {
        return (
            <Modal visible={addSquadModal} animationType="fade" transparent>
                <View style={squad_styles.modalBackgroundBlur}>
                    <View style={squad_styles.modalVisibleContainer}>
                        <TouchableOpacity onPress={() => setAddSquadModal(false)} style={squad_styles.exitButtonContainer} >
                            <Image source={require('../assets/exit_button.png')} style={squad_styles.exitButton} />
                        </TouchableOpacity>
                        <StandardButton text="Join an existing squad" onPress={() => goToAddExistingSquad()} />
                        <StandardButton text="Create a new squad" override_style={{ marginTop:10, marginBottom: "10%" }} onPress={()=> goToAddNewSquad()} />
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <View style={squad_styles.squads_container}>
            {renderSearchButton()}
            <View style={squad_styles.squadsTitleContainer}>
                <Text style={squad_styles.squadsTitleText}>Squads</Text>
                {renderAddSquadButton()}
            </View>
            {squads.length > 0 ? <SwipeListView
                data={squads}
                renderItem={renderSquadItem}
            /> : renderNoSquadsView()}
            {renderAddSquadModal()}
        </View>
    );
}

export default Squads;
