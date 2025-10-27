import axios from 'axios';

//const FLASK_URL = "https://signlens-flask-backend.azurewebsites.net/";
//const BACKEND_URL = "https://signlens-spring-backend.azurewebsites.net/ShrasthraBackendService/";

 const FLASK_URL = "http://127.0.0.1:3002/";
 const BACKEND_URL = "http://localhost:8885/SignLensBackendService/";

class RestService {


    register(userDto) {
        return axios.post(BACKEND_URL + 'register',userDto)
    }

    authenticateUser(username, password) {
        return axios.post(BACKEND_URL + 'authenticate',{username:username, password:password})
    }

    detectSign(token, formData) {
        const config = {
            headers: { 
                'Access-Control-Allow-Origin': "*", 
                'Authorization': 'Bearer ' + token 
            }
        }
        return axios.post(BACKEND_URL + 'sign/detectDynamicSign',formData, config)
    }

    audioToSign(token, formData) {
        const config = {
            headers: { 
                'Access-Control-Allow-Origin': "*", 
                'Authorization': 'Bearer ' + token 
            }
        }
        return axios.post(BACKEND_URL + 'sign/audioToSign',formData, config)
    }

    videoToSign(token, formData) {
        const config = {
            headers: { 
                'Access-Control-Allow-Origin': "*", 
                'Authorization': 'Bearer ' + token 
            }
        }
        return axios.post(BACKEND_URL + 'sign/videoToSign',formData, config)
    }

    checkVocal(token, formData) {
        const config = {
            headers: { 
                'Access-Control-Allow-Origin': "*", 
                'Authorization': 'Bearer ' + token 
            }
        }
        return axios.post(BACKEND_URL + 'sign/vocalTraining',formData, config)
    }


    getAllLessonsById(token, req){
        const config = {
            headers: {
                'Access-Control-Allow-Origin': "*",
                'Authorization': 'Bearer ' + token
            }
        }
        return axios.post(BACKEND_URL + 'lessons/getAllLessons',req, config)
    }

    getSignByText(token, req){
        const config = {
            headers: {
                'Access-Control-Allow-Origin': "*",
                'Authorization': 'Bearer ' + token
            }
        }
        return axios.post(BACKEND_URL + 'sign/getURL',req, config)
    }

    startQuiz(token,req){
        const config = {
            headers: {
                'Access-Control-Allow-Origin': "*",
                'Authorization': 'Bearer ' + token
            }
        }
        return axios.post(BACKEND_URL + 'quiz/startQuiz',req, config)
    }

    getQuizByUID(token,req){
        const config = {
            headers : {
                'Access-Control-Allow-Origin': "*",
                'Authorization': 'Bearer ' + token
            }
        }
        return axios.post(BACKEND_URL + 'quiz/getQuiz',req, config)
    }

    // Direct Flask APIs
    checkVoice(req){
        return axios.post(FLASK_URL + 'api/checkVoice',req);
    }

    getTextToSignURL(req){
        return axios.post(FLASK_URL + 'api/get-url',req);
    }

    getTextBySign(req){
        return axios.post(FLASK_URL + 'api/getTextBySign',req);
    }
    

}

export default new RestService();