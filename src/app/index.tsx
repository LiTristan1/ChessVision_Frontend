
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createNewUser, login } from "./api/auth";
import { getUserGames } from "./api/games";
import { AnimatedChessBackground } from "./components/AnimatedChessBackground";
import { ChessLoadingScreen } from "./components/ChessLoadingScreen";
import { useAppDispatch } from "./hooks/reduxHooks";
import { setGamesByYear } from "./Store/slices/GamesSlices";
import { setChessVisionUserName } from "./Store/slices/PlayerSlice";
import { type gamesByYear } from "./types/responses";

type LoadingState =
    | "idle"
    | "loggingIn"
    | "fetchingGames"
    | "registering";

export default function Login() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [isRegistering, setIsRegistering] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [chessComUsername, setChessComUsername] = useState("");

    const [loadingState, setLoadingState] =
        useState<LoadingState>("idle");

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const isLoading = loadingState !== "idle";

    async function handleLogin() {
        if (isLoading) return;

        if (!username.trim() || !password) {
            setError("Please enter your username and password.");
            return;
        }

        setError("");
        setLoadingState("loggingIn");

        try {
            const status = await login(username.trim(), password);

            if (status !== 200) {
                setError("Login failed. Please check your credentials.");
                return;
            }

            dispatch(setChessVisionUserName(username.trim()));

            setLoadingState("fetchingGames");

            const response = await getUserGames();

            const gamesByYearObj: gamesByYear = {
                year: new Date().getFullYear(),
                games: response,
            };

            dispatch(setGamesByYear(gamesByYearObj));

            router.replace("/(tabs)/home");
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoadingState("idle");
        }
    }

    async function handleRegister() {
        if (isLoading) return;

        if (
            !username.trim() ||
            !password ||
            !chessComUsername.trim()
        ) {
            setError("Please fill in all fields.");
            return;
        }

        setError("");
        setLoadingState("registering");

        try {
            const status = await createNewUser(
                username.trim(),
                password,
                chessComUsername.trim()
            );

            if (status === 200) {
                // Preserves your existing registration destination.
                router.navigate("/home");
            } else {
                setError("Unable to create account. Please try again.");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoadingState("idle");
        }
    }

    const loadingMessage =
        loadingState === "loggingIn"
            ? "Signing you in..."
            : loadingState === "fetchingGames"
                ? "Loading your games..."
                : "Creating your account...";

    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: "#061321" }}
        >
            <AnimatedChessBackground />

            {isLoading ? (
                <ChessLoadingScreen message={loadingMessage} />
            ) : (
                <KeyboardAvoidingView
                    className="flex-1"
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <ScrollView
                        className="flex-1"
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingHorizontal: 24,
                            paddingTop: 48,
                            paddingBottom: 32,
                            justifyContent: "space-between",
                        }}
                    >
                        {/* Branding */}
                        <View className="items-center mt-8">
                            <View
                                className="w-20 h-20 rounded-3xl items-center justify-center mb-5"
                                style={{
                                    backgroundColor: "rgba(20, 76, 123, 0.3)",
                                    borderWidth: 1,
                                    borderColor: "#25547A",
                                }}
                            >
                                <FontAwesome6
                                    name="chess-knight"
                                    iconStyle="solid"
                                    size={42}
                                    color="#A9D7FF"
                                />
                            </View>

                            <Text className="text-white text-[34px] font-bold">
                                Chess
                                <Text className="text-[#38A8FF]">
                                    Vision
                                </Text>
                            </Text>

                            <Text className="text-[#B0C5D8] text-sm mt-2">
                                Analyze. Learn. Improve.
                            </Text>
                        </View>

                        {/* Form */}
                        <View
                            className="rounded-3xl p-5 my-8"
                            style={{
                                backgroundColor: "rgba(8, 23, 40, 0.92)",
                                borderWidth: 1,
                                borderColor: "#254562",
                            }}
                        >
                            <Text className="text-white text-xl font-bold mb-1">
                                {isRegistering
                                    ? "Create an account"
                                    : "Welcome back"}
                            </Text>

                            <Text className="text-[#91A8BC] text-xs mb-6">
                                {isRegistering
                                    ? "Start your ChessVision journey"
                                    : "Sign in to continue improving"}
                            </Text>

                            {/* Username */}
                            <Text className="text-[#D5E5F5] text-sm font-semibold mb-2">
                                Username
                            </Text>

                            <TextInput
                                className="h-[52px] rounded-xl px-4 text-white mb-4"
                                style={{
                                    backgroundColor: "#152A3D",
                                    borderWidth: 1,
                                    borderColor: "#2B4B65",
                                }}
                                placeholder="Enter your username"
                                placeholderTextColor="#7893AA"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={username}
                                onChangeText={setUsername}
                            />

                            {/* Password */}
                            <Text className="text-[#D5E5F5] text-sm font-semibold mb-2">
                                Password
                            </Text>

                            <View
                                className="flex-row items-center rounded-xl mb-4"
                                style={{
                                    backgroundColor: "#152A3D",
                                    borderWidth: 1,
                                    borderColor: "#2B4B65",
                                }}
                            >
                                <TextInput
                                    className="flex-1 h-[52px] px-4 text-white"
                                    placeholder="Enter your password"
                                    placeholderTextColor="#7893AA"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />

                                <Pressable
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="px-4 py-3"
                                    accessibilityLabel={
                                        showPassword ? "Hide password" : "Show password"
                                    }
                                >
                                    <FontAwesome6
                                        name={showPassword ? "eye-slash" : "eye"}
                                        iconStyle="solid"
                                        size={17}
                                        color="#91A8BC"
                                    />
                                </Pressable>
                            </View>

                            {/* Chess.com Username */}
                            {isRegistering && (
                                <>
                                    <Text className="text-[#D5E5F5] text-sm font-semibold mb-2">
                                        Chess.com Username
                                    </Text>

                                    <TextInput
                                        className="h-[52px] rounded-xl px-4 text-white mb-4"
                                        style={{
                                            backgroundColor: "#152A3D",
                                            borderWidth: 1,
                                            borderColor: "#2B4B65",
                                        }}
                                        placeholder="Enter your Chess.com username"
                                        placeholderTextColor="#7893AA"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        value={chessComUsername}
                                        onChangeText={setChessComUsername}
                                    />
                                </>
                            )}

                            {/* Error */}
                            {!!error && (
                                <Text className="text-[#FF8E9A] text-xs mb-4">
                                    {error}
                                </Text>
                            )}

                            {/* Submit */}
                            <Pressable
                                onPress={
                                    isRegistering ? handleRegister : handleLogin
                                }
                                className="h-[52px] rounded-xl items-center justify-center mt-2"
                                style={({ pressed }) => ({
                                    backgroundColor: pressed
                                        ? "#1C67D9"
                                        : "#287CF0",
                                })}
                            >
                                <Text className="text-white text-base font-bold">
                                    {isRegistering ? "Sign Up" : "Login"}
                                </Text>
                            </Pressable>

                            {/* Divider */}
                            <View className="flex-row items-center my-5">
                                <View className="flex-1 h-[1px] bg-[#2B4054]" />

                                <Text className="text-[#91A8BC] mx-4 text-xs">
                                    OR
                                </Text>

                                <View className="flex-1 h-[1px] bg-[#2B4054]" />
                            </View>

                            {/* Switch Mode */}
                            <Pressable
                                className="h-[52px] rounded-xl items-center justify-center"
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#3489D1",
                                }}
                                onPress={() => {
                                    setIsRegistering(!isRegistering);
                                    setError("");
                                }}
                            >
                                <Text className="text-[#60B8FF] font-semibold">
                                    {isRegistering
                                        ? "Already have an account? Login"
                                        : "Create an account"}
                                </Text>
                            </Pressable>
                        </View>

                        {/* Footer */}
                        <Text className="text-[#6D8AA5] text-xs text-center">
                            Study smarter. Play stronger.
                        </Text>
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
        </SafeAreaView>
    );
}
