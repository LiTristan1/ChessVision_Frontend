import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { Image } from "expo-image";
import { useRouter } from 'expo-router';
import { cssInterop } from "nativewind";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNewUser, login } from "./api/auth";
import { getUserGames } from "./api/games";
import { AppTitle } from "./components/appTitle";
import { useAppDispatch } from "./hooks/reduxHooks";
import { setGamesByYear } from "./Store/slices/GamesSlices";
import { type gamesByYear } from './types/responses';
cssInterop(Image, {
    className: "style",
});

export default function Login() {
    const [isRegistering, setIsRegistering] = useState<Boolean>(false)
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [chessComUsername, setChessComUsername] = useState<string>("")
    const router = useRouter()
    const dispatch = useAppDispatch()
    return (
        <SafeAreaView
            className='flex-1 w-full h-full bg-red-500 items-center'
        >
            <Image
                className='absolute inset-0 left-0 right-0 -top-16'
                source={require('./public/assets/login_background.png')}
                contentFit='cover'
            />

            <View
                className='w-full flex justify-center items-center gap-8 mt-2'
            >
                <FontAwesome6
                    name="chess-knight"
                    size={30}
                    iconStyle="solid"
                    color="#0EA5E9"
                />
                <AppTitle
                    showOnlyTitle={false}
                />
            </View>

            <View
                className='flex-1 justify-end w-5/6 items-center pb-10'
            >
                <View className='bg-black/90 w-full rounded-2xl p-6 gap-4'>

                    <View>
                        <Text className='text-white mb-2 font-semibold'>
                            Username
                        </Text>

                        <TextInput
                            className='w-full h-[50px] bg-[#1B2733] text-white rounded-xl px-4 border border-[#344454]'
                            value={username}
                            placeholder="Enter your username"
                            placeholderTextColor="#7D8995"
                            onChangeText={setUsername}
                        />
                    </View>

                    <View>
                        <Text className='text-white mb-2 font-semibold'>
                            Password
                        </Text>

                        <TextInput
                            className='w-full h-[50px] bg-[#1B2733] text-white rounded-xl px-4 border border-[#344454]'
                            value={password}
                            placeholder="Enter your password"
                            placeholderTextColor="#7D8995"
                            secureTextEntry
                            onChangeText={setPassword}
                        />
                    </View>

                    {
                        isRegistering &&
                        <View>
                            <Text className='text-white mb-2 font-semibold'>
                                Chess.com Username
                            </Text>

                            <TextInput
                                className='w-full h-[50px] bg-[#1B2733] text-white rounded-xl px-4 border border-[#344454]'
                                value={chessComUsername}
                                placeholder="Enter your Chess.com username"
                                placeholderTextColor="#7D8995"
                                onChangeText={setChessComUsername}
                            />
                            <Pressable
                                className='w-full h-[50px] bg-[#4D7CFE] rounded-xl justify-center items-center mt-5 mb-2'
                                onPress={async () => {
                                    console.log("Clicked on press")
                                    //make sure all fields are filled in
                                    if (username != "" && password != "" && chessComUsername != "") {
                                        console.log("Inside condition")
                                        const status = await createNewUser(username, password, chessComUsername)

                                        if (status == 200) {
                                            router.navigate('/home')
                                        }
                                    }
                                }}
                            >
                                <Text className='text-white font-bold text-base'>
                                    Sign Up
                                </Text>
                            </Pressable>
                            <Pressable
                                className='w-full h-[50px] border border-[#4D7CFE] rounded-xl justify-center items-center'
                                onPress={() => {
                                    setIsRegistering(false)
                                }}
                            >
                                <Text className='text-[#4D7CFE] font-semibold text-base'>
                                    Login
                                </Text>
                            </Pressable>
                        </View>


                    }
                    {
                        !isRegistering && <View>
                            <Pressable
                                className='w-full h-[50px] bg-[#4D7CFE] rounded-xl justify-center items-center mt-2'
                                onPress={async () => {
                                    console.log("Clicked login button")
                                    const status = await login(username, password)
                                    if (status == 200) {
                                        //set global states
                                        const response = await getUserGames()

                                        const gamesByYearObj: gamesByYear = {
                                            year: new Date().getFullYear(),
                                            games: response
                                        }
                                        //console.log("BEFORE DISPATCH:", store.getState());

                                        dispatch(setGamesByYear(gamesByYearObj))
                                        //console.log("AFTER DISPATCH:", store.getState());

                                        router.navigate('/(tabs)/home')
                                    }
                                }}
                            >
                                <Text className='text-white font-bold text-base'>
                                    Login
                                </Text>
                            </Pressable>
                            <View className='flex-row w-full flex justify-center items-center'>
                                <View className='flex-1 bg-gray-600 h-[1px] mr-2'></View>
                                <Text className='text-white text-center mt-2 mb-2'>Or</Text>
                                <View className='flex-1 bg-gray-600 h-[1px] ml-2'></View>

                            </View>
                            <Pressable
                                className='w-full h-[50px] border border-[#4D7CFE] rounded-xl justify-center items-center'
                                onPress={() => { setIsRegistering(true) }}
                            >
                                <Text className='text-[#4D7CFE] font-semibold text-base'>
                                    Create an account
                                </Text>
                            </Pressable>
                        </View>
                    }

                </View>
            </View>

        </SafeAreaView>
    )
}