import { NavLink } from "react-router-dom";
import '../index.css';
import { UserContext } from "../App";
import { useContext } from "react";

function NavBar(){
    const { user } = useContext(UserContext); console.log("user in NavBar()"+user.loggedIn)
    return(<div className="navbar">
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
        <NavLink to="/about">About</NavLink>
        {user.loggedIn?<NavLink to="/profile">Profile</NavLink>:"" }
        {user.loggedIn?<NavLink to="/logout">Log Out</NavLink>:"" }
        {/* <NavLink to="/logout">Log Out</NavLink> */}
        </div>)

}

export default NavBar;