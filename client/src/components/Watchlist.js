import React from "react";
//import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
// import Link from '@mui/material/Link';
//import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import IconButton from '@mui/material/IconButton';
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
//import { useContext } from "react";
//import { useLocation, useNavigate } from "react-router";
import { UserContext } from "../App";
//import Home from "./Home";
//import { Navigate } from "react-router-dom";


const theme = createTheme();


export default class Watchlist extends React.Component {
 //const [crypto, setCrypto] = useState('');
//  static currentContext = UserContext;
    constructor(props){console.log("in Watchlist constructor")
        super(props)
        this.state = {currentContext: this.context}
        // const { user} = useContext(UserContext); console.log(user)
        // const { loggedInUser } = useContext(UserContext); console.log(loggedInUser)
    }
    componentDidMount(){ console.log("in Watchlist compDidMount")
       // this.context.user.loggedIn = true // change context to user loggedin=true for testing
        this.setState({currentContext : this.context});
        //this.setState({this.context.user.loggedIn : true});
    
    }
    componentDidUpdate(){
        //this.context.user.loggedIn = true // change context to user loggedin=true for testing
        //this.setState({currentContext : this.context});
        //var currentContext = this.context;
    }
    
    render(){ Watchlist.contextType = UserContext; console.log(Watchlist.contextType)
        // this.context.user.loggedIn = true // change context to user loggedin=true for testing
        // this.setState({currentContext : this.context});
        
        //var tempArray1 = ["bitcoin", "litecoin", "etheruem", "ecoin", "dogecoin", "tecoin"];
        //var tempArray2 = ["sp500", "dow", "nasdaq", "vix", "uso", "finance", "tech", "healthcare"]
        var userData;//  = { "_id" : "62d7024b42e5546a1ef500d6", "user_ID" : "230", "fname" : "johanna", "lname" : "squires", "email" : "jts@yahoo.com", "password" : "1234", "watchList" : { "cryptos" : tempArray1, "indexes" : tempArray2 } };  
        //console.log(this.state.currentContext)
        console.log(this.context)
        if((typeof this.context.user) === "undefined"){
            // do nothing 
            return;
            //userData = this.state.currentContext.loggedInUser.loggedInUserData;
        // }else if(typeof this.state.currentContext == "object" && (typeof this.state.currentContext.user == 'undefined')){ 
        //     // do nothing
        //     return;
        }else if(!this.context.user.loggedIn){
            // do nothing 
            return;
        }else if(this.context.user.loggedIn){ console.log(this.context);
            userData = this.context.user.loggedInUserData;//{ "_id" : "62d7024b42e5546a1ef500d6", "user_ID" : "230", "fname" : "johanna", "lname" : "squires", "email" : "jts@yahoo.com", "password" : "1234", "watchList" : { "cryptos" : tempArray1, "indexes" : tempArray2 } }
        }
    console.log(userData)
       return (
        <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <Box
            sx={{border: 1, borderColor: 'primary' ,
                borderRadius: '16px',
                height: 'auto', width: 'auto',
                margin: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
            
            <Typography component="h1" variant="h5">
                Watchlist for {userData.fname}
            </Typography>
            <Grid  container direction="row" spacing={2}>
                {/* <Box component="form"></Box> */}
                
                    <Grid container item xs={'auto'} sm={6}  style={{ fontSize: '18px' }}>
                        Cryptos: &emsp;
                        {userData.watchList.cryptos.map((a,i) =>  //  tempArray1
                            // <li key={i}><Link component="button" onClick={() => {this.props.updateCryptoInput(a)}}>{a}</Link><IconButton><RemoveCircleOutlineIcon size="small" sx={{ color: 'red' }} /></IconButton></li>
                            <li key={i}>{a}</li>
                        )}
                    </Grid>
                    <Grid container direction="column" item xs={'auto'} sm={6}  style={{ fontSize: '18px' }}>
                        Indexes: &emsp;
                        {userData.watchList.indexes.map((a,i) => // tempArray2
                            <li key={i}>{a}</li>
                        )}
                        {/*userData.watchList.indexes*/} 
                        {/* for list items: https://mui.com/material-ui/react-list/ */}
                    </Grid>
                    {/* <Grid container>
                    
                    </Grid> */}
                
            </Grid>
            </Box>
        </Container>
        </ThemeProvider>
  ); 
    }
  
}

//export default Watchlist;