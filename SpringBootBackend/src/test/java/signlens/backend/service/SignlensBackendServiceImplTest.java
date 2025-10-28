package signlens.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.client.RestTemplate;
import signlens.backend.dao.domain.Lessons;
import signlens.backend.dao.domain.McqWord;
import signlens.backend.dao.domain.SignMap;
import signlens.backend.dao.dto.ProcessRequestDto;
import signlens.backend.dao.dto.ProcessResponseDto;
import signlens.backend.repository.*;
import signlens.backend.service.impl.SignlensBackendServiceImpl;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SignlensBackendServiceImplTest {

    @Mock
    private JwtUserRepository jwtUserRepository;

    @Mock
    private SignMapRepository signMapRepository;

    @Mock
    private LessonsRepository lessonsRepository;

    @Mock
    private McqWordRepository mcqWordRepository;

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private SignlensBackendServiceImpl signlensBackendService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testDetectDynamicSign_Success() {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file", 
                "test-video.mp4", 
                "video/mp4", 
                "test video content".getBytes()
        );
        
        ProcessResponseDto mockFlaskResponse = new ProcessResponseDto();
        mockFlaskResponse.setSign("hello");
        
        SignMap signMap = new SignMap();
        signMap.setLabel("hello");
        signMap.setValue("Hello");
        signMap.setImgUrl("http://example.com/hello.gif");
        
        // Simulated Flask response (not used directly since RestTemplate is not injected)
        
        when(signMapRepository.findSignMapByLabel("hello")).thenReturn(signMap);

        // Act
        ProcessResponseDto result = signlensBackendService.detectDynamicSign(file);

        // Assert
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(signMap, result.getSignMap());
    }

    @Test
    void testDetectDynamicSign_EmptyFile() {
        // Arrange
        MockMultipartFile emptyFile = new MockMultipartFile(
                "file", 
                "empty.mp4", 
                "video/mp4", 
                new byte[0]
        );

        // Act
        ProcessResponseDto result = signlensBackendService.detectDynamicSign(emptyFile);

        // Assert
        assertNotNull(result);
        assertFalse(result.isSuccess());
    }

    @Test
    void testDetectDynamicSign_SignNotFoundInDatabase() {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file", 
                "test-video.mp4", 
                "video/mp4", 
                "test video content".getBytes()
        );
        
        ProcessResponseDto mockFlaskResponse = new ProcessResponseDto();
        mockFlaskResponse.setSign("unknown");
        
        when(signMapRepository.findSignMapByLabel("unknown")).thenReturn(null);

        // Act
        ProcessResponseDto result = signlensBackendService.detectDynamicSign(file);

        // Assert
        assertNotNull(result);
        assertFalse(result.isSuccess());
    }

    @Test
    void testAudioToSign_Success() {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file", 
                "test-audio.wav", 
                "audio/wav", 
                "test audio content".getBytes()
        );
        
        ProcessResponseDto mockFlaskResponse = new ProcessResponseDto();
        mockFlaskResponse.setSign("hello");
        
        SignMap signMap = new SignMap();
        signMap.setLabel("hello");
        signMap.setValue("Hello");
        
        when(signMapRepository.findSignMapByLabel("hello")).thenReturn(signMap);

        // Act
        ProcessResponseDto result = signlensBackendService.audioToSign(file);

        // Assert
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(signMap, result.getSignMap());
    }

    @Test
    void testVideoToSign_Success() {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file", 
                "test-video.mp4", 
                "video/mp4", 
                "test video content".getBytes()
        );
        
        ProcessResponseDto mockFlaskResponse = new ProcessResponseDto();
        mockFlaskResponse.setSign("hello");
        
        SignMap signMap = new SignMap();
        signMap.setLabel("hello");
        signMap.setValue("Hello");
        
        when(signMapRepository.findSignMapByLabel("hello")).thenReturn(signMap);

        // Act
        ProcessResponseDto result = signlensBackendService.videoToSign(file);

        // Assert
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(signMap, result.getSignMap());
    }

    @Test
    void testVocalTraining_Success() {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file", 
                "test-audio.wav", 
                "audio/wav", 
                "test audio content".getBytes()
        );
        
        ProcessResponseDto mockFlaskResponse = new ProcessResponseDto();
        mockFlaskResponse.setValid(true);

        // Act
        ProcessResponseDto result = signlensBackendService.vocalTraining(file);

        // Assert
        assertNotNull(result);
        assertTrue(result.isValid());
    }

    @Test
    void testGetAllLessonsById_Success() {
        // Arrange
        ProcessRequestDto requestDto = new ProcessRequestDto();
        requestDto.setLessonId(1);
        
        Lessons lesson1 = new Lessons();
        lesson1.setId(1);
        lesson1.setLesson_id(1);
        lesson1.setContent("Lesson 1 content");
        lesson1.setImg_url("http://example.com/lesson1.jpg");
        
        Lessons lesson2 = new Lessons();
        lesson2.setId(2);
        lesson2.setLesson_id(1);
        lesson2.setContent("Lesson 2 content");
        lesson2.setImg_url("http://example.com/lesson2.jpg");
        
        List<Lessons> lessons = Arrays.asList(lesson1, lesson2);
        
        when(lessonsRepository.findLessonsByLessonId(1)).thenReturn(lessons);

        // Act
        ProcessResponseDto result = signlensBackendService.getAllLessonsById(requestDto);

        // Assert
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(lessons, result.getLessons());
    }

    @Test
    void testGetAllLessonsById_NoLessonsFound() {
        // Arrange
        ProcessRequestDto requestDto = new ProcessRequestDto();
        requestDto.setLessonId(999);
        
        when(lessonsRepository.findLessonsByLessonId(999)).thenReturn(null);

        // Act
        ProcessResponseDto result = signlensBackendService.getAllLessonsById(requestDto);

        // Assert
        assertNotNull(result);
        assertTrue(result.isSuccess()); // Still success even if no lessons found
    }

    @Test
    void testStartQuiz_Success() {
        // Arrange
        ProcessRequestDto requestDto = new ProcessRequestDto();
        requestDto.setUserID(1);
        
        McqWord word1 = new McqWord();
        word1.setId(1);
        
        McqWord word2 = new McqWord();
        word2.setId(2);
        
        List<McqWord> mcqWords = Arrays.asList(word1, word2);
        
        when(mcqWordRepository.generateQuiz()).thenReturn(mcqWords);

        // Act
        ProcessResponseDto result = signlensBackendService.startQuiz(requestDto);

        // Assert
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertNotNull(result.getMcqWordDtolist());
        assertEquals(2, result.getMcqWordDtolist().size());
        assertFalse(result.getMcqWordDtolist().get(0).isCorrect());
        assertFalse(result.getMcqWordDtolist().get(1).isCorrect());
    }

    @Test
    void testStartQuiz_NoQuestionsGenerated() {
        // Arrange
        ProcessRequestDto requestDto = new ProcessRequestDto();
        requestDto.setUserID(1);
        
        when(mcqWordRepository.generateQuiz()).thenReturn(null);

        // Act
        ProcessResponseDto result = signlensBackendService.startQuiz(requestDto);

        // Assert
        assertNotNull(result);
        assertFalse(result.isSuccess());
    }

    @Test
    void testGetSignURL_Success() {
        // Arrange
        ProcessRequestDto requestDto = new ProcessRequestDto();
        requestDto.setValue("hello");
        
        SignMap signMap = new SignMap();
        signMap.setLabel("hello");
        signMap.setValue("hello");
        
        ProcessResponseDto mockFlaskResponse = new ProcessResponseDto();
        mockFlaskResponse.setSuccess(true);
        mockFlaskResponse.setUrl("http://example.com/hello.gif");
        
        when(signMapRepository.findSignMapByValue("hello")).thenReturn(signMap);

        // Act
        ProcessResponseDto result = signlensBackendService.getSignURL(requestDto);

        // Assert
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals("http://example.com/hello.gif", result.getUrl());
    }

    @Test
    void testGetSignURL_NoMappingFound() {
        // Arrange
        ProcessRequestDto requestDto = new ProcessRequestDto();
        requestDto.setValue("unknown");
        
        ProcessResponseDto mockFlaskResponse = new ProcessResponseDto();
        mockFlaskResponse.setSuccess(true);
        mockFlaskResponse.setUrl("http://example.com/unknown.gif");
        
        when(signMapRepository.findSignMapByValue("unknown")).thenReturn(null);

        // Act
        ProcessResponseDto result = signlensBackendService.getSignURL(requestDto);

        // Assert
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals("http://example.com/unknown.gif", result.getUrl());
    }

    @Test
    void testGenerateRandom() {
        // Act
        int random1 = signlensBackendService.generateRandom();
        int random2 = signlensBackendService.generateRandom();

        // Assert
        assertTrue(random1 >= 1 && random1 <= 100);
        assertTrue(random2 >= 1 && random2 <= 100);
        // Note: random numbers might be the same, but that's acceptable
    }

    @Test
    void testDetectDynamicSign_Exception() {
        // Arrange
        MockMultipartFile file = mock(MockMultipartFile.class);
        
        try {
            when(file.isEmpty()).thenReturn(false);
            when(file.getBytes()).thenThrow(new RuntimeException("IO Exception"));
        } catch (Exception e) {
            // This shouldn't happen in test setup
        }

        // Act
        ProcessResponseDto result = signlensBackendService.detectDynamicSign(file);

        // Assert
        assertNotNull(result);
        assertFalse(result.isSuccess());
    }

    @Test
    void testAudioToSign_Exception() {
        // Arrange
        MockMultipartFile file = mock(MockMultipartFile.class);
        
        try {
            when(file.isEmpty()).thenReturn(false);
            when(file.getBytes()).thenThrow(new RuntimeException("IO Exception"));
        } catch (Exception e) {
            // This shouldn't happen in test setup
        }

        // Act
        ProcessResponseDto result = signlensBackendService.audioToSign(file);

        // Assert
        assertNotNull(result);
        assertFalse(result.isSuccess());
    }
}