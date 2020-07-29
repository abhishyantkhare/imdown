import AsyncStorage from '@react-native-community/async-storage';
import CookieManager from '@react-native-community/cookies'

export const BACKEND_URL = "http://localhost:5000/"

export const callBackend = async (endpoint: string, init: RequestInit = { headers: {} }) => {
    const sessionCookie = await AsyncStorage.getItem("sessionCookie")
    init.headers["Cookie"] = sessionCookie
    init.credentials = "include"
    // In theory we should only have to clear the cookies after
    // I'm doing it before and after to just be certain the cookies are cleared
    // Honestly screw iOS cookie handling
    await CookieManager.clearAll()
    return fetch(BACKEND_URL + endpoint, init)
}

