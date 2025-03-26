import React,{useEffect, useRef, useState} from "react";
import { useRecordWebcam } from 'react-record-webcam'
import RestService from "../services/RestService";
import bg from '../images/bg-2.png'
import '../styles/auth.css';
import { ToastContainer, toast } from 'react-toastify';


function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    
    useEffect(() => {

    }, []);

    function handleRegister(){  
        if(name === "" || email === "" ||  username === "" || password === ""){
            // alert("Input fields can't be empty");
            toast.error("Input fields can't be empty", {
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

        if(!validateEmail(email)){
            toast.error("Please enter a valid email!!", {
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
        const userDto = {
            email:email,
            name:name,
            username:username,
            password:password,
            userRole:1
        }

        RestService.register(userDto).then((res)=>{
            
            if(res.data.userId != null){
                // alert('Registered Successfully')
                toast.success('Registered Successfully!!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    });
                window.location.href = '/login'; 
            } else {
                alert('Failed to register')
            }
        }).catch((err)=>{
            console.log(err);
        })
        
    }

    function validateEmail(email) {
        var gmailRegex = /@gmail\.com$/;
        return gmailRegex.test(email);
      }
 
  

  
    
    
    return ( 
        <div className="d-flex  align-items-center justify-content-center" style={{ height: '100%' }}  >
            <div className="col-lg-6 p-2 "  style={{ height: '92%', width: '50%'}} >
                <div className="row d-flex flex-column align-items-center justify-content-center">
                    <h1 className="site-title">Y%ia;%</h1>
                    <h5 className="site-slogan">Unlocking Sign Language Proficiency with Shrasthra</h5>
                    
                    <img src={bg} style={{width:'60%'}} />
                </div>

            </div>
            <div className="login-card col-lg-6 p-5 " style={{ height: '92%' }} >
                {/* <h1 className="main-title">Y%ia;%</h1> */}
                <div className="d-flex align-items-center justify-content-center ">
                    <h2>- REGISTER -</h2>
                </div>
                <div>
                    <div className="row" >
                        <div className="form-group col-lg-6">
                            <label>Name</label>
                            <input type="text" className="form-control" onChange={(e)=>setName(e.target.value)} />
                        </div>
                        <div className="form-group col-lg-6">
                            <label>Email</label>
                            <input type="text" className="form-control" onChange={(e)=>setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-lg-6">
                            <label>Username</label>
                            <input type="text" className="form-control" onChange={(e)=>setUsername(e.target.value)} />
                        </div>
                        <div className="form-group col-lg-6">
                            <label>Password</label>
                            <input type="password" className="form-control" onChange={(e)=>setPassword(e.target.value)} />
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-center" style={{ height: '100px' }}>
                        <button className="btn btn-login" onClick={handleRegister}>REGISTER</button>
                    </div>
                    <div className="d-flex align-items-center justify-content-center custom-text">
                        <i>Already have an account?</i>
                        <a className="ml-2" href="/login">Login Now</a>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
     );
}

export default Register;