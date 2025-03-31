import React, { useEffect, useRef, useState } from "react";
import { useRecordWebcam } from 'react-record-webcam'
import RestService from "../services/RestService";
import '../styles/lesson.css';
import { useParams } from "react-router-dom";


function Lesson() {
    const [isLogged, setIsLogged] = useState(sessionStorage.getItem("isLogged"));
    const [token, setToken] = useState(sessionStorage.getItem("token"));
    const [username, setUserName] = useState(sessionStorage.getItem("username"));
    const [userId, setUserId] = useState(sessionStorage.getItem("userId"));

    const { lessonId } = useParams()

    const [lessonList, setLessonList] = useState([]);
    const [page, setPage] = useState(1);
    const [selectedLesson, setSelectedLesson] = useState([]);
    const [max, setMax] = useState(1);


    useEffect(() => {
        RestService.getAllLessonsById(token, { lessonId: lessonId }).then(
            (res) => {
                setMax(res.data.lessons.length)
                setSelectedLesson(res.data.lessons[page - 1])
                setLessonList(res.data.lessons)
            }
        ).catch(
            (err) => {
                console.log(err)
            }
        )
    }, []);

    function handleNext() {
        setPage(page + 1);

    }

    function handleBack() {
        setPage(page - 1);

    }

    function lessonIdentity(id){
        if(id == 1){
            return 'අකුරු ';
        } else if(id==2){
            return 'වචන '
        }else if(id ==3){
            return 'වාක්‍ය '
        }
    }


    return (
        <div style={{ height: '100%' }}>
            {/* Heading */}
            <div className="content-title d-flex justify-content-center align-items-center">
                <h2> - wOHhkh - </h2>
            </div>
            {/* Main Container start here*/}
            <div className="main-container">

                <div className="lessonCard">
                    <div className="lessonContainer">

                        <div className="headingLesson">
                            <h4 className="Lheading"><b>පරිච්ඡේදය : 0{lessonId}</b></h4>
                            {/* How to Represent the Sign Language Letter "{lessonList[page-1] != null && lessonList[page-1].content }" */}
                        </div>

                        {/* Lesson Chapters Start here*/}
                        <div className="cardParagraph">
                            <h4 className="lessonsHeading"><b>සංඥා භාෂාවේ</b> <b>"{lessonList[page - 1] != null && lessonList[page - 1].content}"</b> <b>{lessonIdentity(lessonId)}නියෝජනය කරන්නේ කෙසේද? </b></h4>
                            <div className="lessonImg">
                                <img className="LImage" src={lessonList[page - 1] != null && lessonList[page - 1].img_url} />
                            </div>

                            <div className="LessonNavBtn">
                                <button className="Lnavbtn" onClick={handleBack} disabled={(page == 1)} >Previous</button>
                                <b>{page}</b>
                                <button className="Lnavbtn" onClick={handleNext} disabled={(page == max)} >Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Lesson;