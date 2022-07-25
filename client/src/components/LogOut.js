// import React from "react";
// import axios from 'axios';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import Link from '@mui/material/Link';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../App";


const LogOut = () => {

    const { user, setUser } = useContext(UserContext); console.log(user)
    //const { loggedInUser } = useContext(UserContext); console.log(loggedInUser) //, setLoggedInUser
    const navigate = useNavigate();
    useEffect(() => {
        setUser({ loggedIn: false , loggedInUserData: {}});
         return navigate("/", { replace: true })
    })
    
    //setLoggedInUser({loggedInUserData: {}})
   
}

export default LogOut;