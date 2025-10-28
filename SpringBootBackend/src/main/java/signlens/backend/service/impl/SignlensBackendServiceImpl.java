package signlens.backend.service.impl;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.HashMap;

import signlens.backend.dao.domain.Lessons;
import signlens.backend.dao.domain.McqWord;
import signlens.backend.dao.domain.Quiz;
import signlens.backend.dao.domain.SignMap;
import signlens.backend.dao.dto.LessonsDto;
import signlens.backend.dao.dto.McqWordDto;
import signlens.backend.dao.dto.ProcessRequestDto;
import signlens.backend.dao.dto.ProcessResponseDto;
import signlens.backend.dao.dto.QuizDto;
import signlens.backend.repository.JwtUserRepository;
import signlens.backend.repository.LessonsRepository;
import signlens.backend.repository.McqWordRepository;
import signlens.backend.repository.QuizRepository;
import signlens.backend.repository.SignMapRepository;
import signlens.backend.service.i.SignlensBackendService;

@Service
public class SignlensBackendServiceImpl implements SignlensBackendService{
	
	private static final String Date = null;
	
	@Autowired
	private JwtUserRepository jwtUserRepository;
	
	@Autowired
	private SignMapRepository signMapRepository;

	@Autowired
	private PasswordEncoder bcryptEncoder;
	
	@Autowired
	private LessonsRepository lessonsRepository;
	
	@Autowired
	private McqWordRepository mcqWordRepository;
	
	@Autowired
	private QuizRepository quizRepository;
	

	public ProcessResponseDto detectDynamicSign(MultipartFile file) {
		ProcessResponseDto responseDto = new ProcessResponseDto();
		try {
			if (!file.isEmpty()) {
				// Convert the file to bytes
				byte[] fileBytes = file.getBytes();

				RestTemplate restTemplate = new RestTemplate();

				// Set the URL of your Python Flask API
				String url = "http://127.0.0.1:3002/api/data";

				// Create headers and set content type as multipart/form-data
				HttpHeaders headers = new HttpHeaders();
				headers.setContentType(MediaType.MULTIPART_FORM_DATA);

				// Create the request body with the file as a part
				MultiValueMap<String, Object> requestBody = new LinkedMultiValueMap<>();
				requestBody.add("fileData", new ByteArrayResource(fileBytes) {
					@Override
					public String getFilename() {
						return file.getOriginalFilename();
					}
				});

				// Create the request entity with headers and body
				HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

				// Make the POST request to the second API
				ResponseEntity<ProcessResponseDto> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity,
						ProcessResponseDto.class);

				// Retrieve the response body
				ProcessResponseDto responseBody = response.getBody();

				// Print the response
				
				
				if(responseBody.getSign() != null) {
					SignMap signMap = signMapRepository.findSignMapByLabel(responseBody.getSign());
					if(signMap != null) {
						responseDto.setSignMap(signMap);
						responseDto.setSuccess(true);
					}
				}
				
			} 

		} catch (Exception e) {
			responseDto.setSuccess(false);
			System.out.println("detectDynamicSign : " + e);
		}

