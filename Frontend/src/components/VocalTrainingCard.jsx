import React, { useState } from "react";
import axios from "axios";

function VocalTrainingCard(props) {
    const { id, name, imgurl } = props.data;

    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [selectedWord, setSelectedWord]=useState(props.data)
    const [wordName, setWordName] = useState(props.data.name);

    let mediaRecorder;

    const startRecording = async () => {
        setIsRecording(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: "audio/wav" });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
            };

            mediaRecorder.start();
            setTimeout(() => {
                mediaRecorder.stop();
                setIsRecording(false);
            }, 5000); // Record for 5 seconds
        } catch (error) {
            console.error("Recording error:", error);
            setIsRecording(false);
        }
    };

    const playAudio = () => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        }
    };

    const sendAudioToBackend = async () => {
        alert(selectedWord.name)
        if (audioBlob) {
            const formData = new FormData();
            formData.append("audio", audioBlob);
            formData.append("label",selectedWord.name)

             try {
                 const response = await axios.post("http://127.0.0.1:5000/vocal-check", formData, {
                     headers: {
                         "Content-Type": "multipart/form-data",
                     },
                 });

                 console.log("Backend response:", response.data);
             } catch (error) {
                 console.error("Backend error:", error);
             }
        }
    };

    function test(){
        alert(name)
    }

    return (
        <>
            <div className="mini-card"  data-toggle="modal" data-target="#exampleModalCenter">
                <div className="word">
                    <div className="row">
                        <img src={imgurl} />
                    </div>
                    <div className="row mt-4">
                        <h4 >{name}</h4>
                    </div>                   
                </div>
                <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">{name}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div>
                                <button className ="btn" onClick={startRecording} disabled={isRecording}>
                                    {isRecording ? "Recording..." : "Start Recording"}
                                </button>
                                <button className ="btn" onClick={playAudio} disabled={!audioUrl}>
                                    Check Audio
                                </button>
                                <button className ="btn"  onClick={sendAudioToBackend} disabled={!audioBlob}>
                                    Send Audio to Backend
                                </button>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" onClick={test} className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            </div> 
            
        </>
    );
}

export default VocalTrainingCard;