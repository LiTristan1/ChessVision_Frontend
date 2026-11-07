
import { confirmUser } from "@/app/api/auth";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Check,
    CircleCheck,
    CircleX,
    Mail,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Easing,
    Pressable,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { containers } from "../../../../themes/themes";
type VerificationStatus = "loading" | "success" | "error";

export default function EmailActivation() {
    const router = useRouter();
    const { token } = useLocalSearchParams<{ token?: string }>();

    const [status, setStatus] =
        useState<VerificationStatus>("loading");
    const [errorMessage, setErrorMessage] = useState("");

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
        }).start();

        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.07,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();

        return () => animation.stop();
    }, [fadeAnim, pulseAnim]);

    useEffect(() => {
        const controller = new AbortController();

        async function verifyEmail() {
            if (!token) {
                setErrorMessage("The verification link is missing a token.");
                setStatus("error");
                return;
            }

            try {
                const response = await confirmUser(token);

                if (!response.isOk) {
                    throw new Error(`${response?.message}`)
                }

                setStatus("success");
            } catch (error) {
                if (controller.signal.aborted) return;
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred."
                );
                setStatus("error");
            }
        }

        verifyEmail();

        return () => controller.abort();
    }, [token]);

    const isLoading = status === "loading";
    const isSuccess = status === "success";

    return (
        <View style={containers.PrimaryContainer}>
            <LinearGradient
                colors={["#102442", "#0B1423", "#0B1423"]}
                locations={[0, 0.55, 1]}
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                }}
            />

            {/* Background glow */}
            <View
                pointerEvents="none"
                style={{
                    position: "absolute",
                    top: "19%",
                    alignSelf: "center",
                    width: 290,
                    height: 290,
                    borderRadius: 145,
                    backgroundColor: "#234D87",
                    opacity: 0.13,
                }}
            />

            <SafeAreaView style={{ flex: 1, width: "100%" }}>
                <Animated.View
                    style={{
                        flex: 1,
                        width: "100%",
                        alignItems: "center",
                        paddingHorizontal: 28,
                        opacity: fadeAnim,
                    }}
                >
                    {/* Logo */}
                    <View className="mt-16 items-center">
                        <Text className="text-white text-[31px] font-bold tracking-tight">
                            ChessVision
                        </Text>
                        <Text className="text-[#8FA9CC] text-[11px] tracking-[3px] mt-2">
                            ACCOUNT VERIFICATION
                        </Text>
                    </View>

                    {/* Main content */}
                    <View className="flex-1 justify-center items-center w-full pb-24">
                        <Animated.View
                            style={{
                                transform: [{ scale: pulseAnim }],
                            }}
                            className="mb-12"
                        >
                            <LinearGradient
                                colors={["#DCEAFF", "#79B4F3"]}
                                style={{
                                    width: 132,
                                    height: 132,
                                    borderRadius: 32,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    shadowColor: "#589BEB",
                                    shadowOpacity: 0.25,
                                    shadowRadius: 28,
                                    elevation: 8,
                                }}
                            >
                                {isSuccess ? (
                                    <CircleCheck
                                        size={74}
                                        color="#173E6E"
                                        strokeWidth={1.8}
                                    />
                                ) : status === "error" ? (
                                    <CircleX
                                        size={74}
                                        color="#A63849"
                                        strokeWidth={1.8}
                                    />
                                ) : (
                                    <View>
                                        <Mail
                                            size={76}
                                            color="#173E6E"
                                            strokeWidth={1.5}
                                        />
                                        <View
                                            className="absolute -bottom-2 -right-3 bg-[#B8DBFF] rounded-full p-1.5"
                                        >
                                            <Check
                                                size={24}
                                                color="#173E6E"
                                                strokeWidth={3}
                                            />
                                        </View>
                                    </View>
                                )}
                            </LinearGradient>
                        </Animated.View>

                        <Text className="text-white text-[27px] font-bold text-center mb-5">
                            {isLoading
                                ? "Activating Your Account"
                                : isSuccess
                                    ? "Account Activated!"
                                    : "Verification Failed"}
                        </Text>

                        <Text className="text-[#B7C9E2] text-[15px] leading-7 text-center max-w-[320px]">
                            {isLoading
                                ? "Please wait while we verify your email and set up your ChessVision account."
                                : isSuccess
                                    ? "Your email has been verified successfully. You're ready to begin your ChessVision journey."
                                    : errorMessage}
                        </Text>

                        {/* Loading */}
                        {isLoading && (
                            <View className="items-center mt-12">
                                <ActivityIndicator
                                    size="large"
                                    color="#8BBEFF"
                                />
                                <Text className="text-[#DCE8FA] text-[14px] mt-5">
                                    Verifying email...
                                </Text>
                            </View>
                        )}

                        {/* Success */}
                        {isSuccess && (
                            <Pressable
                                onPress={() => router.replace("/")}
                                className="mt-12 w-full bg-[#4169A8] rounded-xl py-4 items-center active:opacity-80"
                            >
                                <Text className="text-white text-[16px] font-semibold">
                                    Continue to Login
                                </Text>
                            </Pressable>
                        )}

                        {/* Failure */}
                        {status === "error" && (
                            <Pressable
                                onPress={() => router.replace("/")}
                                className="mt-12 w-full bg-[#4169A8] rounded-xl py-4 items-center active:opacity-80"
                            >
                                <Text className="text-white text-[16px] font-semibold">
                                    Back to Login
                                </Text>
                            </Pressable>
                        )}
                    </View>

                    {/* Footer */}
                    <View className="absolute bottom-12 items-center">
                        <Text className="text-[#617D9F] text-[12px] tracking-widest">
                            CHESSVISION
                        </Text>
                        <Text className="text-[#526B89] text-[11px] mt-2">
                            Your next move starts here.
                        </Text>
                    </View>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}
