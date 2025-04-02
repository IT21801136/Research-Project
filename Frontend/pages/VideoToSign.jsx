import React,{useEffect, useRef, useState} from "react";
import { useRecordWebcam } from 'react-record-webcam'
import RestService from "../services/RestService";

function VideoToSign() {

    const[isLogged, setIsLogged] = useState(sessionStorage.getItem("isLogged"));
    const[token, setToken] = useState(sessionStorage.getItem("token"));
    const[username, setUserName] = useState(sessionStorage.getItem("username"));
    const[userId, setUserId] = useState(sessionStorage.getItem("userId"));

    const [recordedVideo, setRecordedVideo] = useState([]);
    const [count, setCount] = useState(null);
    const [endCount, setEndCount] = useState(0);
    const [status, setStatus] = useState('OPEN');
    const [meaning, setMeaning] = useState('Sample Text');
    const recordWebcam = useRecordWebcam({ frameRate: 60 });



    
    useEffect(() => {
      recordWebcam.open();
    }, []);

    useEffect(() => {
      if(count > 0){
        const interval = setInterval(() => {
          setCount(count - 1);
        }, 1000);
        return () => {
          clearInterval(interval);
        };
      } 
    }, [count]);
  


    function handleDetection(){
      setMeaning('')
      let retakePromise = new Promise(function(resolve, reject){
        resolve(recordWebcam.retake());
      })

      let stoppedPromise = new Promise(function(resolve, reject) {
        setTimeout(()=>{
          resolve(recordWebcam.stop())
        },5000)
       
      });
      
      retakePromise.then(()=>{
        setEndCount(0)
        recordWebcam.start();
      }).then(()=>{
        stoppedPromise.then(()=>{
          setStatus("PREVIEW")
          setCount(null)
          detectSign();
        })
      })
     
    }

  
    async function detectSign() {
        const blob = await recordWebcam.getRecording();
        const file = new File([blob], 'Test.mp4', { type: blob.type });

        const fileData = new FormData();
  
        fileData.append('file', file);

        RestService.detectSign(token,fileData).then((res)=>{
          setMeaning(res.data.signMap.value);
          console.log(res);
        }).catch((err)=>{
          console.log(err);
        })
    }

    async function downloadFile(){
      const blob = await recordWebcam.getRecording();
      const file = new File([blob], 'Test.mkv', { type: blob.type });


      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(file);
      downloadLink.download = file.name;

      // Programmatically click the link to initiate the download
      downloadLink.click();

      // Clean up the URL object
      URL.revokeObjectURL(downloadLink.href);
    }
    return ( 
        <div style={{height:'100%'}}  >
            <div className="content-title d-flex justify-content-center align-items-center">
              <h2> - ix&#123;d y÷kd.ekSu -</h2>
            </div>
            <div className="mt-3" style={{height:'92%'}} >
                <div className="row" style={{margin:'0'}}  >
                    <div className="col col-lg-8 ">
                      <div className="d-flex align-items-center justify-content-center"> 
                          <video ref={recordWebcam.webcamRef} autoPlay muted className="video-box"  />
                      </div>
                       <hr className="line"></hr>
                        <div className="small-card p-2">
                          <div className="row d-flex justify-content-center">
                            {recordWebcam.status == "RECORDING" ? <h5>Detection has started.</h5> : <h5>Sign detection will start in {count == null ? 5 : count} </h5>}
                          </div>
                          <div className="row d-flex justify-content-center">
                            <button className="btn video-btn" onClick={()=>{setTimeout(handleDetection,5000);setCount(5)}}>Start Detect</button>
                          </div>
                        </div>    
                        <hr className="line"></hr>                   
                    </div>
                    <div className="col d-flex align-items-center justify-content-center custom-card " >
                        <div>
                          
                          <video ref={recordWebcam.previewRef} autoPlay muted loop  className="video-box-small mt-3  "/>  
                          <h5 className="row d-flex justify-content-center pt-2">Preview</h5>      
                              <hr className="line-light"></hr>
                            <div className="small-card p-2 ">
                              <h3 className="mt-4" style={{fontFamily:'FMAbayaBld'}}>w¾:h ( </h3>
                              <div className=" ">
                                <h1 className="d-flex align-items-center justify-content-center" >{meaning}</h1>
                              </div>
                            </div>          
                            
                           
                        </div> 
                    </div>
                    
                </div>
            </div>
            
        </div>
     );
}

export default VideoToSign;