import { useState } from 'react'
import { Text, View } from "react-native"
import { TextStyles } from '../themes/themes'
type Props = {
    monthIndex: number
}
export function MonthlyGamesBox(
    { monthIndex }: Props
) {
    
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const [month, setMonth] = useState<string>(months[monthIndex])
    return (
        <View className="w-full h-[50px] bg-[#0B1929]">
            <Text style={TextStyles.tertiary}>
                month
            </Text>
        </View>
    )
}