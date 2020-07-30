import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { squad_styles } from "./squads_styles";
import { Button } from "react-native";
import AddSquadModal from "./add_squad"
import { callBackend } from "../backend/backend"


export type Squad = {
    id: number,
    name: string,
    squad_emoji: string,
    code: string
}

const Squads = (props) => {

    const [addSquadModalVisble, setAddSquadModalVisble] = useState(false)
    const [squads, setSquads] = useState(props.route.params.squads)
    const [email, setEmail] = useState(props.route.params.email)


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

    useEffect(() => {
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
            setSquads(squads.concat(data.squads));
        });
    }, []);



    const addSquad = (newSquad: Squad) => {
        setSquads(squads.concat([newSquad]));
        setAddSquadModalVisble(false)
    }


    const goToEvents = (id: number, name: string, squad_emoji: string, squad_code: number) => {
        props.navigation.navigate("Events", {
            squadId: id,
            squadName: name,
            squadEmoji: squad_emoji,
            squadCode: squad_code
        })
    }

    const renderSquadItem = ({ item }: { item: Squad }) => {
        return (
            <View style={squad_styles.squad_item}>
                <TouchableOpacity onPress={() => { goToEvents(item.id, item.name, item.squad_emoji, item.code) }}>
                    <Text style={squad_styles.squad_text}>{item.squad_emoji} {item.name}</Text>
                </TouchableOpacity>
            </View>
        );
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
                onPress={addSquad}
            />
        </View>
    );
}

export default Squads;
