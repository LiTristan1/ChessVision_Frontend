import { logout } from "@/app/api/auth";
import { useAppSelector } from "@/app/hooks/reduxHooks";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
export default function Logout(

) {
    const router = useRouter()
    const chessVisionProfile = useAppSelector((state) => state.player.chessVisionUser)
    const username = chessVisionProfile?.username ?? ""
    useEffect(() => {

        async function tryLogout() {
            try {
                const response = await logout(username)

                if (response) {
                    router.navigate('/')
                }
            } catch (e) {
                console.log("There was an error with logging out: " + e)
            }
        }

        tryLogout()
    }, [])


    return (
        <View className="flex-1 justify-center items-center bg-slate-950">

            <ActivityIndicator size="large" color="#10B981" />
            <Text className="text-gray-400 text-base mt-4">
                Logging out...
            </Text>
        </View>
    );
}