import { save } from '../services/secureStore'
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
                chess_com_username: chessComUsername
            })
        })

        console.log("Backend response", JSON.stringify(response))
        return response.status
    } catch (e) {
        console.log("Error registering new user")
    }

}