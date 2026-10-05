import { Text, View } from "react-native"
import { colors, TextStyles } from "../../../themes/themes"
type Props = {
    colorIsBetter: "White" | "Black",
    evaluation: number
}
export function EvaluationBox(
    { colorIsBetter, evaluation }: Props

) {

    let prefix = ""
    if (colorIsBetter = "White") {
        prefix = "+"
    } else {
        "-"
    }
    return (
        <View
            className='w-3/4 h-[80px] flex-row flex items-center justify-center'
            style={{
                backgroundColor: colors.componentBackground
            }}
        >
            <View className='w-1/4 h-30px bg-[white] p-5'>
                <Text className='text-black'>{prefix} {evaluation}</Text>
            </View>

            <View
                className='w-1/2 h-40px p-5'
            >
                <Text style={TextStyles.description}>
                    Position Evaluation
                </Text>

                <Text style={TextStyles.description}>
                    Slightly better for {colorIsBetter}
                </Text>
            </View>
        </View>
    )
}