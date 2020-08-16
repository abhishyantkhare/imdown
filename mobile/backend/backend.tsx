import AsyncStorage from '@react-native-community/async-storage';
import CookieManager from '@react-native-community/cookies'

// If you're testing on a real device and
// want to connect to your local backend
// Download ngrok (https://dashboard.ngrok.com/get-started/setup)
// Put the generated url here
// export const BACKEND_URL = NGROK_URL
export const BACKEND_URL = __DEV__ ? "http://localhost:5000/" : "https://app.imhelladown.com/"

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

