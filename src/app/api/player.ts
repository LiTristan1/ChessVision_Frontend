import { getValueFor } from "../services/secureStore";
import { FullProfileResponse } from "../types/responses";
export async function getPlayerProfile() {
    const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/player$`
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
        console.log("Player profile response: " + JSON.stringify(response_json))
    } catch (e) {
        console.log("Error getting player profile: " + e)
    }
}

export async function getPlayerStats() {
    const url = `${process.env.EXPO_PUBLIC_REST_BASE_URL}/player/stats$`
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

        return response_json
    } catch (e) {
        console.log("Error getting player stats: " + e)
    }
}