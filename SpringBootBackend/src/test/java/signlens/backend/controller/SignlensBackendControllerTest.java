package signlens.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import signlens.backend.dao.dto.ProcessRequestDto;
import signlens.backend.dao.dto.ProcessResponseDto;
import signlens.backend.service.i.SignlensBackendService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class SignlensBackendControllerTest {

    @Mock
    private SignlensBackendService backendService;

    @InjectMocks
    private SignlensBackendController signlensBackendController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

        @BeforeEach
        void setUp() {
                MockitoAnnotations.initMocks(this);
                mockMvc = MockMvcBuilders.standaloneSetup(signlensBackendController).build();
                objectMapper = new ObjectMapper();
        }

    @Test
    void testDetectDynamicSign_Success() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file", 
                "test-video.mp4", 
                "video/mp4", 
                "test video content".getBytes()
        );
        
        ProcessResponseDto expectedResponse = new ProcessResponseDto();
        expectedResponse.setSuccess(true);
        expectedResponse.setSign("hello");
        
        when(backendService.detectDynamicSign(any())).thenReturn(expectedResponse);

        // Act & Assert
        mockMvc.perform(multipart("/sign/detectDynamicSign")
                .file(file)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.sign").value("hello"));
    }

    @Test
    void testAudioToSign_Success() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file", 
                "test-audio.wav", 
                "audio/wav", 
                "test audio content".getBytes()
        );
        
        ProcessResponseDto expectedResponse = new ProcessResponseDto();
        expectedResponse.setSuccess(true);
        expectedResponse.setSign("hello");
        
        when(backendService.audioToSign(any())).thenReturn(expectedResponse);

        // Act & Assert
        mockMvc.perform(multipart("/sign/audioToSign")
                .file(file)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.sign").value("hello"));
    }

    @Test
    void testVideoToSign_Success() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file", 
                "test-video.mp4", 
                "video/mp4", 
                "test video content".getBytes()
        );
        
        ProcessResponseDto expectedResponse = new ProcessResponseDto();
        expectedResponse.setSuccess(true);
        expectedResponse.setSign("hello");
        
        when(backendService.videoToSign(any())).thenReturn(expectedResponse);

        // Act & Assert
        mockMvc.perform(multipart("/sign/videoToSign")
                .file(file)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.sign").value("hello"));
    }

    @Test
    void testVocalTraining_Success() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file", 
                "test-audio.wav", 
                "audio/wav", 
                "test audio content".getBytes()
        );
        
        ProcessResponseDto expectedResponse = new ProcessResponseDto();
        expectedResponse.setSuccess(true);
        expectedResponse.setValid(true);
        
        when(backendService.vocalTraining(any())).thenReturn(expectedResponse);

        // Act & Assert
        mockMvc.perform(multipart("/sign/vocalTraining")
                .file(file)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.valid").value(true));
    }

    @Test
    void testGetAllLessonsById_Success() throws Exception {
        // Arrange
        ProcessRequestDto requestDto = new ProcessRequestDto();
        requestDto.setLessonId(1);
        
        ProcessResponseDto expectedResponse = new ProcessResponseDto();
        expectedResponse.setSuccess(true);
        
        when(backendService.getAllLessonsById(any())).thenReturn(expectedResponse);

        // Act & Assert
        mockMvc.perform(post("/lessons/getAllLessons")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testStartQuiz_Success() throws Exception {
        // Arrange
        ProcessRequestDto requestDto = new ProcessRequestDto();
        requestDto.setUserID(1);
        
        ProcessResponseDto expectedResponse = new ProcessResponseDto();
        expectedResponse.setSuccess(true);
        
        when(backendService.startQuiz(any())).thenReturn(expectedResponse);

        // Act & Assert
        mockMvc.perform(post("/quiz/startQuiz")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetQuizByUID_Success() throws Exception {
        // Arrange
        ProcessRequestDto requestDto = new ProcessRequestDto();
        requestDto.setUserID(1);
        
        ProcessResponseDto expectedResponse = new ProcessResponseDto();
        expectedResponse.setSuccess(true);
        
        when(backendService.getQuizByUID(any())).thenReturn(expectedResponse);

        // Act & Assert
        mockMvc.perform(post("/quiz/getQuiz")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetSignURL_Success() throws Exception {
        // Arrange
        ProcessRequestDto requestDto = new ProcessRequestDto();
        requestDto.setValue("hello");
        
        ProcessResponseDto expectedResponse = new ProcessResponseDto();
        expectedResponse.setSuccess(true);
        expectedResponse.setUrl("http://example.com/hello.gif");
        
        when(backendService.getSignURL(any())).thenReturn(expectedResponse);

        // Act & Assert
        mockMvc.perform(post("/sign/getURL")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.url").value("http://example.com/hello.gif"));
    }

    @Test
    void testDetectDynamicSign_EmptyFile() throws Exception {
        // Arrange
        MockMultipartFile emptyFile = new MockMultipartFile(
                "file", 
                "empty.mp4", 
                "video/mp4", 
                new byte[0]
        );
        
        ProcessResponseDto expectedResponse = new ProcessResponseDto();
        expectedResponse.setSuccess(false);
        
        when(backendService.detectDynamicSign(any())).thenReturn(expectedResponse);

        // Act & Assert
        mockMvc.perform(multipart("/sign/detectDynamicSign")
                .file(emptyFile)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testAudioToSign_ServiceException() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file", 
                "test-audio.wav", 
                "audio/wav", 
                "test audio content".getBytes()
        );
        
        ProcessResponseDto expectedResponse = new ProcessResponseDto();
        expectedResponse.setSuccess(false);
        
        when(backendService.audioToSign(any())).thenReturn(expectedResponse);

        // Act & Assert
        mockMvc.perform(multipart("/sign/audioToSign")
                .file(file)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testGetAllLessonsById_InvalidRequest() throws Exception {
        // Arrange
        ProcessRequestDto requestDto = new ProcessRequestDto();
        // Don't set lessonId
        
        ProcessResponseDto expectedResponse = new ProcessResponseDto();
        expectedResponse.setSuccess(false);
        
        when(backendService.getAllLessonsById(any())).thenReturn(expectedResponse);

        // Act & Assert
        mockMvc.perform(post("/lessons/getAllLessons")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testStartQuiz_ServiceFailure() throws Exception {
        // Arrange
        ProcessRequestDto requestDto = new ProcessRequestDto();
        requestDto.setUserID(999); // Non-existent user
        
        ProcessResponseDto expectedResponse = new ProcessResponseDto();
        expectedResponse.setSuccess(false);
        
        when(backendService.startQuiz(any())).thenReturn(expectedResponse);

        // Act & Assert
        mockMvc.perform(post("/quiz/startQuiz")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false));
    }
}