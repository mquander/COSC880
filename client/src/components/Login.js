import React from "react";
import '../App.css';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import Alert from '@mui/material/Alert';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import { UserContext } from "../App";
//import { Navigate } from "react-router-dom";


const theme = createTheme();

function Login() {
  const { user, setUser } = useContext(UserContext); console.log(user)
  //const { loggedInUser } = useContext(UserContext); console.log(loggedInUser) , setLoggedInUser
  const navigate = useNavigate();
  const location = useLocation();
  // if(user.loggedIn){
  //   return  (<Navigate to="/" replace  />); //
  // }
//********************** */
  /*const useAuth = () => {
    const { user } = useContext(UserContext);
    return user && user.loggedIn;
  };
  const isAuth = useAuth();
  const ProtectedRoutes = () => {
    const location = useLocation();
    const isAuth = useAuth();
    return isAuth ? (
      <Outlet />
    ) : (
      <Navigate to="/" replace state={{ from: location }} />
    );
  };
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    const userData = new FormData(event.currentTarget);
    var emailPattern=/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if(!emailPattern.test(userData.get('email'))){
      alert("Please enter correct email format");
      return false;
    }
    var paramsObj = {
      email : userData.get('email'),
      password : userData.get('password')
    }
        
    axios.post("/login", {}, {params: paramsObj}).then(res => {
      // if (user){
      //   console.log("user.loggedIn == true")
      //   return;
      // } 
      console.log("user.loggedIn: "+user.loggedIn)
      //console.log(res.data);
      if(res.data.email === paramsObj.email){
        setUser({ loggedIn: true, loggedInUserData: res.data });
        //setLoggedInUser({loggedInUserData: res.data})
        

        //console.log(user);
        return navigate("/", { replace: true })
      }else{
        setUser({ loggedIn: false });
        alert(res.data)
      }
      
      if (location.state?.from) {
        console.log("location.state?.from")
        navigate(location.state.from);
      }
    }).catch(error => {
      console.log("error: ")
      console.log(error)
    })
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs"  sx={{ pt: 2, mt: 2, pb: 20, mb: 8}}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 18,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 , input: { color: 'white' }, label: { color: 'white' } }}>
            <TextField
              sx={{border: 1, borderColor: 'primary' }}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              
            />
            <TextField
              sx={{border: 1, borderColor: 'primary' }}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;