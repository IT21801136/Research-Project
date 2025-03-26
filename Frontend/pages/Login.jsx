import React,{useEffect, useRef, useState} from "react";
import RestService from "../services/RestService";
import bg from '../images/bg-2.png'
import '../styles/auth.css';
import { ToastContainer, toast } from 'react-toastify';
function Login() {

    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');

    function handleAuthenticate(){  


      if(username =='' || password ==''){
        toast.error('Inputs cannot be empty!!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
          return;
      }

      RestService.authenticateUser(username, password).then((res)=>{
          console.log(res.data)
          if(res.data.token != null){
              sessionStorage.setItem("token", res.data.token);
              sessionStorage.setItem("isLogged", true);     
                        
              sessionStorage.setItem("name", res.data.userDto.name);
              sessionStorage.setItem("email", res.data.userDto.email);
              
              sessionStorage.setItem("role", res.data.userDto.userRole);
              sessionStorage.setItem("username", res.data.userDto.username);

              sessionStorage.setItem("userId", res.data.userDto.userId);
              window.location.href = '/'; 
          } else {
              alert('Failed Login')
          }
      }).catch((err)=>{
          console.log(err);
          toast.error('Login failed!! Please try again.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
      })
  }
 
    return ( 
      <div className="d-flex align-items-center justify-content-center" style={{ height: '100%' }}  >
        <div className="col-lg-6 p-2 "  style={{ height: '92%', width: '50%'}} >
                <div className="row d-flex flex-column align-items-center justify-content-center">
                    <h1 className="site-title">Y%ia;%</h1>
                    <h5 className="site-slogan">Unlocking Sign Language Proficiency with Shrasthra</h5>
                    
                    <img src={bg} style={{width:'60%'}} />
                </div>

            </div>
        <div className="login-card col-lg-6 p-5 " style={{ height: '92%' }} >
          <div className="d-flex align-items-center justify-content-center ">
            <h2>LOGIN</h2>
          </div>
          <div className="" style={{ margin: '0', backgroundColor: '' }}  >
            <div className="form-group">
              <label>Username</label>
              <input type="text" className="form-control" onChange={(e)=>setUsername(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <div className=" d-flex align-items-center justify-content-center" style={{ height: '100px' }}>
              <button className="btn btn-login" onClick={handleAuthenticate}>LOGIN</button>
            </div>
            <div className="d-flex align-items-center justify-content-center custom-text">
              <i>Don't have an account?</i>
              <a className="ml-2" href="/register">Register Now</a>
            </div>
          </div>
        </div>
        <ToastContainer />

      </div>
     );
}

export default Login;