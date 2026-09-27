import { ScrollView, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MonthlyGamesBox } from "../components/MonthlyGamesBox"
import { containers } from "../themes/themes"
export default function Explorer() {
    const dummyMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return (
        <SafeAreaView
            style={containers.PrimaryContainer}
        >


            <ScrollView>


                <View
                    className='gap-2'
                >


                    {
                        dummyMonths.map((value, index) => {
                            return (
                                <MonthlyGamesBox
                                    key={index}
                                    monthIndex={index}
                                />
                            )
                        })
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}