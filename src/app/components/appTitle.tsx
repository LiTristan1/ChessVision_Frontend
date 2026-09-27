import { Text, View } from "react-native";
import { slogan } from "../constants/constants";

type Props = {
    showOnlyTitle: boolean
}
export function AppTitle(
    { showOnlyTitle }: Props
) {

    return (
        <View
            className='flex justify-center items-center'
        >
            <Text className='text-5xl text-white'>
                Chess
                <Text className='text-5xl text-sky-500'>
                    Vision
                </Text>
            </Text>
            {
                !showOnlyTitle && <Text className='text-3xl text-white'>
                    {slogan}
                </Text>
            }


        </View>
    )
}