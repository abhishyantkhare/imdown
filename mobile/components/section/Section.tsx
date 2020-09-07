import React from "react"
import { View } from "react-native"
import Label from "../label/Label"
import Divider from "../divider/divider"
import OptionalLabel from "../optionallabel/OptionalLabel"
import SectionStyles from "./SectionStyles"

type SectionProps = {
    label: string,
    children: React.ReactNode,
    optional?: boolean
}

const Section = (props: SectionProps) => {
    return (
        <View>
            <View style={SectionStyles.labelHeader}>
                <Label
                    labelText={props.label}
                />
                {props.optional ?
                    <OptionalLabel
                        style={{ marginLeft: "15%" }}
                    />
                    :
                    null
                }
            </View>
            {props.children}
            <Divider style={{ marginTop: "10%" }} />
        </View>
    )
}

export default Section