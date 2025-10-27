import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecordWebcam } from 'react-record-webcam';
import RestService from "../services/RestService";
import '../styles/audioToSign.css';
import { ToastContainer, toast } from 'react-toastify';



const AudioToSign = () => {

  const[isLogged, setIsLogged] = useState(sessionStorage.getItem("isLogged"));
  const[token, setToken] = useState(sessionStorage.getItem("token"));
  const[username, setUserName] = useState(sessionStorage.getItem("username"));
  const[userId, setUserId] = useState(sessionStorage.getItem("userId"));
  //const [file, setFile] = useState(null);

  const [url, setUrl] = useState("");
  const [sinhalaValue, setSinhalaValue] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const[audiotype,setAudiotype] = useState([]);
  
  const handleVideoFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };


  //Video to sign API
  const handleVideoUpload = () => {
    if(videoFile==null){
      toast.error('Please upload the video!!', {
        position: "top-center",
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
    if (videoFile) {
      const fileData = new FormData();
      
      fileData.append('file', videoFile);
        if(videoFile.type == "video/mp4")
        {

          toast.success('Video Uploaded!!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
          RestService.videoToSign(token,fileData).then((res)=>{
            console.log(res);
            setUrl(res.data.signMap.imgUrl)
            setSinhalaValue(res.data.signMap.value)
            const videoElement = document.getElementById('videoElement');
              if (videoElement) {
                videoElement.load(); // This reloads the video
              }
          }).catch((err)=>{
            console.log(err);
          })
       }
       else
      {
        // alert("File type is not supported")
        toast.error('File type is not supported', {
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
  };

  //Audio to sign API
  const handleAudioUpload = () => {
    if(audioFile==null){
      toast.error('Please upload the audio!!', {
        position: "top-center",
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
      const fileData = new FormData();
      fileData.append('file', audioFile);
      
      if(audioFile.type == "audio/wav")
      {
        toast.success('Audio Uploaded!!', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
        RestService.audioToSign(token,fileData).then((res)=>{
          console.log(res);
          setUrl(res.data.signMap.imgUrl)
          console.log(res.data.signMap.imgUrl)
          setSinhalaValue(res.data.signMap.value)
          const videoElement = document.getElementById('videoElement');
          if (videoElement) {
            videoElement.load(); // This reloads the video
          }
        }).catch((err)=>{
          console.log(err);
        })
      }
      else
      {
        toast.error('File type is not supported', {
          position: "top-center",
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
  };

  return (
    <div style={{height:'100%'}}>
       <div className="content-title d-flex justify-content-center align-items-center">
          <h2> - Yío mßj¾:lh -</h2>
        </div>
        <div className="row col-md-12 mt-5 " >
          <div className="col-md-6" >
              <div className="row  custom-border p-4 d-flex align-items-center justify-content-center">
                <h3 style={{width:"100%"}}>Upload Video</h3>
                <input type="file" accept="video/*" onChange={handleVideoFileChange} />
                <button className="btn video-btn" onClick={handleVideoUpload}>Upload Video</button>
              </div>
              <div className="row mt-3 custom-border p-4 d-flex align-items-center justify-content-center">
                <h3 style={{width:"100%"}}>Upload Audio</h3>
                <input type="file"  onChange={(e)=>setAudioFile(e.target.files[0])} />
                <button className="btn video-btn" onClick={handleAudioUpload}>Upload Audio</button>
              </div>
          </div>
          <div className="col-md-6 ">
              <div className="row d-flex align-items-center justify-content-center" >
                  <video autoPlay controls muted className="video-box1" id="videoElement" >
                    <source src={url} type="video/mp4" />
                    <source src={url} type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
              </div>
              <hr className="line"></hr>
              <div className="row col-md-12 ">
                <h3 className="mt-2" style={{fontFamily:'FMAbayaBld',width:"100%"}}>w¾:h ( </h3> 
                <h1 className="d-flex align-items-center justify-content-center" >{sinhalaValue}</h1>
              </div>
          </div>
        </div>
        <ToastContainer />
    </div>
  );
};

export default AudioToSign;