import { getValueFor, save } from '../services/secureStore'
export async function login(
    username: string,
    password: string
) {
    const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/auth/login`
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

        if (response.ok) {
            const accessToken = response.headers.get("X-Access-Token");
            const refreshToken = response.headers.get("X-Refresh-Token");

            if (accessToken) {
                await save("Access-Token", accessToken);
            }

            if (refreshToken) {
                await save("Refresh-Token", refreshToken);
            }
        }

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
    const baseUrl = process.env.EXPO_PUBLIC_REST_BASE_URL;

    if (!baseUrl) {
        console.error("Missing EXPO_PUBLIC_REST_BASE_URL");
        return {
            status: 500,
            message: "Backend URL is not configured"
        };
    }

    const url = `${baseUrl.replace(/\/$/, "")}/auth/register`;
    try {
        console.log("Register request starting:", url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password,
                email,
                chess_com_username: chessComUsername
            })
        });

        console.log("Register response status:", response.status);

        if (response.ok) {
            const accessToken = response.headers.get("X-Access-Token");
            const refreshToken = response.headers.get("X-Refresh-Token");

            if (accessToken) {
                await save("Access-Token", accessToken);
            }

            if (refreshToken) {
                await save("Refresh-Token", refreshToken);
            }

            return {
                status: response.status,
                message: "Registration Successful"
            };
        }

        const responseText = await response.text();
        console.log("Registration failed:", response.status);

        let message = "Registration failed";

        try {
            message = JSON.parse(responseText).message ?? message;
        } catch {
            // Backend may return plain text instead of JSON.
        }

        return {
            status: response.status,
            message
        };

    } catch (error) {
        console.error("Registration request error:", error);

        return {
            status: 500,
            message: "Unable to complete registration"
        };
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

