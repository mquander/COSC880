import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { Home, Login, Signup, About } from "./components/Paths"
// import NavBar from './components/NavBar';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode></React.StrictMode>
  
  //
  <div className="index">
    <App/>
  {/* <Router>
    <NavBar/>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/signup" element={<Signup />}/>
      <Route path="/about" element={<About />}/>
    </Routes>
  </Router>   */}
    
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
