import { Text } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChessBoard } from "./components/ChessBoard";
import { containers } from "./themes/themes";
export default function Games(){
    return (
        <SafeAreaView style = {containers.PrimaryContainer}>
            <Text>
                Analysis Page
            </Text>
            <ChessBoard/>
        </SafeAreaView>
    )
}