import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance, { injectStore } from '../api/privateApi';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { authenticate, fetchUserInfo } from '../api/UserApi';
import { useNavigate } from 'react-router-dom';
import publicApi from '../api/publicApi';
import axios from 'axios';


interface AuthContextType {
    user: User | null;
    role: Role[] | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<Role>;
    logout: () => void;
    refreshToken: () => Promise<void>;
    setUser: (user: User | null) => void;
    setRole: (role: Role[] | null) => void;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}


export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [refreshTokenState, setRefreshTokenState] = useState<string | null>(null);
    const [role, setRole] = useState<Role[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedRole = localStorage.getItem('role');


        if (storedUser && storedToken && storedRefreshToken && storedRole) {

            setUser(JSON.parse(storedUser) as User);
            setToken(storedToken);
            setRefreshTokenState(storedRefreshToken);
            setRole(JSON.parse(storedRole) as Role[]);

        }
        setLoading(false);

    }, []);

    const login = async (username: string, password: string) => {
        setLoading(true);
        try {
            const response = await authenticate(username, password);
            const Auth = response.result;
            const accessToken = Auth.accessToken.toString();
            const refreshToken = Auth.refreshToken.toString();

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            const userInfo = await fetchUserInfo(accessToken);

            setUser(userInfo.result);
            setToken(accessToken);
            setRefreshTokenState(refreshToken);
            setRole(userInfo.result.roles);


            localStorage.setItem('user', JSON.stringify(userInfo.result));
            localStorage.setItem('role', JSON.stringify(userInfo.result.roles));

            return userInfo.result.roles;
        } catch (error) {
            console.error('Login failed:', error);
        } finally {

            setLoading(false);
        }
    };


    const logout = () => {
        setUser(null);
        setToken(null);
        setRefreshTokenState(null);
        setRole([]);

        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
    };

    const refreshToken = async () => {
        if (!refreshTokenState) throw new Error('No refresh token available');
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}api/v1/accounts/refresh`, { refreshToken: refreshTokenState });
            const newAccessToken = response.data.result.accessToken;
            const newRefreshToken = response.data.result.refreshToken;


            if (response) {

                setToken(newAccessToken);
                localStorage.setItem('accessToken', newAccessToken);
                setRefreshTokenState(newRefreshToken);
                localStorage.setItem('refreshToken', newRefreshToken);
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    };

    useEffect(() => {
        injectStore({ refreshToken });
    }, [refreshToken]);

    return (
        <AuthContext.Provider value={{ user, role, login, logout, loading, refreshToken, setUser, setRole }}>
            {children}
        </AuthContext.Provider>
    );
};
