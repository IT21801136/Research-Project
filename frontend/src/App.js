import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import SideNavBar from './components/SideNavBar';
import Footer from './components/Footer';
import './styles/main.css';
import './styles/sidenav.css';
import './styles/videoToSign.css';
import VideoToSign from './pages/VideoToSign';
import Login from './pages/Login';
import Register from './pages/Register';
import { useEffect, useState } from 'react';
import Test from './pages/Test';
import AudioToSign from './pages/AudioToSign';
import VocalTraining from './pages/VocalTraining';
import TextToSign from './pages/TextToSign';
import MCQ from './pages/MCQ';
import Lesson from './pages/Lesson';
import LearningDashboard from './pages/LearningDashboard';
import StartQuiz from './pages/StartQuiz';
 
 
function App() {
    const[isLogged, setIsLogged] = useState(sessionStorage.getItem("isLogged"));
    const[token, setToken] = useState(sessionStorage.getItem("token"));
    const[username, setUserName] = useState(sessionStorage.getItem("username"));
    const[userId, setUserId] = useState(sessionStorage.getItem("userId"));
 
  return (
    <div class="container-fluid bg" >
        <div className='row'>
 
          {isLogged ?
          <Router>  
            <SideNavBar />
            <div className="col-lg-10 p-5" style={{height:'100vh'}}>
                <div className='content-div'>                    
                        <Routes>
                          {/* <Route path='*' element={<VideoToSign/>}/> */}
                          <Route exact path='/sign-detection' element={<VideoToSign/>}/>
                          <Route exact path='/audio-to-sign' element={<AudioToSign/>}/>
                          <Route exact path='/vocal-training' element={<VocalTraining/>}/>
                          <Route exact path='/text-to-sign' element={<TextToSign/>}/>
                          <Route exact path= '/mcq' element={<MCQ/>}/>
                          <Route exact path= '/lessons/:lessonId' element={<Lesson/>}/>
                          <Route exact path= '/' element={<LearningDashboard/>}/>
                          <Route exact path= '/startQuiz' element={<StartQuiz/>}/>
                        </Routes>
               
                </div>
            </div>
          </Router>
          :
          <Router>  
          <div className="col-lg-12 p-5" style={{height:'100vh'}}>
              <div className='content-div'>                    
                      <Routes>
                        <Route exact path='*' element={<Login/>}/>
                        <Route exact path='/test' element={<Test/>}/>
                        <Route exact path='/login' element={<Login/>}/>
                        <Route exact path='/register' element={<Register/>}/>
                      </Routes>
             
              </div>
          </div>
        </Router>
 
          }
        {/* */}
 
       
         
        </div>
    </div>
  );
}
 
export default App;