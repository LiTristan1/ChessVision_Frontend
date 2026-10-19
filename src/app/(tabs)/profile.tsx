import { useState } from 'react'
import { Text, View } from "react-native"
import { useAppSelector } from "../hooks/reduxHooks"
export default function Profile() {
    const username = useAppSelector(state => state.player.chessVisionUserName)
    const [isEditing, setIsEditing] = useState(false)
    return (
        <View>
            <Text>
                Profile Page
            </Text>


        </View>
    )
}