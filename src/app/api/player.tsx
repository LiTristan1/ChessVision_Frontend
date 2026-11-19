import { getValueFor, save } from "../services/secureStore";
import { ChessVisionUser, FullProfileResponse } from "../types/responses";


export async function getPlayerProfile() {
    const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/player`
    const accessToken = await getValueFor("Access-Token");
    const refreshToken = await getValueFor("Refresh-Token");
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Refresh-Token": refreshToken ?? ""
            }
        })

        const response_json = await response.json()
        await save("Access-Token", response.headers.get("X-Access-Token"))
        await save("Refresh-Token", response.headers.get("X-Refresh-Token"))

        console.log("Player profile response: " + JSON.stringify(response_json))
    } catch (e) {
        console.log("Error getting player profile: " + e)
    }
}

export async function getChessVisionUserInfo() {
    const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/player/chessVisionInfo`
    const accessToken = await getValueFor("Access-Token");
    const refreshToken = await getValueFor("Refresh-Token");
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Refresh-Token": refreshToken ?? ""
            }
        })

        const response_json: ChessVisionUser = await response.json()
        console.log("Chess Vision User Info response: " + JSON.stringify(response_json))
        await save("Access-Token", response.headers.get("X-Access-Token"))
        await save("Refresh-Token", response.headers.get("X-Refresh-Token"))

        return response_json
    } catch (e) {
        console.log("Error getting chess vision user info: " + e)
    }
}


export async function getPlayerStats() {
    const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/player/stats`
    const accessToken = await getValueFor("Access-Token");
    const refreshToken = await getValueFor("Refresh-Token");

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Refresh-Token": refreshToken ?? ""
            }
        })

        const response_json = await response.json()
        await save("Access-Token", response.headers.get("X-Access-Token"))
        await save("Refresh-Token", response.headers.get("X-Refresh-Token"))


        console.log("Player stats response: " + JSON.stringify(response_json))
    } catch (e) {
        console.log("Error getting player stats: " + e)
    }
}

export async function getFullProfile(): Promise<FullProfileResponse | null | undefined> {
    const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/player/fullProfile`
    console.log("Used profile url: " + url)
    const accessToken = await getValueFor("Access-Token");
    const refreshToken = await getValueFor("Refresh-Token");

    console.log("Getting full profile")
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Refresh-Token": refreshToken ?? ""
            }
        })

        const response_json = await response.json()
        console.log("Player stats response: " + JSON.stringify(response_json))
        await save("Access-Token", response.headers.get("X-Access-Token"))
        await save("Refresh-Token", response.headers.get("X-Refresh-Token"))


        return response_json
    } catch (e) {
        console.log("Error getting player stats: " + e)
    }
}

export async function sendResetEmail(email: string | null) {
    if (!email) {
        return null;
    }
    const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/auth/sendResetPasswordLink`

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email
            })
        })

        await save("Access-Token", response.headers.get("X-Access-Token"))
        await save("Refresh-Token", response.headers.get("X-Refresh-Token"))



        if (!response.ok) {
            return false
        }



        return true
    } catch (e) {
        console.log("Error sending reset password email")
        return false
    }


}
export async function resetPassword(token: string, newPassword: string) {


    const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/auth/resetPassword`

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: token,
                newPassword: newPassword
            })
        })


        if (!response.ok) {
            console.log("Response was not ok resetting password")

            return false
        }



        return true;
    } catch (e) {
        console.log("Error sending reset password email")
        return false
    }

}

export async function updateInfo(
    username: string | null,
    email: string | null,
    chess_com_username: string | null
) {
    const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/player/update`
    const accessToken = await getValueFor("Access-Token");
    const refreshToken = await getValueFor("Refresh-Token");

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Refresh-Token": refreshToken ?? "",
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                username: username,
                email: email,
                chess_com_username: chess_com_username
            })
        })
        if (!response.ok) {
            throw new Error(`Update failed: ${response.status}`)
        }
        await save("Access-Token", response.headers.get("X-Access-Token"))
        await save("Refresh-Token", response.headers.get("X-Refresh-Token"))

        const response_json = await response.json()

        return response_json

    } catch (e) {
        console.log("Error updating info: " + e)
        return false
    }

}

export async function deleteAccount(

) {
    const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/player/account`
    const accessToken = await getValueFor("Access-Token");
    const refreshToken = await getValueFor("Refresh-Token");

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Refresh-Token": refreshToken ?? "",
                "Content-Type": "application/json"
            }
        })

        if (response.ok) {
            return true;
        }
        return false
    } catch (e) {
        console.log("Error deleting account: " + e)
        return false
    }
}