
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { resetPassword } from "@/app/api/player";
import { AnimatedChessBackground } from "../../components/AnimatedChessBackground";
export default function ResetPassword() {
    const router = useRouter();
    const { token } = useLocalSearchParams<{ token?: string }>();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleResetPassword() {
        if (isLoading) return;

        if (!token) {
            setError("Invalid or missing password reset link.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const response = await resetPassword(token, password)

            if (!response) {
                throw new Error("Password reset failed.");
            }

            setIsSuccess(true);
            router.replace('/')

        } catch (err) {
            console.error("Password reset error:", err);
            setError("Unable to reset password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView
            className="flex-1"
            style={{ backgroundColor: "#061321" }}
        >
            <AnimatedChessBackground />

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
                            <Text className="text-[#38A8FF]">Vision</Text>
                        </Text>

                        <Text className="text-[#B0C5D8] text-sm mt-2">
                            Analyze. Learn. Improve.
                        </Text>
                    </View>

                    {/* Reset Password Card */}
                    <View
                        className="rounded-3xl p-5 my-8"
                        style={{
                            backgroundColor: "rgba(8, 23, 40, 0.92)",
                            borderWidth: 1,
                            borderColor: "#254562",
                        }}
                    >
                        {isSuccess ? (
                            <View className="items-center py-5">
                                <View
                                    className="w-16 h-16 rounded-full items-center justify-center mb-5"
                                    style={{
                                        backgroundColor: "rgba(42, 171, 115, 0.15)",
                                        borderWidth: 1,
                                        borderColor: "#2AAB73",
                                    }}
                                >
                                    <FontAwesome6
                                        name="check"
                                        iconStyle="solid"
                                        size={27}
                                        color="#8CE0B5"
                                    />
                                </View>

                                <Text className="text-white text-xl font-bold mb-2">
                                    Password Updated
                                </Text>

                                <Text className="text-[#91A8BC] text-sm text-center mb-7">
                                    Your password has been reset successfully.
                                    You can now sign in with your new password.
                                </Text>

                                <Pressable
                                    onPress={() => router.replace("/")}
                                    className="h-[52px] w-full rounded-xl items-center justify-center bg-[#287CF0]"
                                >
                                    <Text className="text-white text-base font-bold">
                                        Back to Login
                                    </Text>
                                </Pressable>
                            </View>
                        ) : (
                            <>
                                <View className="items-center mb-6">
                                    <View
                                        className="w-14 h-14 rounded-2xl items-center justify-center mb-4"
                                        style={{
                                            backgroundColor: "rgba(40, 124, 240, 0.15)",
                                        }}
                                    >
                                        <FontAwesome6
                                            name="lock"
                                            iconStyle="solid"
                                            size={24}
                                            color="#60B8FF"
                                        />
                                    </View>

                                    <Text className="text-white text-xl font-bold mb-2">
                                        Reset Your Password
                                    </Text>

                                    <Text className="text-[#91A8BC] text-xs text-center leading-5">
                                        Enter a new password for your ChessVision
                                        account.
                                    </Text>
                                </View>

                                {/* New Password */}
                                <Text className="text-[#D5E5F5] text-sm font-semibold mb-2">
                                    New Password
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
                                        placeholder="Enter new password"
                                        placeholderTextColor="#7893AA"
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        textContentType="newPassword"
                                        value={password}
                                        onChangeText={setPassword}
                                    />

                                    <Pressable
                                        onPress={() => setShowPassword(!showPassword)}
                                        className="px-4 py-3"
                                        accessibilityLabel={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
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

                                {/* Confirm Password */}
                                <Text className="text-[#D5E5F5] text-sm font-semibold mb-2">
                                    Confirm New Password
                                </Text>

                                <View
                                    className="flex-row items-center rounded-xl mb-3"
                                    style={{
                                        backgroundColor: "#152A3D",
                                        borderWidth: 1,
                                        borderColor: "#2B4B65",
                                    }}
                                >
                                    <TextInput
                                        className="flex-1 h-[52px] px-4 text-white"
                                        placeholder="Confirm new password"
                                        placeholderTextColor="#7893AA"
                                        secureTextEntry={!showConfirmPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        textContentType="newPassword"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                    />

                                    <Pressable
                                        onPress={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                        }
                                        className="px-4 py-3"
                                        accessibilityLabel={
                                            showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        <FontAwesome6
                                            name={
                                                showConfirmPassword
                                                    ? "eye-slash"
                                                    : "eye"
                                            }
                                            iconStyle="solid"
                                            size={17}
                                            color="#91A8BC"
                                        />
                                    </Pressable>
                                </View>

                                <Text className="text-[#7893AA] text-xs mb-5">
                                    Password must contain at least 8 characters.
                                </Text>

                                {/* Error */}
                                {!!error && (
                                    <Text className="text-[#FF8E9A] text-xs mb-4">
                                        {error}
                                    </Text>
                                )}

                                {/* Submit */}
                                <Pressable
                                    onPress={handleResetPassword}
                                    disabled={isLoading}
                                    className="h-[52px] rounded-xl items-center justify-center"
                                    style={{
                                        backgroundColor: isLoading
                                            ? "#1C548F"
                                            : "#287CF0",
                                    }}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text className="text-white text-base font-bold">
                                            Reset Password
                                        </Text>
                                    )}
                                </Pressable>

                                {/* Back to Login */}
                                <Pressable
                                    onPress={() => router.replace("/")}
                                    className="items-center mt-5 py-2"
                                >
                                    <Text className="text-[#60B8FF] text-sm font-semibold">
                                        Back to Login
                                    </Text>
                                </Pressable>
                            </>
                        )}
                    </View>

                    {/* Footer */}
                    <Text className="text-[#6D8AA5] text-xs text-center">
                        Study smarter. Play stronger.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
