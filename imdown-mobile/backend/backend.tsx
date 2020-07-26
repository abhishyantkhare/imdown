import AsyncStorage from '@react-native-community/async-storage';

export const BACKEND_URL = "http://localhost:5000/"

export const callBackend = async (endpoint: string, init: RequestInit = { headers: {} }) => {
    const sessionCookie = await AsyncStorage.getItem("sessionCookie")
    init.headers["Cookie"] = sessionCookie

    // You would think that setting credentials to omit would mean we don't
    // send a session cookie. That's what it's supposed to do. There are some
    // bugs with how credentials works for fetch and cookies and react native
    // so we have to set credentials to omit for this to work.
    // TODO: Detach from expo and build a standalone app so we can properly do 
    // cookie management
    init.credentials = "omit"
    return fetch(BACKEND_URL + endpoint, init)
}

