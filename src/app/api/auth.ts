import { getValueFor, save } from '../services/secureStore'
export async function login(
    username: string,
    password: string
) {
    const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/auth/login`
    console.log(`Received username ${username} and password ${password}`)
    console.log(`Used url ${url}`)
    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,

            })
        })

        console.log("Login backend response: " + response)
        const data = await response.text()

        console.log("Status:", response.status)
        console.log("Backend response:", data)

        await save("Access-Token", response.headers.get("X-Access-Token"))
        await save("Refresh-Token", response.headers.get("X-Refresh-Token"))
        return response.status
    } catch (e) {
        console.log("Error logging in ", e)
    }
}

export async function createNewUser(
    username: string,
    password: string,
    email: string,
    chessComUsername: string
) {
    const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/auth/register`

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
                chess_com_username: chessComUsername
            })
        })


        if (response.ok) {
            await save("Access-Token", response.headers.get("X-Access-Token"))
            await save("Refresh-Token", response.headers.get("X-Refresh-Token"))
            return {
                status: 200,
                message: "Registration Successful"
            }
        }

        const response_json = await response.json()


        return {
            status: response?.status,
            message: response_json?.message
        }
    } catch (e) {

        return {
            status: 500,
            message: e
        }
    }

}

export async function confirmUser(token: string) {
    try {
        const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/auth/confirmUser`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: token
            })
        })

        const text = await response.text()
        return {
            isOk: response?.ok,
            status: response.status,
            message: text
        }

    } catch (e) {
        console.log("Error confirming user: " + e)
        return {
            isOk: false,
            status: 500,
            message: e
        }
    }
}

export async function logout(
    username: string
) {
    const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/auth/logout`

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                username: username
            })
        })

        if (response.ok) {
            return true;
        }

        return false
    } catch (e) {
        console.log("Error logging out: " + e)
    }

}

export async function updateInfo(
    username: string | null,
    email: string | null,
    chess_com_username: string | null
) {
    const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/player/update`

    try {
        const accessToken = await getValueFor("Access-Token")
        const refreshToken = await getValueFor("Refresh-Token")

        console.log("UPDATE URL:", url)
        console.log("Access token exists:", !!accessToken)
        console.log("Refresh token exists:", !!refreshToken)

        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Refresh-Token": refreshToken ?? "",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                chess_com_username
            })
        })

        // Inspect the actual response before attempting JSON parsing.
        const responseText = await response.text()

        console.log("UPDATE STATUS:", response.status)
        console.log("UPDATE RESPONSE BODY:", responseText)

        if (!response.ok) {
            throw new Error(
                `Update failed: ${response.status} - ${responseText}`
            )
        }

        const newAccessToken = response.headers.get("X-Access-Token")
        const newRefreshToken = response.headers.get("X-Refresh-Token")

        if (newAccessToken) {
            await save("Access-Token", newAccessToken)
        }

        if (newRefreshToken) {
            await save("Refresh-Token", newRefreshToken)
        }

        return JSON.parse(responseText)

    } catch (e) {
        console.log("Error updating info:", e)
        return false
    }
}

