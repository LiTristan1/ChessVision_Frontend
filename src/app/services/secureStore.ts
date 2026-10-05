import * as SecureStore from 'expo-secure-store';

export async function save(key: string, value: string | null) {
    if (value == null) {
        console.log("null value")
        return;
    }
    await SecureStore.setItemAsync(key, value)
}

export async function getValueFor(key: string): Promise<string | null> {
    let result = await SecureStore.getItem(key)

    if (!result) {
        console.log("Not found")
    }
    return result
}