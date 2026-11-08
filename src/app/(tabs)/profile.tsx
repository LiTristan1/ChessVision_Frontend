
import { useRouter } from "expo-router";
import {
    Check,
    CircleCheck,
    LockKeyhole,
    LogOut,
    Mail,
    Pencil,
    RefreshCw,
    Trash2,
    UserRound,
    X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { containers } from "../../../themes/themes";
import { deleteAccount, sendResetEmail, updateInfo } from "../api/player";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { setChessVisionUser } from "../Store/slices/PlayerSlice";

type UpdatedUser = {
    id: string;
    username: string;
    email: string;
    chess_com_username: string | null;
};

export default function Profile() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const profile = useAppSelector(
        state => state.player.chessVisionUser
    );

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [confirmationUsername, setConfirmationUsername] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState("");
    const [resetEmailStatus, setResetEmailStatus] = useState<
        "idle" | "sending" | "sent" | "error"
    >("idle");

    const [resetEmailError, setResetEmailError] = useState(""); const [editedUsername, setEditedUsername] = useState(
        profile?.username ?? ""
    );
    const [editedEmail, setEditedEmail] = useState(
        profile?.email ?? ""
    );
    const [editedChessUsername, setEditedChessUsername] = useState(
        profile?.chessComUsername ?? ""
    );

    // Synchronize the form with Redux when not editing.
    useEffect(() => {
        if (!isEditing) {
            setEditedUsername(profile?.username ?? "");
            setEditedEmail(profile?.email ?? "");
            setEditedChessUsername(
                profile?.chessComUsername ?? ""
            );
        }
    }, [
        profile?.username,
        profile?.email,
        profile?.chessComUsername,
        isEditing,
    ]);

    const handleEdit = () => {
        setEditedUsername(profile?.username ?? "");
        setEditedEmail(profile?.email ?? "");
        setEditedChessUsername(
            profile?.chessComUsername ?? ""
        );
        setUpdateError("");
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (isUpdating) return;

        setEditedUsername(profile?.username ?? "");
        setEditedEmail(profile?.email ?? "");
        setEditedChessUsername(
            profile?.chessComUsername ?? ""
        );

        setUpdateError("");
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (isUpdating) return;

        const newUsername = editedUsername.trim();
        const newEmail = editedEmail.trim();
        const newChessUsername = editedChessUsername.trim();

        if (!newUsername || !newEmail) {
            setUpdateError(
                "Username and email cannot be empty."
            );
            return;
        }

        setIsUpdating(true);
        setUpdateError("");

        try {
            const response = await updateInfo(
                newUsername ?? null,
                newEmail ?? null,
                newChessUsername ?? null
            );

            console.log("Backend save response: " + JSON.stringify(response))

            if (
                !response ||
                typeof response !== "object" ||
                !response.username ||
                !response.email
            ) {
                throw new Error("Invalid update response");
            }



            // Preserve any other profile fields already in Redux.
            dispatch(
                setChessVisionUser(response)
            );

            setIsEditing(false);
        } catch (e) {
            console.log("Error updating profile:", e);
            setUpdateError(
                "Failed to update profile. Please try again."
            );
        } finally {
            setIsUpdating(false);
        }
    };

    const handleResetPassword = async () => {
        if (resetEmailStatus === "sending") return;

        if (!profile?.email) {
            setResetEmailStatus("error");
            setResetEmailError("No email address is associated with this account.");
            return;
        }

        setResetEmailStatus("sending");
        setResetEmailError("");

        try {
            const response = await sendResetEmail(profile.email);

            // Assumes sendResetEmail throws when the API request fails.
            // If it returns an error value instead, check that here.
            setResetEmailStatus("sent");
        } catch (error) {
            console.error("Failed to send password reset email:", error);

            setResetEmailStatus("error");
            setResetEmailError(
                "We couldn't send your reset email. Please try again."
            );
        }
    };

    const handleDeleteAccount = () => {
        if (isDeleting || !profile?.username) return;
        setConfirmationUsername("");
        setDeleteError("");
        setDeleteModalVisible(true);
    };

    const closeDeleteModal = () => {
        if (isDeleting) return;
        setDeleteModalVisible(false);
        setConfirmationUsername("");
        setDeleteError("");
    };

    const confirmDeleteAccount = async () => {
        if (isDeleting || !profile?.username || confirmationUsername !== profile.username) {
            return;
        }

        setIsDeleting(true);
        setDeleteError("");
        try {
            const success = await deleteAccount();
            if (!success) {
                setDeleteError("We couldn't delete your account. Please try again.");
                return;
            }

            setDeleteModalVisible(false);
            // The logout route must clear local tokens/state without requiring
            // the deleted account to still exist on the server.
            router.replace("/(pages)/loggingOut/logout");
        } catch (error) {
            console.error("Error deleting account:", error);
            setDeleteError("Something went wrong. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleLogout = () => {
        router.navigate("/(pages)/loggingOut/logout");
    };

    return (
        <SafeAreaView
            style={containers.PrimaryContainer}
            className="flex-1"
        >
            <ScrollView
                className="flex-1"
                contentContainerClassName="px-5 pt-6 pb-12"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <Text className="text-white text-3xl font-bold mb-8">
                    Profile
                </Text>

                {/* Profile Header */}
                <View className="bg-[#19283D] rounded-3xl p-5 mb-7 flex-row items-center">
                    <View className="w-16 h-16 rounded-full bg-[#304665] items-center justify-center mr-4">
                        <UserRound
                            size={34}
                            color="#D4E2F7"
                        />
                    </View>

                    <View className="flex-1">
                        <Text
                            className="text-white text-xl font-bold"
                            numberOfLines={1}
                        >
                            {profile?.username || "ChessVision User"}
                        </Text>

                        <Text className="text-[#91A7C6] text-sm mt-1">
                            ChessVision Account
                        </Text>
                    </View>
                </View>

                {/* Account Section Header */}
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-white text-xl font-semibold">
                        Account Information
                    </Text>

                    {!isEditing && (
                        <Pressable
                            onPress={handleEdit}
                            className="flex-row items-center gap-2 px-3 py-2"
                        >
                            <Pencil
                                size={15}
                                color="#93B4F5"
                            />
                            <Text className="text-[#93B4F5] font-medium">
                                Edit
                            </Text>
                        </Pressable>
                    )}
                </View>

                {/* Account Information Card */}
                <View className="bg-[#19283D] rounded-2xl p-5">

                    {/* ChessVision Username */}
                    <View className="mb-5">
                        <Text className="text-[#91A7C6] text-sm mb-2">
                            ChessVision Username
                        </Text>

                        {isEditing ? (
                            <TextInput
                                value={editedUsername}
                                onChangeText={setEditedUsername}
                                editable={!isUpdating}
                                placeholder="Enter username"
                                placeholderTextColor="#7185A3"
                                autoCapitalize="none"
                                autoCorrect={false}
                                className="bg-[#263A55] border border-[#405575] rounded-xl px-4 text-white text-base"
                                style={{
                                    height: 52,
                                    textAlignVertical: "center",
                                    opacity: isUpdating ? 0.6 : 1,
                                }}
                            />
                        ) : (
                            <Text className="text-white text-base font-medium">
                                {profile?.username || "Not set"}
                            </Text>
                        )}
                    </View>

                    <View className="h-[1px] bg-[#30425B] mb-5" />

                    {/* Email */}
                    <View className="mb-5">
                        <Text className="text-[#91A7C6] text-sm mb-2">
                            Email
                        </Text>

                        {isEditing ? (
                            <TextInput
                                value={editedEmail}
                                onChangeText={setEditedEmail}
                                editable={!isUpdating}
                                placeholder="Enter email"
                                placeholderTextColor="#7185A3"
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                className="bg-[#263A55] border border-[#405575] rounded-xl px-4 text-white text-base"
                                style={{
                                    height: 52,
                                    textAlignVertical: "center",
                                    opacity: isUpdating ? 0.6 : 1,
                                }}
                            />
                        ) : (
                            <Text className="text-white text-base font-medium">
                                {profile?.email || "Not set"}
                            </Text>
                        )}
                    </View>

                    <View className="h-[1px] bg-[#30425B] mb-5" />

                    {/* Chess.com Username */}
                    <View>
                        <Text className="text-[#91A7C6] text-sm mb-2">
                            Chess.com Username
                        </Text>

                        {isEditing ? (
                            <TextInput
                                value={editedChessUsername}
                                onChangeText={setEditedChessUsername}
                                editable={!isUpdating}
                                placeholder="Enter Chess.com username"
                                placeholderTextColor="#7185A3"
                                autoCapitalize="none"
                                autoCorrect={false}
                                className="bg-[#263A55] border border-[#405575] rounded-xl px-4 text-white text-base"
                                style={{
                                    height: 52,
                                    textAlignVertical: "center",
                                    opacity: isUpdating ? 0.6 : 1,
                                }}
                            />
                        ) : (
                            <Text className="text-white text-base font-medium">
                                {profile?.chessComUsername || "Not connected"}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Update Error */}
                {updateError !== "" && (
                    <View className="bg-[#34232F] border border-[#54313E] rounded-xl px-4 py-3 mt-4">
                        <Text className="text-[#FF6575] text-sm">
                            {updateError}
                        </Text>
                    </View>
                )}

                {/* Editing Buttons */}
                {isEditing && (
                    <View className="flex-row gap-3 mt-4">
                        <Pressable
                            onPress={handleCancel}
                            disabled={isUpdating}
                            className="flex-1 bg-[#263A55] rounded-xl flex-row items-center justify-center gap-2"
                            style={{
                                height: 52,
                                opacity: isUpdating ? 0.5 : 1,
                            }}
                        >
                            <X size={18} color="#D4E2F7" />
                            <Text className="text-white font-semibold">
                                Cancel
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={handleSave}
                            disabled={isUpdating}
                            className="flex-1 bg-[#4169A8] rounded-xl flex-row items-center justify-center gap-2"
                            style={{
                                height: 52,
                                opacity: isUpdating ? 0.75 : 1,
                            }}
                        >
                            {isUpdating ? (
                                <>
                                    <ActivityIndicator
                                        size="small"
                                        color="#FFFFFF"
                                    />
                                    <Text className="text-white font-semibold">
                                        Saving...
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Check size={18} color="#FFFFFF" />
                                    <Text className="text-white font-semibold">
                                        Save Changes
                                    </Text>
                                </>
                            )}
                        </Pressable>
                    </View>
                )}

                {/* Security Section */}
                <Text className="text-white text-xl font-semibold mt-8 mb-4">
                    Security
                </Text>

                <View className="bg-[#19283D] rounded-2xl p-5">

                    <View className="flex-row items-center">
                        <View className="w-11 h-11 rounded-xl bg-[#263A55] items-center justify-center mr-4">
                            {resetEmailStatus === "sent" ? (
                                <CircleCheck size={23} color="#65D6A0" />
                            ) : (
                                <LockKeyhole size={21} color="#B4C9E9" />
                            )}
                        </View>

                        <View className="flex-1">
                            <Text className="text-white text-base font-semibold">
                                {resetEmailStatus === "sent"
                                    ? "Reset Email Sent"
                                    : "Change Password"}
                            </Text>

                            <Text className="text-[#91A7C6] text-xs mt-1">
                                {resetEmailStatus === "sent"
                                    ? "Check your inbox for the reset link"
                                    : "Securely update your account password"}
                            </Text>
                        </View>
                    </View>

                    {resetEmailStatus === "sent" ? (
                        <View className="mt-5">

                            {/* Success Message */}
                            <View className="bg-[#173B38] border border-[#2E6558] rounded-xl p-4">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <CircleCheck size={17} color="#65D6A0" />

                                    <Text className="text-[#65D6A0] font-semibold">
                                        Email sent successfully
                                    </Text>
                                </View>

                                <Text className="text-[#C4D6D3] text-sm leading-5">
                                    We've sent a password reset link to:
                                </Text>

                                <Text className="text-white font-semibold mt-2">
                                    {profile?.email}
                                </Text>

                                <Text className="text-[#A4C3BA] text-xs mt-3 leading-5">
                                    The link expires in 15 minutes. Check your spam folder
                                    if you don't see the email.
                                </Text>
                            </View>

                            {/* Retry Button */}
                            <Pressable
                                onPress={handleResetPassword}
                                className="flex-row items-center justify-center gap-2 bg-[#263A55] border border-[#405575] rounded-xl mt-4 h-12"
                            >
                                <RefreshCw size={17} color="#B4C9E9" />

                                <Text className="text-[#D4E2F7] font-semibold">
                                    Resend Email
                                </Text>
                            </Pressable>
                        </View>
                    ) : (
                        <View className="mt-5">

                            <Text className="text-[#91A7C6] text-sm leading-5 mb-4">
                                We'll send a secure password reset link to your registered
                                email address.
                            </Text>

                            {/* Email Display */}
                            <View className="flex-row items-center bg-[#263A55] rounded-xl px-4 py-3 mb-4">
                                <Mail size={17} color="#91A7C6" />

                                <Text
                                    className="text-[#D4E2F7] ml-3 flex-1"
                                    numberOfLines={1}
                                >
                                    {profile?.email ?? "No email available"}
                                </Text>
                            </View>

                            {/* Error Message */}
                            {resetEmailStatus === "error" && (
                                <View className="bg-[#34232F] border border-[#54313E] rounded-xl p-3 mb-4">
                                    <Text className="text-[#FF6575] text-sm">
                                        {resetEmailError}
                                    </Text>
                                </View>
                            )}

                            {/* Send Button */}
                            <Pressable
                                onPress={handleResetPassword}
                                disabled={resetEmailStatus === "sending"}
                                className="bg-[#4169A8] rounded-xl h-12 flex-row items-center justify-center gap-2"
                                style={{
                                    opacity: resetEmailStatus === "sending" ? 0.65 : 1,
                                }}
                            >
                                {resetEmailStatus === "sending" ? (
                                    <>
                                        <ActivityIndicator
                                            size="small"
                                            color="#FFFFFF"
                                        />

                                        <Text className="text-white font-semibold">
                                            Sending Email...
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        {resetEmailStatus === "error" ? (
                                            <RefreshCw size={17} color="#FFFFFF" />
                                        ) : (
                                            <Mail size={17} color="#FFFFFF" />
                                        )}

                                        <Text className="text-white font-semibold">
                                            {resetEmailStatus === "error"
                                                ? "Try Again"
                                                : "Send Reset Email"}
                                        </Text>
                                    </>
                                )}
                            </Pressable>
                        </View>
                    )}
                </View>

                {/* Logout */}
                <Pressable
                    onPress={handleLogout}
                    className="bg-[#34232F] border border-[#54313E] rounded-2xl p-5 flex-row items-center mt-6"
                >
                    <LogOut size={21} color="#FF6575" />

                    <Text className="text-[#FF6575] text-base font-semibold ml-4 flex-1">
                        Log Out
                    </Text>

                    <Text className="text-[#FF6575] text-2xl">
                        ›
                    </Text>
                </Pressable>

                {/* Delete Account */}
                <View className="mt-6">
                    <Text className="text-white text-xl font-semibold mb-3">
                        Delete Account
                    </Text>
                    <Text className="text-[#91A7C6] text-sm leading-5 mb-4">
                        Permanently delete your ChessVision account and associated personal data. This action cannot be undone.
                    </Text>
                    <Pressable
                        onPress={handleDeleteAccount}
                        accessibilityRole="button"
                        accessibilityLabel="Delete account"
                        className="bg-[#34232F] border border-[#7D3544] rounded-2xl p-5 flex-row items-center"
                    >
                        <Trash2 size={21} color="#FF6575" />
                        <Text className="text-[#FF6575] text-base font-semibold ml-4 flex-1">
                            Delete My Account
                        </Text>
                        <Text className="text-[#FF6575] text-2xl">›</Text>
                    </Pressable>
                </View>
            </ScrollView>

            <Modal
                visible={deleteModalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeDeleteModal}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    className="flex-1 justify-center bg-black/75 px-5"
                >
                    <View className="bg-[#19283D] border border-[#405575] rounded-3xl p-6">
                        <View className="w-12 h-12 rounded-xl bg-[#34232F] items-center justify-center mb-4">
                            <Trash2 size={24} color="#FF6575" />
                        </View>
                        <Text className="text-white text-xl font-bold mb-3">
                            Permanently Delete Account?
                        </Text>
                        <Text className="text-[#B4C9E9] text-sm leading-5 mb-5">
                            This will permanently delete your ChessVision account and associated personal data. This action cannot be undone.
                        </Text>
                        <Text className="text-[#91A7C6] text-sm mb-2">
                            Type your username to confirm:
                        </Text>
                        <Text className="text-white font-bold text-base mb-3" selectable>
                            {profile?.username}
                        </Text>
                        <TextInput
                            value={confirmationUsername}
                            onChangeText={(value) => {
                                setConfirmationUsername(value);
                                if (deleteError) setDeleteError("");
                            }}
                            placeholder="Enter exact username"
                            placeholderTextColor="#7185A3"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isDeleting}
                            accessibilityLabel="Confirm username for account deletion"
                            className="bg-[#263A55] border border-[#405575] rounded-xl px-4 text-white text-base h-13 mb-4"
                            style={{ height: 52 }}
                        />
                        {deleteError !== "" && (
                            <Text className="text-[#FF6575] text-sm mb-4">
                                {deleteError}
                            </Text>
                        )}
                        <Pressable
                            onPress={confirmDeleteAccount}
                            disabled={isDeleting || !profile?.username || confirmationUsername !== profile.username}
                            accessibilityRole="button"
                            accessibilityLabel="Permanently delete account"
                            className="bg-[#A83F51] rounded-xl h-12 flex-row items-center justify-center gap-2 mb-3"
                            style={{ opacity: isDeleting || !profile?.username || confirmationUsername !== profile.username ? 0.45 : 1 }}
                        >
                            {isDeleting ? <ActivityIndicator color="#FFFFFF" /> : <Trash2 size={18} color="#FFFFFF" />}
                            <Text className="text-white font-semibold">
                                {isDeleting ? "Deleting Account..." : "Permanently Delete Account"}
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={closeDeleteModal}
                            disabled={isDeleting}
                            className="bg-[#263A55] rounded-xl h-12 items-center justify-center"
                            style={{ opacity: isDeleting ? 0.5 : 1 }}
                        >
                            <Text className="text-[#D4E2F7] font-semibold">Cancel</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}
