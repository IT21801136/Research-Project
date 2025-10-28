import axios from 'axios';
import RestService from './RestService';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('RestService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Methods', () => {
    test('register should call correct endpoint with user data', async () => {
      const userDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };
      
      const mockResponse = { data: { success: true } };
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      const result = await RestService.register(userDto);
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8885/SignlensBackendService/register',
        userDto
      );
      expect(result).toEqual(mockResponse);
    });

    test('authenticateUser should call correct endpoint with credentials', async () => {
      const username = 'testuser';
      const password = 'password123';
      const mockResponse = {
        data: {
          token: 'fake-jwt-token',
          userDto: { username, name: 'Test User' }
        }
      };
      
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      const result = await RestService.authenticateUser(username, password);
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8885/SignlensBackendService/authenticate',
        { username, password }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Sign Detection Methods', () => {
    const token = 'fake-jwt-token';
    const formData = new FormData();
    formData.append('file', new Blob(['test'], { type: 'video/mp4' }));

    test('detectSign should call correct endpoint with authorization header', async () => {
      const mockResponse = { data: { sign: 'hello', success: true } };
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      const result = await RestService.detectSign(token, formData);
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8885/SignlensBackendService/sign/detectDynamicSign',
        formData,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('audioToSign should call correct endpoint with authorization header', async () => {
      const mockResponse = { data: { sign: 'hello', success: true } };
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      const result = await RestService.audioToSign(token, formData);
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8885/SignlensBackendService/sign/audioToSign',
        formData,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('videoToSign should call correct endpoint with authorization header', async () => {
      const mockResponse = { data: { sign: 'hello', success: true } };
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      const result = await RestService.videoToSign(token, formData);
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8885/SignlensBackendService/sign/videoToSign',
        formData,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('checkVocal should call correct endpoint with authorization header', async () => {
      const mockResponse = { data: { valid: true, success: true } };
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      const result = await RestService.checkVocal(token, formData);
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8885/SignlensBackendService/sign/vocalTraining',
        formData,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Learning and Quiz Methods', () => {
    const token = 'fake-jwt-token';

    test('getAllLessonsById should call correct endpoint', async () => {
      const request = { lessonId: 1 };
      const mockResponse = {
        data: {
          lessons: [{ id: 1, content: 'Lesson 1' }],
          success: true
        }
      };
      
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      const result = await RestService.getAllLessonsById(token, request);
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8885/SignlensBackendService/lessons/getAllLessons',
        request,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('getSignByText should call correct endpoint', async () => {
      const request = { text: 'hello' };
      const mockResponse = {
        data: { url: 'http://example.com/sign.gif', success: true }
      };
      
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      const result = await RestService.getSignByText(token, request);
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8885/SignlensBackendService/sign/getURL',
        request,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('startQuiz should call correct endpoint', async () => {
      const request = { userId: 1 };
      const mockResponse = {
        data: {
          mcqWordDtolist: [{ word: { word: 'hello' }, correct: false }],
          success: true
        }
      };
      
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      const result = await RestService.startQuiz(token, request);
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8885/SignlensBackendService/quiz/startQuiz',
        request,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('getQuizByUID should call correct endpoint', async () => {
      const request = { userId: 1 };
      const mockResponse = {
        data: {
          quizDtoList: [{ id: 1, isCorrect: true }],
          success: true
        }
      };
      
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      const result = await RestService.getQuizByUID(token, request);
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8885/SignlensBackendService/quiz/getQuiz',
        request,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + token
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Direct Flask API Methods', () => {
    test('checkVoice should call Flask API endpoint', async () => {
      const request = { audio: 'base64-audio-data' };
      const mockResponse = { data: { valid: true } };
      
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      const result = await RestService.checkVoice(request);
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://127.0.0.1:3002/api/checkVoice',
        request
      );
      expect(result).toEqual(mockResponse);
    });

    test('getTextToSignURL should call Flask API endpoint', async () => {
      const request = { text: 'hello' };
      const mockResponse = { data: { url: 'http://example.com/sign.gif' } };
      
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      const result = await RestService.getTextToSignURL(request);
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://127.0.0.1:3002/api/get-url',
        request
      );
      expect(result).toEqual(mockResponse);
    });

    test('getTextBySign should call Flask API endpoint', async () => {
      const request = { sign: 'sign-data' };
      const mockResponse = { data: { text: 'hello' } };
      
      mockedAxios.post.mockResolvedValue(mockResponse);
      
      const result = await RestService.getTextBySign(request);
      
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://127.0.0.1:3002/api/getTextBySign',
        request
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      const error = new Error('Network Error');
      mockedAxios.post.mockRejectedValue(error);
      
      await expect(RestService.authenticateUser('user', 'pass')).rejects.toThrow('Network Error');
    });

    test('should handle HTTP errors gracefully', async () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      };
      mockedAxios.post.mockRejectedValue(error);
      
      await expect(RestService.authenticateUser('user', 'pass')).rejects.toEqual(error);
    });
  });

  describe('Configuration', () => {
    test('should use correct backend URL', () => {
      expect(RestService).toBeDefined();
      // Test that the URLs are correctly configured by checking method calls
    });

    test('should use correct Flask URL', () => {
      expect(RestService).toBeDefined();
      // Test that the Flask URLs are correctly configured by checking method calls
    });
  });
});