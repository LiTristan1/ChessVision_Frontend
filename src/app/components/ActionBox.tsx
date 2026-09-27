import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { Text, View } from "react-native";
import { colors} from '../themes/themes';


type Props = {
    description: string,
    icon: any
}
export function ActionBox(
   {description, icon}: Props
){
    return (
        <View 
            className = 'flex flex-col w-[48%] rounded-xl min-h-[80px] justify-center items-center'
            style = {{
                backgroundColor: colors.componentBackground
            }}
        >
            <FontAwesome6
                name = {icon}
                size = {24} 
                color = {colors.iconTint}
            />
            <Text
                className = 'text-white'
            >
                {description}
            </Text>
        </View>
    )
}