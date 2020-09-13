import React from "react"
import { View } from "react-native"
import Label from "../label/Label"
import Divider from "../divider/Divider"
import OptionalLabel from "../optionallabel/OptionalLabel"
import SectionStyles from "./SectionStyles"

type SectionProps = {
    label: string,
    children: React.ReactNode,
    optional?: boolean,
    style?: object
}

const Section = (props: SectionProps) => {
    return (
        <View style={[props.style]}>
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
            <Divider style={{ marginTop: "12.5%" }} />
        </View>
    )
}

export default Section