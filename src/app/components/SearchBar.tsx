import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { TextInput, View } from "react-native";
import { colors } from "../themes/themes";

type Props = {
    placeholder: string
}
export function SearchBar(
    {placeholder} : Props
){

    return (
        <View className = 'flex flex-row'>
            <FontAwesome6
                name = "magnifying-glass"
                size = {24}
                color = 'white'
                iconStyle = {"solid"}
            />
            <TextInput 
                className = {`w-full h-[45px] rounded-xl p-5`} 
                style = {{
                    backgroundColor: colors.componentBackground
                }}
                placeholder = {placeholder}
                placeholderTextColor= 'white'
                
            >
                
            </TextInput>
        </View>
    )
}