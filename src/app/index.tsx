
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

import { Alert } from "react-native";
import { createNewUser, login } from "./api/auth";
import { getUserGames } from "./api/games";
import { getChessVisionUserInfo, sendResetEmail } from "./api/player";
import { AnimatedChessBackground } from "./components/AnimatedChessBackground";
import { ChessLoadingScreen } from "./components/ChessLoadingScreen";
import { useAppDispatch } from "./hooks/reduxHooks";
import { setGamesByYear } from "./Store/slices/GamesSlices";
import { setChessVisionUser } from "./Store/slices/PlayerSlice";
import { type gamesByYear } from "./types/responses";
type LoadingState =
    | "idle"
    | "loggingIn"
    | "fetchingGames"
    | "registering"
    | "resettingPassword";

export default function Login() {

    const router = useRouter();
    const dispatch = useAppDispatch();

    const [isRegistering, setIsRegistering] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [chessComUsername, setChessComUsername] = useState("");

    const [loadingState, setLoadingState] =
        useState<LoadingState>("idle");

    const [error, setError] = useState("");
    const [resetSent, setResetSent] = useState(false);
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

            //get the user info

            const chessVisionPlayerInfo = await getChessVisionUserInfo()

            dispatch(setChessVisionUser(chessVisionPlayerInfo))

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

        // Ensure all four registration fields are entered.
        if (!username.trim()) {
            setError("Username is required.");
            return;
        }

        if (!password.trim()) {
            setError("Password is required.");
            return;
        }

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!chessComUsername.trim()) {
            setError("Chess.com username is required.");
            return;
        }

        // Validate email format.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        setError("");
        setLoadingState("registering");

        try {
            const response = await createNewUser(
                username.trim(),
                password,
                email.trim(),
                chessComUsername.trim()
            );


            if (response?.status === 200) {

                //get the user info

                const chessVisionPlayerInfo = await getChessVisionUserInfo()

                dispatch(setChessVisionUser(chessVisionPlayerInfo))

                setLoadingState("fetchingGames");

                const response = await getUserGames();

                const gamesByYearObj: gamesByYear = {
                    year: new Date().getFullYear(),
                    games: response,
                };

                dispatch(setGamesByYear(gamesByYearObj));
                router.replace("/")
            } else if (response?.status == 409) {
                setError("Sorry username is already taken")
            } else {

                Alert.alert(`${response?.message} with status: ${response?.status}`)
                setError(response?.message);
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoadingState("idle");
        }
    }

    async function handleResetPassword() {
        if (isLoading) return;

        const normalizedEmail = email.trim();

        if (!normalizedEmail) {
            setError("Email is required.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            setError("Please enter a valid email address.");
            return;
        }

        setError("");
        setResetSent(false);
        setLoadingState("resettingPassword");

        try {
            const response = sendResetEmail(email)

            setResetSent(true);
        } catch (err) {
            console.error("Password reset request error:", err);
            setError(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setLoadingState("idle");
        }
    }

    function switchToLogin() {
        setIsRegistering(false);
        setIsResettingPassword(false);
        setResetSent(false);
        setError("");
    }

    function switchToRegister() {
        setIsRegistering(true);
        setIsResettingPassword(false);
        setResetSent(false);
        setError("");
    }

    function switchToResetPassword() {
        setIsRegistering(false);
        setIsResettingPassword(true);
        setResetSent(false);
        setError("");
    }

    const loadingMessage =
        loadingState === "loggingIn"
            ? "Signing you in..."
            : loadingState === "fetchingGames"
                ? "Loading your games..."
                : loadingState === "resettingPassword"
                    ? "Sending reset link..."
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
                    behavior={
                        Platform.OS === "ios"
                            ? "padding"
                            : undefined
                    }
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
                                    backgroundColor:
                                        "rgba(20, 76, 123, 0.3)",
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

                        {/* Authentication Form */}
                        <View
                            className="rounded-3xl p-5 my-8"
                            style={{
                                backgroundColor:
                                    "rgba(8, 23, 40, 0.92)",
                                borderWidth: 1,
                                borderColor: "#254562",
                            }}
                        >
                            {/* Form Title */}
                            <Text className="text-white text-xl font-bold mb-1">
                                {isResettingPassword
                                    ? "Reset your password"
                                    : isRegistering
                                        ? "Create an account"
                                        : "Welcome back"}
                            </Text>

                            <Text className="text-[#91A8BC] text-xs mb-4">
                                {isResettingPassword
                                    ? "Enter your email and we'll send you a reset link."
                                    : isRegistering
                                        ? "Start your ChessVision journey"
                                        : "Sign in to continue improving"}
                            </Text>

                            {/* Required Fields Notice */}
                            {isRegistering && (
                                <Text className="text-[#91A8BC] text-xs mb-5">
                                    <Text className="text-[#FF8E9A]">
                                        *
                                    </Text>
                                    {" All fields are required"}
                                </Text>
                            )}

                            {/* Password Reset Form */}
                            {isResettingPassword ? (
                                <>
                                    <Text className="text-[#D5E5F5] text-sm font-semibold mb-2">
                                        Email address
                                    </Text>

                                    <TextInput
                                        className="h-[52px] rounded-xl px-4 text-white mb-4"
                                        style={{
                                            backgroundColor: "#152A3D",
                                            borderWidth: 1,
                                            borderColor: "#2B4B65",
                                        }}
                                        placeholder="Enter your registered email"
                                        placeholderTextColor="#7893AA"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="email-address"
                                        textContentType="emailAddress"
                                        value={email}
                                        onChangeText={setEmail}
                                    />

                                    {resetSent && (
                                        <Text className="text-[#8CE0B5] text-sm mb-4">
                                            If an account exists for this
                                            email, you'll receive a reset
                                            link shortly.
                                        </Text>
                                    )}
                                </>
                            ) : (
                                <>
                                    {/* Username */}
                                    <Text className="text-[#D5E5F5] text-sm font-semibold mb-2">
                                        Username
                                        {isRegistering && (
                                            <Text className="text-[#FF8E9A]">
                                                {" *"}
                                            </Text>
                                        )}
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
                                        {isRegistering && (
                                            <Text className="text-[#FF8E9A]">
                                                {" *"}
                                            </Text>
                                        )}
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
                                            onPress={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                            className="px-4 py-3"
                                            accessibilityLabel={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            <FontAwesome6
                                                name={
                                                    showPassword
                                                        ? "eye-slash"
                                                        : "eye"
                                                }
                                                iconStyle="solid"
                                                size={17}
                                                color="#91A8BC"
                                            />
                                        </Pressable>
                                    </View>

                                    {/* Registration Email */}
                                    {isRegistering && (
                                        <>
                                            <Text className="text-[#D5E5F5] text-sm font-semibold mb-2">
                                                Email
                                                <Text className="text-[#FF8E9A]">
                                                    {" *"}
                                                </Text>
                                            </Text>

                                            <TextInput
                                                className="h-[52px] rounded-xl px-4 text-white mb-4"
                                                style={{
                                                    backgroundColor:
                                                        "#152A3D",
                                                    borderWidth: 1,
                                                    borderColor:
                                                        "#2B4B65",
                                                }}
                                                placeholder="Enter your email"
                                                placeholderTextColor="#7893AA"
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                keyboardType="email-address"
                                                textContentType="emailAddress"
                                                value={email}
                                                onChangeText={setEmail}
                                            />
                                        </>
                                    )}

                                    {/* Chess.com Username */}
                                    {isRegistering && (
                                        <>
                                            <Text className="text-[#D5E5F5] text-sm font-semibold mb-2">
                                                Chess.com Username
                                                <Text className="text-[#FF8E9A]">
                                                    {" *"}
                                                </Text>
                                            </Text>

                                            <TextInput
                                                className="h-[52px] rounded-xl px-4 text-white mb-4"
                                                style={{
                                                    backgroundColor:
                                                        "#152A3D",
                                                    borderWidth: 1,
                                                    borderColor:
                                                        "#2B4B65",
                                                }}
                                                placeholder="Enter your Chess.com username"
                                                placeholderTextColor="#7893AA"
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                value={chessComUsername}
                                                onChangeText={
                                                    setChessComUsername
                                                }
                                            />
                                        </>
                                    )}
                                </>
                            )}

                            {/* Forgot Password */}
                            {!isRegistering &&
                                !isResettingPassword && (
                                    <Pressable
                                        onPress={switchToResetPassword}
                                        className="self-end mb-4"
                                    >
                                        <Text className="text-[#60B8FF] text-sm font-semibold">
                                            Forgot Password?
                                        </Text>
                                    </Pressable>
                                )}

                            {/* Validation/Error Message */}
                            {!!error && (
                                <Text className="text-[#FF8E9A] text-xs mb-4">
                                    {error}
                                </Text>
                            )}

                            {/* Submit Button */}
                            <Pressable
                                onPress={
                                    isResettingPassword
                                        ? handleResetPassword
                                        : isRegistering
                                            ? handleRegister
                                            : handleLogin
                                }
                                className="h-[52px] rounded-xl items-center justify-center mt-2"
                                style={({ pressed }) => ({
                                    backgroundColor: pressed
                                        ? "#1C67D9"
                                        : "#287CF0",
                                })}
                            >
                                <Text className="text-white text-base font-bold">
                                    {isResettingPassword
                                        ? "Send Reset Link"
                                        : isRegistering
                                            ? "Sign Up"
                                            : "Login"}
                                </Text>
                            </Pressable>

                            {/* Switch Login/Register */}
                            {!isResettingPassword && (
                                <>
                                    <View className="flex-row items-center my-5">
                                        <View className="flex-1 h-[1px] bg-[#2B4054]" />

                                        <Text className="text-[#91A8BC] mx-4 text-xs">
                                            OR
                                        </Text>

                                        <View className="flex-1 h-[1px] bg-[#2B4054]" />
                                    </View>

                                    <Pressable
                                        className="h-[52px] rounded-xl items-center justify-center"
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#3489D1",
                                        }}
                                        onPress={
                                            isRegistering
                                                ? switchToLogin
                                                : switchToRegister
                                        }
                                    >
                                        <Text className="text-[#60B8FF] font-semibold">
                                            {isRegistering
                                                ? "Already have an account? Login"
                                                : "Create an account"}
                                        </Text>
                                    </Pressable>
                                </>
                            )}

                            {/* Back to Login */}
                            {isResettingPassword && (
                                <Pressable
                                    className="h-[52px] rounded-xl items-center justify-center mt-4"
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#3489D1",
                                    }}
                                    onPress={switchToLogin}
                                >
                                    <Text className="text-[#60B8FF] font-semibold">
                                        Back to Login
                                    </Text>
                                </Pressable>
                            )}
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
