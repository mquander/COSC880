import { NavLink } from "react-router-dom";
import '../index.css';
import '../App.css';
import { UserContext } from "../App";
import { useContext } from "react";
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import InfoIcon from '@mui/icons-material/Info';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';

function NavBar(){
    const { user } = useContext(UserContext); console.log("user in NavBar()"+user.loggedIn)
    return(<div className="navbar">
        <NavLink to="/"> <Button variant="outlined" startIcon={<HomeIcon/>}> Home </Button></NavLink>
        <NavLink to="/login"> <Button variant="outlined" startIcon={<LoginIcon/>}> Login </Button></NavLink>
        <NavLink to="/signup"><Button variant="outlined" startIcon={<PersonAddAlt1Icon/>}> Sign Up </Button></NavLink>
        <NavLink to="/about"><Button variant="outlined" startIcon={<InfoIcon/>}> About </Button></NavLink>
        {user.loggedIn?<NavLink to="/profile"><Button variant="outlined" startIcon={<AccountBoxIcon/>}> Profile </Button></NavLink>:"" }
        {user.loggedIn?<NavLink to="/logout"><Button variant="outlined" startIcon={<LogoutIcon/>}> Log Out </Button></NavLink>:"" }
        {/* <NavLink to="/logout">Log Out</NavLink> */}
        </div>)

}

export default NavBar;