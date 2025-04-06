import React,{useEffect, useState} from "react";
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router';


function SideNavBar() {

    const[isLogged, setIsLogged] = useState(sessionStorage.getItem("isLogged"));
    const[token, setToken] = useState(sessionStorage.getItem("token"));
    const[username, setUserName] = useState(sessionStorage.getItem("username"));
    const[name, setName] = useState(sessionStorage.getItem("name"));
    const[userId, setUserId] = useState(sessionStorage.getItem("userId"));

    function handleLogout() {
        sessionStorage.clear();
        window.location.href = '/login';
    }

    const location = useLocation();
    return ( 
        <div className="col-lg-2" style={{backgroundColor:'', height:'100vh', }}>
            <div className="row pr-1 pl-1 pt-5 ml-3 d-flex justify-content-center align-items-center" style={{height:'20%'}}>
                <a className="logo-title navbar-brand" href="/">
                    <img src={require('../images/SignLensLogo.png')} alt="SignLens" style={{
                        maxWidth: '100%',
                        width: 'auto',
                        height: '100%'
                    }}/>
                </a>
            </div>
            
            <div className="" style={{height:'60%', backgroundColor:'',}}>
                <div className="d-flex justify-content-center align-items-center" style={{marginLeft:'5%'}}>
                    <nav className="nav flex-column mt-5">   
                        {/* අධ්‍යයනය */}         
                        <NavLink exact to="/" className="nav-link main-nav-link" activeClassName="active-link">wOHhkh</NavLink>
                         {/* සංඥා ශබ්දකෝෂය */}
                        <NavLink exact to="/text-to-sign" className="nav-link main-nav-link" activeClassName="active-link">ix&#123;d YíofldaIh</NavLink>
                        {/* ශබ්ද පරිවර්ථකය */}
                        <NavLink exact to="/audio-to-sign" className="nav-link main-nav-link" activeClassName="active-link">Yío mßj¾:lh</NavLink>
                        {/* සංඥා හඳුනාගැනීම */}
                        <NavLink exact to="/sign-detection" className="nav-link main-nav-link " activeClassName="active-link">ix&#123;d y÷kd.ekSu</NavLink>
                        {/* වාචික පුහුණුව */}
                        <NavLink exact to="/vocal-training" className="nav-link main-nav-link" activeClassName="active-link">jdÑl mqyqKqj</NavLink>
                    </nav>
                </div>
            </div>
            <div style={{height:'20%' }} className="d-flex justify-content-center align-items-center">
                <div className="btn-group">
                    <button  type="button" className=" nav-link user-btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {name}
                    </button>
                    <div className="dropdown-menu dropdown-menu-right">
                        {/* <button className="dropdown-item" type="button">View Profile</button> */}
                        <button className="dropdown-item" type="button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default SideNavBar;