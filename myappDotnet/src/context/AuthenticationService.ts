export const KEY_TOKEN = "accessToken";
export const KEY_REFRESHTOKEN = "refreshToken";

export const setToken = (token: string) => {
    localStorage.setItem(KEY_TOKEN, token);
};

export const setRefreshToken = (token: string) => {
    localStorage.setItem(KEY_REFRESHTOKEN, token);
};

export const getToken = () => {
    return localStorage.getItem(KEY_TOKEN);
};

export const removeToken = () => {
    return localStorage.removeItem(KEY_TOKEN);
};