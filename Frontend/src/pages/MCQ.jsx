import React, { useEffect, useRef, useState } from "react";
import { useRecordWebcam } from 'react-record-webcam'
import RestService from "../services/RestService";
import '../styles/mcq.css';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/finalModal.css';
import QuizBack from '../images/final.jpg';
import { NavLink } from "react-router-dom";


function MCQ() {
    const[isLogged, setIsLogged] = useState(sessionStorage.getItem("isLogged"));
    const[token, setToken] = useState(sessionStorage.getItem("token"));
    const[username, setUserName] = useState(sessionStorage.getItem("username"));
    const[userId, setUserId] = useState(sessionStorage.getItem("userId"));

    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [quizList, setQuizList] = useState(null);
    const [quizNo, setQuizNo] = useState(1);
    const [isValid, setIsValid] = useState(false);
    const [quizCount, setQuizCount] = useState(10); // will be set from API response

    const hiddenButtonRef = useRef(null);
 
    useEffect(() => {
        RestService.startQuiz(token, { })
            .then((res) => {
                const list = res?.data?.mcqWordDtolist || [];
                setQuizList(list);
                setQuizCount(list.length || 0);
                setSelectedQuiz(list[quizNo - 1] || null);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    function handleNext(){
        if (!quizList || quizList.length === 0) return;
        const currentIndex = quizNo - 1;
        const current = quizList[currentIndex];
        if (!current || !current.correct) {
            toast.error('Please Complete the Question to move forward', {
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
        const nextNo = Math.min(quizNo + 1, quizList.length);
        setQuizNo(nextNo);
        setSelectedQuiz(quizList[nextNo - 1] || null);
    }

    function handleBack(){
        if (!quizList || quizList.length === 0) return;
        const prevNo = Math.max(1, quizNo - 1);
        setQuizNo(prevNo);
        setSelectedQuiz(quizList[prevNo - 1] || null);
    }

    async function checkAnswer(url){
        if (!selectedQuiz || !selectedQuiz.word || !url) {
            return;
        }
        setIsValid(false);
        
        // Check if the selected URL matches the correct answer by comparing with exact filename
        const isCorrectAnswer = checkCorrectAnswer(url);
        
        if(isCorrectAnswer){
            toast.success('Correct answer!!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
            updateArray()
            setIsValid(true);
            if (quizNo >= quizCount && hiddenButtonRef.current) {
                hiddenButtonRef.current.click();
            }
            
        }else{
            toast.error('Incorrect answer!! Please try again.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
        }
    }

    function checkCorrectAnswer(selectedUrl) {
        if (!selectedQuiz || !selectedQuiz.word) {
            return false;
        }
        
        const word = selectedQuiz.word;
        const wordLabel = word.label.toLowerCase();
        const options = [word.opt1, word.opt2, word.opt3, word.opt4];
        
        // Find which option has the exact matching word in its filename
        const correctOption = options.find(option => {
            if (!option) return false;
            
            try {
                // Handle URLs with parameters (e.g., signed URLs)
                const url = new URL(option, window.location.origin);
                const pathname = url.pathname;
                
                // Extract filename from path
                const filename = pathname.split('/').pop();
                const nameWithoutExtension = filename.split('.')[0].toLowerCase();
                
                // Exact match instead of includes to handle cases like 'i' vs 'ii'
                return nameWithoutExtension === wordLabel;
            } catch (error) {
                // Fallback for relative paths
                const filename = option.split('/').pop();
                const nameWithoutExtension = filename.split('.')[0].toLowerCase();
                return nameWithoutExtension === wordLabel;
            }
        });
        
        return selectedUrl === correctOption;
    }

    function updateArray() {
        if (!quizList || !selectedQuiz || !selectedQuiz.word) return;
        const newArr = quizList.map((obj) => {
            if (obj?.word?.id === selectedQuiz.word.id) {
                return { ...obj, correct: true };
            }
            return obj;
        });
        setQuizList(newArr);
    }

 
    return (
        <div style={{ height: '100%' }}>
            {/* Heading */}
            <div className="content-title d-flex justify-content-center align-items-center">
                <h2> - nyqjrK m%Yak - </h2>
            </div>
            {/* Main Container start here*/}
            <div className="main-container">
                <div className="mcq_cardContainer">
                    {/* First row*/}
                    <div className="question_row">
                        <div className="questions">
                            <h4>Question No: {quizNo}  {quizList?.[quizNo-1]?.correct && <b style={{color:'green'}}>(Completed)</b>}</h4>
                        </div>

                        <div className="quesParagraph">
                            <p className="paragraph"> ' {selectedQuiz?.word?.value || ''} ' නියෝජනය කිරීම සඳහා සිංහල සංඥා භාෂාවේ භාවිතා කරන අත් හැඩය කුමක්ද?</p>
                        </div>

                        <div className="quesParagraph">
                            <p className="paragraph">නිවැරදි පිළිතුරු එකක් හෝ කිහිපයක් තෝරන්න.</p>
                        </div>
                    </div>

                    {/*Second row*/}
                    <div className="answer_row">
                        <div className="col">
                            <div className="img-box">
                                <button className="imgButton" disabled={!selectedQuiz?.word?.opt1} onClick={()=> selectedQuiz?.word?.opt1 && checkAnswer(selectedQuiz.word.opt1)}>
                                    <img className="img-ans" src={selectedQuiz?.word?.opt1 || ''} />
                                </button>
                            </div>
                            <div className="answerNo">
                                <label className="ansNo">Answer 1</label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="img-box">
                                <button className="imgButton" disabled={!selectedQuiz?.word?.opt2} onClick={()=> selectedQuiz?.word?.opt2 && checkAnswer(selectedQuiz.word.opt2)}>
                                    <img className="img-ans" src={selectedQuiz?.word?.opt2 || ''} />
                                </button>
                            </div>
                            <div className="answerNo">
                                <label className="ansNo">Answer 2</label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="img-box">
                                <button className="imgButton" disabled={!selectedQuiz?.word?.opt3} onClick={()=> selectedQuiz?.word?.opt3 && checkAnswer(selectedQuiz.word.opt3)}>
                                    <img className="img-ans" src={selectedQuiz?.word?.opt3 || ''} />
                                </button>
                            </div>
                            <div className="answerNo">
                                <label className="ansNo">Answer 3</label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="img-box">
                                <button className="imgButton" disabled={!selectedQuiz?.word?.opt4} onClick={()=> selectedQuiz?.word?.opt4 && checkAnswer(selectedQuiz.word.opt4)}>
                                    <img className="img-ans" src={selectedQuiz?.word?.opt4 || ''} />
                                </button>
                            </div>
                            <div className="answerNo">
                                <label className="ansNo">Answer 4</label>
                            </div>
                        </div>
                        
                    </div>
                    <div className="pageNavBtn">
                        <div className="btn-row">
                          
                            <button className={(quizNo == 1 ? "hideButton":"btnNav")} onClick={handleBack} disabled={quizNo==1} >Previous</button>
                            <button className={(quizNo >= quizCount ? "hideButton":"btnNav")} onClick={handleNext} >Next</button>
                            {/* </div> */}
                        </div>
                    </div>
                </div>
                <button ref={hiddenButtonRef} style={{display:'none'}} type="button" className="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Large modal</button>

            <div className="modal  fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-lg" >
                        <div className="modal-content modal-bg" >

                            <div className="p-4 mt-4" >
                                <h1 className="d-flex justify-content-center">Congratulations...!</h1>
                                <h5 className="d-flex justify-content-center">You have successfully completed your MCQ session.</h5>
                            </div>
                            <div className="col-md-12 d-flex justify-content-center align-items-center" >
                                <img src={QuizBack} style={{ width: "65%", backgroundColor: 'red' }} />
                            </div>
                            <hr className="line"></hr>
                            <div className="row col-md-12 d-flex justify-content-center align-items-center" >
                                <p className="quizQuote ">Do you want start a new MCQ session?</p>
                            </div>
                            <div className="row col-md-12 d-flex justify-content-center align-items-center mb-5">
                                <button className="quizeStartbtn d-flex justify-content-center align-items-center" onClick={()=>{window.location.reload();}}>Quiz Start</button>
                            </div>

                        </div>
                </div>
            </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default MCQ;


// What handshape is used in American Sign Language to represent the letter 'A'?
// Choose the correct one or more answer(s).