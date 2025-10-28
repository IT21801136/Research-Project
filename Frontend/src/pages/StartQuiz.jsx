import React, { useEffect, useRef, useState } from "react";
// import { useRecordWebcam } from 'react-record-webcam'
// import RestService from "../services/RestService";
import '../styles/startQuiz.css';
import BackgroundQuiz from '../images/bubble.png';



function StartQuiz() {
    return (
        <div className="Quiz" style={{ height: '100%' }}>
           <div className="quizCard">
               {/* <div className="smallRow">
                    <h3 className="quizHeading">Start Quiz</h3>
               </div>
               <div className="bigRow">
                  <img className="quizImag" src={BackgroundQuiz}/>
               </div> */}
           </div>
        </div>
    );
}

export default StartQuiz;