		return responseDto;
	}


	public ProcessResponseDto audioToSign(MultipartFile file) {

		ProcessResponseDto responseDto = new ProcessResponseDto();
		try {
			if (!file.isEmpty()) {
				// Convert the file to bytes
				byte[] fileBytes = file.getBytes();
	
				RestTemplate restTemplate = new RestTemplate();
	
				// Set the URL of your Python Flask API
				String url = "http://127.0.0.1:3002/audioToSign";
	
				// Create headers and set content type as multipart/form-data
				HttpHeaders headers = new HttpHeaders();
				headers.setContentType(MediaType.MULTIPART_FORM_DATA);
	
				// Create the request body with the file as a part
				MultiValueMap<String, Object> requestBody = new LinkedMultiValueMap<>();
				requestBody.add("fileData", new ByteArrayResource(fileBytes) {
					@Override
					public String getFilename() {
						return file.getOriginalFilename();
					}
				});
	
				// Create the request entity with headers and body
				HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
	
				// Make the POST request to the second API
				ResponseEntity<ProcessResponseDto> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity,
						ProcessResponseDto.class);
	
				// Retrieve the response body
				ProcessResponseDto responseBody = response.getBody();
	
				// Print the response
				
				
				if(responseBody.getSign() != null) {
					SignMap signMap = signMapRepository.findSignMapByLabel(responseBody.getSign());
					if(signMap != null) {
						responseDto.setSignMap(signMap);
						responseDto.setSuccess(true);
					}
				}
				
			} 
	
		} catch (Exception e) {
			responseDto.setSuccess(false);
			System.out.println("detectDynamicSign : " + e);
		}
	
		return responseDto;
	}
	
	public ProcessResponseDto videoToSign(MultipartFile file) {
		ProcessResponseDto responseDto = new ProcessResponseDto();
		try {
			if (!file.isEmpty()) {
				// Convert the file to bytes
				byte[] fileBytes = file.getBytes();
	
				RestTemplate restTemplate = new RestTemplate();
	
				// Set the URL of your Python Flask API
				String url = "http://127.0.0.1:3002/videoToSign";
	
				// Create headers and set content type as multipart/form-data
				HttpHeaders headers = new HttpHeaders();
				headers.setContentType(MediaType.MULTIPART_FORM_DATA);
	
				// Create the request body with the file as a part
				MultiValueMap<String, Object> requestBody = new LinkedMultiValueMap<>();
				requestBody.add("fileData", new ByteArrayResource(fileBytes) {
					@Override
					public String getFilename() {
						return file.getOriginalFilename();
					}
				});
	
				// Create the request entity with headers and body
				HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
	
				// Make the POST request to the second API
				ResponseEntity<ProcessResponseDto> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity,
						ProcessResponseDto.class);
	
				// Retrieve the response body
				ProcessResponseDto responseBody = response.getBody();
	
				// Print the response
				
				
				if(responseBody.getSign() != null) {
					SignMap signMap = signMapRepository.findSignMapByLabel(responseBody.getSign());
					if(signMap != null) {
						responseDto.setSignMap(signMap);
						responseDto.setSuccess(true);
					}
				}
				
			} 
	
		} catch (Exception e) {
			responseDto.setSuccess(false);
			System.out.println("detectDynamicSign : " + e);
		}
	
		return responseDto;
	}


	
	public ProcessResponseDto vocalTraining(MultipartFile file) {
		ProcessResponseDto responseDto = new ProcessResponseDto();
		try {
			if (!file.isEmpty()) {
				// Convert the file to bytes
				byte[] fileBytes = file.getBytes();
	
				RestTemplate restTemplate = new RestTemplate();
	
				// Set the URL of your Python Flask API
				String url = "http://127.0.0.1:3002/api/checkVoice";
	
				// Create headers and set content type as multipart/form-data
				HttpHeaders headers = new HttpHeaders();
				headers.setContentType(MediaType.MULTIPART_FORM_DATA);
	
				// Create the request body with the file as a part
				MultiValueMap<String, Object> requestBody = new LinkedMultiValueMap<>();
				requestBody.add("fileData", new ByteArrayResource(fileBytes) {
					@Override
					public String getFilename() {
						return file.getOriginalFilename();
					}
				});
	
				// Create the request entity with headers and body
				HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
	
				// Make the POST request to the second API
				ResponseEntity<ProcessResponseDto> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity,
						ProcessResponseDto.class);
	
				// Retrieve the response body
				ProcessResponseDto responseBody = response.getBody();
				responseDto.setValid(response.getBody().isValid());
	
				// Print the response
				
				
			} 
	
		} catch (Exception e) {
			responseDto.setSuccess(false);
			System.out.println("detectDynamicSign : " + e);
		}
	
		return responseDto;
	}
	
	public ProcessResponseDto getAllLessonsById(ProcessRequestDto requestDto) {
		ProcessResponseDto responseDto = new ProcessResponseDto();
		
		try {
			
			List<Lessons> lessonList = lessonsRepository.findLessonsByLessonId(requestDto.getLessonId());
			List<LessonsDto> lessonDtoList = new ArrayList<LessonsDto>();
			
			if(lessonList != null) {
				for(Lessons l : lessonList) {
					LessonsDto lessonsDto = new LessonsDto();
					lessonsDto.setId(l.getId());
					lessonsDto.setLesson_id(l.getLesson_id());
					lessonsDto.setImg_url(l.getImg_url());
					lessonsDto.setContent(l.getContent());
				
					lessonDtoList.add(lessonsDto);
				
			}
					
				responseDto.setLessons(lessonList);
				responseDto.setSuccess(true);
			}else {
				
				responseDto.setSuccess(true);
			}

			
		} catch (Exception e) {
			responseDto.setSuccess(false);
			System.out.println("detectDynamicSign : " + e);
		}
	
		return responseDto;
	}


	
	public ProcessResponseDto startQuiz(ProcessRequestDto processRequestDto) {
		ProcessResponseDto responseDto = new ProcessResponseDto();
		try {
			List<McqWord> mcqs = mcqWordRepository.generateQuiz();
			if(mcqs != null) {
				
				List<McqWordDto> mcqWordDtoList = new ArrayList<McqWordDto>();
				
				for(McqWord m : mcqs) {
					McqWordDto wordDto = new McqWordDto();
					wordDto.setWord(m);
					wordDto.setCorrect(false);
					mcqWordDtoList.add(wordDto);
				}
				
				responseDto.setSuccess(true);
				responseDto.setMcqWordDtolist(mcqWordDtoList);
				
			}
		}catch (Exception e) {
			responseDto.setSuccess(false);
			System.out.println("detectDynamicSign : " + e);
		}
		return responseDto;
	}
	
	
	
	
	
	public int generateRandom() {
		// Create a Random object
        Random random = new Random();
        
        // Define the range (inclusive) for the random integers
        int min = 1;
        int max = 100;
        
        // Generate a random integer between min and max
        int randomInt = random.nextInt(max - min + 1) + min;
        
        return randomInt;
	}



	public ProcessResponseDto getQuizByUID(ProcessRequestDto processRequestDto) {
		ProcessResponseDto responseDto = new ProcessResponseDto();
		try {
			List<Quiz> quizes = quizRepository.findQuizesByUid(processRequestDto.getUserID());
			if(quizes != null) {
				List<QuizDto> quizDtoList = new ArrayList<QuizDto>();
				for(Quiz q : quizes) {
					QuizDto qDto = new QuizDto();
					McqWord m = mcqWordRepository.findById(q.getQid()).get();
					qDto.setId(q.getId());
					qDto.setIsCorrect(q.getIsCorrect());
					qDto.setMcqWord(m);
					qDto.setPaper_i(q.getPaper_i());
					qDto.setQid(q.getQid());
					qDto.setUserid(processRequestDto.getUserID());
					quizDtoList.add(qDto);
				}
				
				responseDto.setQuizDtoList(quizDtoList);
				
			}
		}catch (Exception e) {
			responseDto.setSuccess(false);
			System.out.println("detectDynamicSign : " + e);
		}
		return responseDto;
	}


	public ProcessResponseDto getSignURL(ProcessRequestDto processRequestDto) {
		ProcessResponseDto responseDto = new ProcessResponseDto();
		try {
			if (processRequestDto != null) {
				// Try to map user input to an existing SignMap, but don't block on it
				SignMap signMap = signMapRepository.findSignMapByValue(processRequestDto.getValue());

				// Decide which label to send to Flask: prefer mapped label if present, else raw input value
				String labelToSend = (signMap != null && signMap.getLabel() != null && !signMap.getLabel().isEmpty())
						? signMap.getLabel()
						: processRequestDto.getValue();

				if (labelToSend == null) labelToSend = "";
				labelToSend = labelToSend.trim();

				RestTemplate restTemplate = new RestTemplate();

				// Set the URL of your Python Flask API
				String url = "http://127.0.0.1:3002/api/get-url";

				// Send minimal JSON expected by Flask: { "label": "..." }
				HttpHeaders headers = new HttpHeaders();
				headers.setContentType(MediaType.APPLICATION_JSON);
				Map<String, String> payload = new HashMap<>();
				payload.put("label", labelToSend);

				HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);

				// Make the POST request to the Flask API
				ResponseEntity<ProcessResponseDto> response = restTemplate.exchange(
						url, HttpMethod.POST, request, ProcessResponseDto.class);

				// Retrieve the response body and propagate it
				ProcessResponseDto responseBody = response.getBody();
				if (responseBody != null) {
					responseDto = responseBody;
				} else {
					responseDto.setSuccess(false);
				}
			}

		} catch (Exception e) {
			responseDto.setSuccess(false);
			System.out.println("getSignURL : " + e);
		}

		return responseDto;
	}


	@Override
	public ProcessResponseDto getSignMapByValue(ProcessRequestDto processRequestDto) {
		return null;
	}
}