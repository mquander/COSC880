import React from "react";
//import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
//import TextField from '@mui/material/TextField';
//import Link from '@mui/material/Link';
//import IconButton from '@mui/material/IconButton';
//import RemoveIcon from '@mui/icons-material/Remove';
//import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useContext} from "react"; //, useEffect 
import {  useNavigate } from "react-router";
import { UserContext } from "../App";
//import { Navigate } from "react-router-dom";


const theme = createTheme();
var userData;  
function Profile() {
  const { user} = useContext(UserContext); console.log(user) //, setUser
  //const { loggedInUser } = useContext(UserContext); console.log(loggedInUser)
//   const navigate = useNavigate();
//   const location = useLocation();
  const navigate = useNavigate();

//   useEffect(() => {
//     if(user.loggedIn){
//       userData = user.loggedInUserData;
//     }else{
//       //setUser({ loggedIn: false , loggedInUserData: {}});
//       console.log("in useEffect false Profile")
//       return navigate("/login", { replace: true })
//     }
    
// })

  if(user.loggedIn){
      userData = user.loggedInUserData;
  }else{
    console.log("in useEffect false Profile")
     return  navigate("/login")
  }
  console.log(userData)

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
          <Typography component="h1" variant="h5">
            Profile
          </Typography>
          <Box component="form" sx={{ mt: 3 }}>
            <Typography sx={{border: 1, borderColor: 'primary' }}
              textAlign="left"
              margin="normal"
              required
              fullwidth="true">
              First Name: {userData.fname}                           
            </Typography>
            <Typography sx={{border: 1, borderColor: 'primary' }}
              textAlign="left"
              margin="normal"
              required
              fullwidth="true">
              Last Name: {userData.lname}                         
            </Typography>
            <Typography sx={{border: 1, borderColor: 'primary' }}
              textAlign="left"
              margin="normal"
              required
              fullwidth="true">
              Email: {userData.email}                            
            </Typography>
            <Typography sx={{border: 1, borderColor: 'primary' }}
              textAlign="left"
              margin="normal"
              required
              fullwidth="true">
              Watchlist <br/>Cryptos: {userData.watchList.cryptos.map((a,i) =>  //  tempArray1
                            //<li key={i}> {a}<IconButton><RemoveCircleOutlineIcon size="small" sx={{ color: 'red' }} onClick={() => {userData.watchList.cryptos.splice(i,1); setUser({loggedInUserData: userData})}}/></IconButton></li>
                        <li key={i}>{a}</li>
                        )}  
              
              <br/>Indexes: {userData.watchList.indexes.map((a,i) =>  //  tempArray1
                            //<li key={i}> {a}<IconButton><RemoveCircleOutlineIcon size="small" sx={{ color: 'red' }} onClick={() => {userData.watchList.indexes.splice(i,1); setUser({loggedInUserData: userData})}}/></IconButton></li>
                            <li key={i}>{a}</li>
                        )}                          
            </Typography>
            
            <Grid container>
              
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Profile;