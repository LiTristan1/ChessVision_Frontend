import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { Text, View } from "react-native";
import { ComponentBackground } from '../themes/themes';


type Props = {
    description: string,
    icon: any
}
export function ActionBox(
   {description, icon}: Props
){
    return (
        <View className = 'flex flex-col w-[48%] bg-[#101C28] rounded-xl min-h-[80px] justify-center items-center'>
            <FontAwesome6
                name = {icon}
                size = {24}
                color = {ComponentBackground}
            />
            <Text
                className = 'text-white'
            >
                {description}
            </Text>
        </View>
    )
}