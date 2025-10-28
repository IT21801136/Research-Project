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
    const [sinhalaTexts, setSinhalaTexts] = useState(new Map());

    const [signWords, setsignWords] = useState([]);
    function getSignURL() {

        let tempUrls = [];

        const signMap = new Map();
        const sinhalaMap = new Map();

        if (inputText != null) {
            let words = inputText.split(" ");
            for (let word of words) {

                RestService.getSignByText(token, { value: word }).then(res => {
                    if (res.data.success) {
                        setUrl(res.data.url);
                        tempUrls.push(res.data.url);
                        signMap.set(word, res.data.url);
                        
                        // Store Sinhala text if available, otherwise use original word
                        const displayText = res.data.sinhalaText || word;
                        sinhalaMap.set(word, displayText);
                        
                        setUrls(new Map(signMap)); // Update UI immediately when URL is received
                        setSinhalaTexts(new Map(sinhalaMap)); // Update Sinhala texts
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
                        setUrl('');
                        signMap.set(word, ''); // Set empty URL for not found words
                        sinhalaMap.set(word, word); // Use original word if not found
                        setUrls(new Map(signMap));
                        setSinhalaTexts(new Map(sinhalaMap));
                    }
                }).catch(err => {
                    console.log(err);
                    signMap.set(word, ''); // Set empty URL for errors
                    sinhalaMap.set(word, word); // Use original word for errors
                    setUrls(new Map(signMap));
                    setSinhalaTexts(new Map(sinhalaMap));
                })
            }
            setsignWords(words)
        }

        setUrls(signMap)
        setSinhalaTexts(sinhalaMap)

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
                                    <div className="text-to-sign-img d-flex flex-column justify-content-center align-items-center" key={w}>
                                        {urls.get(w) ? (
                                            <iframe 
                                                src={urls.get(w)} 
                                                style={{ width: '15vw', height: '15vw', border: 'none', borderRadius: '10px' }}
                                                title={`Sign for ${w}`}
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div style={{ 
                                                width: '15vw', 
                                                height: '15vw', 
                                                display: 'flex', 
                                                justifyContent: 'center', 
                                                alignItems: 'center', 
                                                background: '#f0f0f0',
                                                borderRadius: '10px',
                                                border: '2px dashed #ccc'
                                            }}>
                                                <span style={{ color: '#666', fontSize: '14px', textAlign: 'center' }}>
                                                    No sign available
                                                </span>
                                            </div>
                                        )}
                                        <h2>{sinhalaTexts.get(w) || w}</h2>
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