import React from "react";
import '../App.css';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useContext, useState } from "react";
import {  useNavigate } from "react-router";
import { UserContext } from "../App";
//import { Navigate } from "react-router-dom";

const theme = createTheme();

function SignUp() {
  const { user, setUser } = useContext(UserContext); console.log(user)
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState("");
  const [value4, setValue4] = useState("");
  const [value5, setValue5] = useState("");
  const navigate = useNavigate();
  // const location = useLocation();
  // if(user.loggedIn){
  //   return  (<Navigate to="/" replace  />); //
  // }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const userData = new FormData(event.currentTarget);
    var emailPattern=/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    var charPattern = /[A-Za-z]/;

    if(!charPattern.test(userData.get('firstName'))){
      alert("Please check first name entered");
      return false;
    }else if(!charPattern.test(userData.get('lastName'))){
      alert("Please check last name entered");
      return false;
    }
    
    if(!emailPattern.test(userData.get('email'))){
      alert("Please enter correct email format");
      return false;
    }
    if(userData.get('password1') !== userData.get('password2')){
      alert("Passwords to not match");
      return false;
    }
    
    var paramsObj = {
      firstName: userData.get('firstName'),
      lastName: userData.get('lastName'),
      email : userData.get('email'),
      password : userData.get('password1'),
      // password2 : userData.get('password2') only 1 password needed, change in server.js too
    }
    console.log(paramsObj);
    /* NEED TO VALIDATE MATCHING PASSWORDS */
    axios.post("/signup", {}, {params: paramsObj}).then(res => {
      console.log("signed up: ")
      console.log(res)
      if(res.status < 400){
        //setUser({ loggedIn: true });
        //console.log(user);
        alert("Successfully created account")
        return navigate("/login", { replace: true })// (<Navigate to="/login" replace  />);
      }
    }).catch(error => {
      setUser({ loggedIn: false });
      console.log("error: ")
      console.log(error.response.data)
      alert(error.response.data)
      setValue('')
      setValue2('')
      setValue3('')
      setValue4('')
      setValue5('')
    })
  };

  // const validatePAssword = (event) => {

  // }
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" sx={{ pt: 8, pb: 6 }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 , input: { color: 'white' }, label: { color: 'white' } }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} >
                <TextField 
                  onChange={(newValue) => {
                    setValue(newValue.target.value);
                  }}
                  sx={{border: 1, borderColor: 'primary', input: {invalid: {border: "2px red"} }}}
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={value}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  onChange={(newValue) => {
                    setValue2(newValue.target.value);
                  }}
                  sx={{border: 1, borderColor: 'primary' }}
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={value2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(newValue) => {
                    setValue3(newValue.target.value);
                  }}
                  sx={{border: 1, borderColor: 'primary' }}
                  required
                  fullWidth
                  id="email"
                  type="email"
                  label="Email Address"
                  name="email"
                  pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"
                  autoComplete="email"
                  value={value3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(newValue) => {
                    setValue4(newValue.target.value);
                  }}
                  sx={{border: 1, borderColor: 'primary' }}
                  required
                  fullWidth
                  minLength="4"
                  name="password1"
                  label="Password"
                  type="password"
                  id="password1"
                  autoComplete="new-password1"
                  value={value4}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(newValue) => {
                    setValue5(newValue.target.value);
                  }}
                  sx={{border: 1, borderColor: 'primary' }}
                  required
                  fullWidth
                  minLength="4"
                  name="password2"
                  label="Re-enter Password"
                  type="password"
                  id="password2"
                  autoComplete="new-password2"
                  value={value5}
                />
              </Grid>
               <Grid item xs={12}>
                {/*<FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />*/}
              </Grid> 
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;
