import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { View } from "react-native";


type Props = {
    description: string,
    icon: any
}
export function ActionBox(
    props: Props
){
    return (
        <View className = 'flex flex-col'>
            <FontAwesome6
                name = {props.icon}
                size = {24}
                color = {"white"}
            />
        </View>
    )
}