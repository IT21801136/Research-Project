import React, { useEffect, useRef, useState } from "react";
import { NavLink } from 'react-router-dom';
import RestService from "../services/RestService";
import '../styles/lessonDashboard.css';



function LearningDashboard() {
    return ( 
        <div style={{ height: '100%' }}>
            {/* Heading */}
            {/* <div className="content-title d-flex justify-content-center align-items-center">
                <h2> - nyqjrK m%Yak - </h2>
            </div> */}
            {/* Main Container start here*/}
            <div className="dashboard-container">

                <div className="dashboard-row"> 
                  <div className="dashboard-col">

                    {/* <div className="col-heading">
                        <h5 className="headingname">Lesson Types</h5>
                    </div> */}

                    <div className="dashboardCrad">
                       {/* <h5 className="cardheading">Learning Sign Language Letters</h5> */}
                       <NavLink exact to="/lessons/1" className="cardheading" activeClassName="active-link"><h5 className="subheading">Learning Sign Language Letters</h5></NavLink>
                       {/* <NavLink exact to="/lesson/1" className="btn p-5 dashboardCrad" style={{color:'white'}} activeClassName="active-link"><h5 className="subheading">Learning Sign Language Letters</h5></NavLink> */}
                    </div>

                    <div className="dashboardCrad">
                       {/* <h5 className="cardheading">Learning Sign Language Words</h5> */}
                       <NavLink exact to="/lessons/2" className="cardheading" activeClassName="active-link"><h5 className="subheading">Learning Sign Language Words</h5></NavLink>
                       {/* <NavLink exact to="/lesson/2" className="btn p-5 dashboardCrad" style={{color:'white'}} activeClassName="active-link"><h5 className="subheading">Learning Sign Language Words</h5></NavLink> */}
                    </div>

                    <div className="dashboardCrad">
                       {/* <h5 className="cardheading">Learning Sign Language Sentences</h5>  */}
                       <NavLink exact to="/lessons/3" className="cardheading" activeClassName="active-link"><h5 className="subheading">Learning Sign Language Sentences</h5></NavLink>
                    </div>

                    <div className="dashboardCrad">
                       <NavLink exact to="/mcq" className="cardheading" activeClassName="active-link"><h5 className="subheading">MCQ Session</h5></NavLink>
                    </div>

                  </div>

                  {/* <div className="dashboard-col"> */}

                    {/* <div className="col-heading">
                        <h5 className="headingname">Your Details</h5>
                    </div> */}

                    {/* <div className="dashboardCrad">
                       <NavLink exact to="/lesson" className="cardheading" activeClassName="active-link"><h5 className="subheading">Completed Lessons</h5></NavLink>
                    </div> */}

                    {/* <NavLink exact to="/lesson" className="btn p-5 dashboardCrad" style={{color:'white'}} activeClassName="active-link"><h5 className="subheading">Completed Lessons</h5></NavLink> */}

                    {/* <div className="dashboardCrad">
                       <NavLink exact to="/mcq" className="cardheading" activeClassName="active-link"><h5 className="subheading">MCQ Session</h5></NavLink>
                    </div> */}

                    {/* <div className="dashboardCrad">
                       <NavLink exact to="/lesson" className="cardheading" activeClassName="active-link"><h5 className="subheading">Your Account</h5></NavLink>
                    </div> */}

                  {/* </div> */}

                </div>

            </div>
        </div>
     );
}

export default LearningDashboard;