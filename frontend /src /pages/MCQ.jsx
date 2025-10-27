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
    const [quizCount, setQuizCount] = useState(10); //This should initialize 

    const hiddenButtonRef = useRef(null);
 
    useEffect(() => {
        RestService.startQuiz(token,{ }).then((res)=>{
                setQuizList(res.data.mcqWordDtolist);
                setSelectedQuiz(res.data.mcqWordDtolist[quizNo-1])


            }
        ).catch((err)=>{
            console.log(err)
        })
    }, []);


    function handleNext(){

        if(quizList != null && !quizList[quizNo-1].correct){
            
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
        setQuizNo(quizNo+1);
        setSelectedQuiz(quizList[quizNo])
    }

    function handleBack(){
        setQuizNo(quizNo-1);  
        setSelectedQuiz(quizList[quizNo-2])
    }

    async function checkAnswer(url){
        setIsValid(false);
        //Api call goes here
        try {
            const response = await axios.get(url, {
                responseType: 'arraybuffer', // Download image as binary data
            });

            const imageBlob = new Blob([response.data], { type: 'image/jpeg' });

            const formData = new FormData();
            formData.append('fileData', imageBlob)
            formData.append('label', selectedQuiz.word.label)

            RestService.getTextBySign(formData).then((res) => {
                if(res.data.isCorrect){
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
                    if(quizNo == quizCount){
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
            }).catch((err) => {
                console.log(err);
            })
        } catch (error) {
            console.error('Error:', error);
        }

    }

    function updateArray() {
        const newArr = quizList.map(
            obj => {
                if(obj.word.id === selectedQuiz.word.id){
                    return {...obj, correct:true}
                }
                return obj
            }
        )
        setQuizList(newArr)
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
                            <h4>Question No: {quizNo}  {quizList != null && quizList[quizNo-1].correct && <b style={{color:'green'}}>(Completed)</b>}</h4>
                        </div>

                        <div className="quesParagraph">
                            <p className="paragraph"> ' {selectedQuiz != null && selectedQuiz.word.value} ' අකුර නියෝජනය කිරීම සඳහා ඇමරිකානු සංඥා භාෂාවේ භාවිතා කරන අත් හැඩය කුමක්ද?</p>
                        </div>

                        <div className="quesParagraph">
                            <p className="paragraph">නිවැරදි පිළිතුරු එකක් හෝ කිහිපයක් තෝරන්න.</p>
                        </div>
                    </div>

                    {/*Second row*/}
                    <div className="answer_row">
                        <div className="col">
                            <div className="img-box">
                                <button className="imgButton" onClick={()=>checkAnswer(selectedQuiz.word.opt1)}>
                                    <img className="img-ans" src={selectedQuiz != null && selectedQuiz.word.opt1} />
                                </button>
                            </div>
                            <div className="answerNo">
                                <label className="ansNo">Answer 1</label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="img-box">
                                <button className="imgButton" onClick={()=>checkAnswer(selectedQuiz.word.opt2)}>
                                    <img className="img-ans" src={selectedQuiz != null && selectedQuiz.word.opt2} />
                                </button>
                            </div>
                            <div className="answerNo">
                                <label className="ansNo">Answer 2</label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="img-box">
                                <button className="imgButton" onClick={()=>checkAnswer(selectedQuiz.word.opt3)}>
                                    <img className="img-ans" src={selectedQuiz != null && selectedQuiz.word.opt3} />
                                </button>
                            </div>
                            <div className="answerNo">
                                <label className="ansNo">Answer 3</label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="img-box">
                                <button className="imgButton" onClick={()=>checkAnswer(selectedQuiz.word.opt4)}>
                                    <img className="img-ans" src={selectedQuiz != null && selectedQuiz.word.opt4} />
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
                            <button className={(quizNo == quizCount ? "hideButton":"btnNav")} onClick={handleNext} >Next</button>
                            {/* </div> */}
                        </div>
                    </div>
                </div>
                <button ref={hiddenButtonRef} style={{display:'none'}} type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Large modal</button>

            <div class="modal  fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" >
                <div class="modal-dialog modal-lg" >
                        <div class="modal-content modal-bg" >

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