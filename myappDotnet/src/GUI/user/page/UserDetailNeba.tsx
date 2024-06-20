import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Card, CircularProgress, Typography } from "@mui/material";
import { getToken } from '../../../context/AuthenticationService';

interface UserDetails {
    picture?: string;
    given_name?: string;
    name?: string;
    email?: string;
}
function UserDetailNeba() {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

    const getUserDetails = async (accessToken: string) => {
        const response = await fetch(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
        );
        const data = await response.json();
        console.log(data)

        setUserDetails(data);
    };

    useEffect(() => {
        const accessToken = getToken();

        if (!accessToken) {
            navigate("/login");
        } else {
            getUserDetails(accessToken);
        }
    }, [navigate]);

    return (
        <>

            {userDetails ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="100vh"
                    bgcolor={"#f0f2f5"}
                >
                    <Card
                        sx={{
                            minWidth: 400,
                            maxWidth: 500,
                            boxShadow: 4,
                            borderRadius: 4,
                            padding: 4,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: "100%", // Ensure content takes full width
                            }}
                        >
                            <img
                                src={userDetails.picture}
                                alt={`${userDetails.given_name}'s profile`}
                                className="profile-pic"
                            />
                            <p>Welcome back to Devteria,</p>
                            <h1 className="name">{userDetails.name}</h1>
                            <p className="email">{userDetails.email}</p>{" "}
                        </Box>
                    </Card>
                </Box>
            ) : (
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
                    <Typography>Loading ...</Typography>
                </Box>
            )}
        </>
    );
}

export default UserDetailNeba