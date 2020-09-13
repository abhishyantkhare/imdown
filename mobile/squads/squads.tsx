import React, { useLayoutEffect, useState } from "react";
import { Image, View, Text, TouchableOpacity, TouchableWithoutFeedback, Alert } from "react-native";
import { squad_styles } from "./squads_styles";
import { TextStyles } from "../TextStyles";
import { Button } from "react-native";
import { callBackend, deleteSquad } from "../backend/backend"
import { SwipeRow, SwipeListView } from "react-native-swipe-list-view"
import { useFocusEffect } from "@react-navigation/native";
import { StandardButton } from "../components/button/Button"
import BlurModal from "../components/blurmodal/BlurModal"
import ButtonBottomSheet from "../components/bottomsheet/ButtonBottomSheet"


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
    const sheetRef = React.useRef(null);
    const [bottomSheetRefIndex, setBottomSheetRefIndex] = useState(0)

    const hideBottomSheet = () => {
        setBottomSheetRefIndex(0)
        sheetRef.current.snapTo(0)
    }

    const showBottomSheet = () => {
        setBottomSheetRefIndex(1)
        sheetRef.current.snapTo(1)
    }

    const goToAddNewSquad = () => {
        hideBottomSheet()
        props.navigation.navigate("Add New Squad", {
            email: email,
        });
    }

    const goToAddExistingSquad = () => {
        hideBottomSheet()
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
        sheetRef.current.snapTo(0)
        props.navigation.navigate("Events", {
            squadId: id,
            squadName: name,
            squadEmoji: squad_emoji,
            squadCode: squad_code,
            userEmail: email,
            userId: userId
        })
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
                            deleteSquad(squadId, userId).then(data => {
                                setSquads(convertToKeyValDict(data.squads));
                            });
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
        props.navigation.navigate("View Squad Settings", {
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
                <Text style={[TextStyles.paragraph, squad_styles.noSquadViewText]}>Add a squad to get started planning your next hangout.</Text>
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
            <TouchableOpacity onPress={() => bottomSheetRefIndex ? hideBottomSheet() : showBottomSheet()} style={squad_styles.addSquadContainer} >
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
            <BlurModal visible={addSquadModal} cancel={() => setAddSquadModal(false)}>
                <StandardButton text="Join an existing squad" onPress={() => goToAddExistingSquad()} />
                <StandardButton text="Create a new squad" override_style={{ marginTop: 10, marginBottom: 30 }} onPress={() => goToAddNewSquad()} />
            </BlurModal>
        );
    }

    return (
        <View style={squad_styles.squads_container}>
            {renderSearchButton()}
            <View style={squad_styles.squadsTitleContainer}>
                <Text style={[TextStyles.title, squad_styles.squadsTitleText]}>Squads</Text>
                {renderAddSquadButton()}
            </View>
            {squads.length > 0 ? <SwipeListView
                data={squads}
                renderItem={renderSquadItem}
            /> : renderNoSquadsView()}
            {renderAddSquadModal()}
            <ButtonBottomSheet
                sheetRef={sheetRef}
                hideBottomSheet={hideBottomSheet}
                snapPoints={[0, 250, 300]}
            >
                <StandardButton text="Join an existing squad" onPress={() => goToAddExistingSquad()} />
                <StandardButton text="Create a new squad" override_style={{ marginTop: 10, marginBottom: "10%" }} onPress={() => goToAddNewSquad()} />
            </ButtonBottomSheet>
        </View>
    );
}

export default Squads;
