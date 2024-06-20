import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setRefreshToken, setToken } from "../../../context/AuthenticationService";
import { fetchUserInfo } from "../../../api/UserApi";
import { useAuth } from "../../../context/AuthContext";

export default function Authenticate() {
    const navigate = useNavigate();
    const [isLoggedin, setIsLoggedin] = useState(false);
    const { setUser, setRole } = useAuth();


    useEffect(() => {
        const fetchAuthToken = async (authCode: string) => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/auth/outbound/authenticate?code=${authCode}`, {
                    method: "POST",
                });
                const data = await response.json();
                return data.result;
            } catch (error) {
                console.error("Error fetching auth token:", error);
            }
        };


        const processAuthentication = async () => {
            const authCodeRegex = /code=([^&]+)/;
            const isMatch = window.location.href.match(authCodeRegex);

            if (isMatch) {
                const authCode = isMatch[1];
                const response = await fetchAuthToken(authCode);
                console.log("response ne bro", response)


                if (response) {
                    const accessToken = response.accessToken
                    const refreshToken = response.refreshToken
                    console.log("token ne", accessToken)
                    console.log("refresh token ne", refreshToken)
                    setIsLoggedin(true);
                    setToken(accessToken)
                    setRefreshToken(refreshToken)

                    const userInfoResponse = await fetchUserInfo(accessToken);


                    if (userInfoResponse) {
                        const userInfo = userInfoResponse.result;
                        setUser(userInfo);
                        setRole(userInfo.roles);
                        localStorage.setItem('user', JSON.stringify(userInfo));
                        localStorage.setItem('role', JSON.stringify(userInfo.roles));
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', refreshToken);
                    }
                }
            }
        };

        processAuthentication();
    }, [setUser, setRole]);

    useEffect(() => {
        if (isLoggedin) {
            navigate("/");
        }
    }, [isLoggedin, navigate]);


    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress></CircularProgress>
                <Typography>Authenticating...</Typography>
            </Box>
        </>
    );
}