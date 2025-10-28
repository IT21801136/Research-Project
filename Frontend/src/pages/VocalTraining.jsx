import React, { useState } from "react";
import { WORDS, CATEGORIES } from "../Utils/words";
import "../styles/vocalTraining.css";
import RestService from "../services/RestService";
import vmsg from "vmsg";
import playIcon from "../images/play.png";
 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 
const recorder = new vmsg.Recorder({
  wasmURL: "https://unpkg.com/vmsg@0.3.0/vmsg.wasm",
});
 
function VocalTraining() {
  const [selectedWord, setSelectedWord] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [url, setUrl] = useState([]);
 
  const [isRecording, setIsRecording] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
 
  const categories = ["ක්‍රියාපද", "පරිසරය", "භාණ්ඩ", "පුද්ගලයන්", "ආහාරපාන"];
 
  async function start() {
    setIsRecording(true);
    try {
      await recorder.initAudio();
      await recorder.initWorker();
      recorder.startRecording();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  }
 
  async function stop() {
    setIsRecording(false);
    const blob = await recorder.stopRecording();
    setSelectedFile(new File([blob], "Test.mp3", { type: blob.type }));
    setUrl(URL.createObjectURL(blob));
  }
 
  async function play() {
    if (url) {
      new Audio(url).play();
    }
  }
 
  async function playMain(audio) {
    if (audio) {
      new Audio(audio).play();
    }
  }
 
  function checkVoice() {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("fileData", selectedFile);
      formData.append("label", selectedWord.label);
 
      RestService.checkVoice(formData)
        .then((res) => {
          if (res.data.isValid) {
            toast.success("Voice Matched!!", { position: "top-center", theme: "colored" });
          } else {
            toast.error("Try Again!!", { position: "top-center", theme: "colored" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
 
  return (
    <div style={{ height: "100%" }}>
      <div className="content-title d-flex justify-content-center align-items-center">
        {selectedCategory && (
          <div className="d-flex justify-content-center my-3 mr-5" style={{ position: "absolute", left: '90px' }}>
            <button className="btn" onClick={() => setSelectedCategory(null)}>
              ⬅️
            </button>
          </div>
        )}
        <h2> - jdÑl mqyqKqj  -</h2>
      </div>
 
      {/* Categories */}
      {!selectedCategory && (
        <div className="d-flex justify-content-center align-items-center">
          <div className="maincard">
            <div className="words">
              {CATEGORIES.map((cat) => (
                <div
                  className="mini-card"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <div className="word">
                    <div className="row">
                      <img src={cat.img} alt={cat.name} style={{ width: "150px" }} />
                    </div>
                    <div className="row mt-3">
                      <h4>{cat.name}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
 
      {/* Words by category */}
      {selectedCategory && (
        <div className="d-flex justify-content-center align-items-center">
          <div className="maincard">
            <div className="words">
              {WORDS.filter((word) => word.category === selectedCategory).map((word) => (
                <div
                  className="mini-card"
                  key={word.id}
                  onClick={() => setSelectedWord(word)}
                  data-toggle="modal"
                  data-target="#exampleModalCenter"
                >
                  <div className="word">
                    <div className="row">
                      <img src={word.imgurl} alt={word.name} />
                    </div>
                    <div className="row mt-4">
                      <h4>{word.name}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
 
      {/* Modal */}
      <div
        className="modal fade main-modal-bg"
        id="exampleModalCenter"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content modal-bg">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div>
                <div className="modal-mini-card" onClick={() => playMain(selectedWord.auidoUrl)}>
                  <div className="row col-md-12 d-flex justify-content-center align-items-center">
                    <img src={selectedWord.imgurl} style={{ width: "150px" }} alt="" />
                  </div>
                  <div className="row col-md-12 d-flex justify-content-center align-items-center">
                    <h1 style={{ fontSize: "3rem" }}>{selectedWord.name}</h1>
                  </div>
                </div>
                <hr className="line"></hr>
 
                <div className="row col-md-12 d-flex justify-content-center align-items-center mt-4">
                  <div className="col-md-4">
                    {!isRecording ? (
                      <button className="btn video-btn" onClick={start} style={{ width: "100%" }}>
                        Start
                      </button>
                    ) : (
                      <button className="btn video-btn" onClick={stop} style={{ width: "100%" }}>
                        Stop
                      </button>
                    )}
                  </div>
                  <div className="col-md-4 d-flex justify-content-center align-items-center">
                    <img
                      src={playIcon}
                      onClick={play}
                      style={{ width: "60%", cursor: "pointer" }}
                      alt="Play"
                    />
                  </div>
                  <div className="col-md-4">
                    <button className="btn video-btn" style={{ width: "100%" }} onClick={checkVoice}>
                      Match
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer"></div>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default VocalTraining;