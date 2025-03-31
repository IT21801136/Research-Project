import React from "react";
import { useState } from "react";
import RestService from "../services/RestService";
import '../styles/textToSign.css';
import { ToastContainer, toast } from 'react-toastify';


function TextToSign() {
    const [isLogged, setIsLogged] = useState(sessionStorage.getItem("isLogged"));
    const [token, setToken] = useState(sessionStorage.getItem("token"));
    const [username, setUserName] = useState(sessionStorage.getItem("username"));
    const [userId, setUserId] = useState(sessionStorage.getItem("userId"));


    const [url, setUrl] = useState("");
    const [inputText, setInputText] = useState("");
    const [urls, setUrls] = useState([]);

    const [signWords, setsignWords] = useState([]);
    function getSignURL() {

        let tempUrls = [];

        const signMap = new Map();

        // map1.set('a', 1);
        // map1.set('b', 2);
        // map1.set('c', 3);

        if (inputText != null) {
            let words = inputText.split(" ");
            for (let word of words) {

                RestService.getSignByText(token, { value: word }).then(res => {
                    if (res.data.success) {
                        setUrl(res.data.url)
                        tempUrls.push(res.data.url)
                        signMap.set(word, res.data.url)
                    } else {
                        toast.error('Not found!!', {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        });
                        setUrl('')
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
            setsignWords(words)
        }

        setUrls(signMap)


    }



    return (

        <div style={{ height: '100%' }}>
            {/* Heading */}
            <div className="content-title d-flex justify-content-center align-items-center">
                <h2> - ix&#123;d YíofldaIh - </h2>
            </div>

            <div className="mt-4">
                <div className="row-input">
                    <div className="col-md-10">
                        <input type="text" className="form-control" onChange={(e) => setInputText(e.target.value)} />
                    </div>
                    <div className="col-md-2 ">
                        <button className="btn video-btn " onClick={getSignURL} >Search</button>
                    </div>
                </div>
            </div>


            <div className="row_output" >

                <div className="">
                    <div className=" d-flex justify-content-center align-items-center">
                        <div className="row d-flex justify-content-center" style={{ width: '100%', height: '60vh', overflow: 'scroll', overflowX: 'hidden' }}>
                            {signWords != null && signWords.map(
                                w =>
                                    <div className="text-to-sign-img d-flex flex-column justify-content-center align-items-center">
                                        <img className="" src={urls.get(w)} style={{ width: '15vw', height: '15vw' }} />
                                        <h2>{w}</h2>
                                    </div>
                            )}
                        </div>

                    </div>
                </div>

            </div>
            <ToastContainer />

        </div>

    );
}

export default TextToSign;