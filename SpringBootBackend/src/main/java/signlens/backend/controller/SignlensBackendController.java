package signlens.backend.controller;

import java.io.File;
import java.io.IOException;
import java.net.URI;

import javax.servlet.http.HttpServletRequest;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import signlens.backend.dao.dto.ProcessRequestDto;
import signlens.backend.dao.dto.ProcessResponseDto;
import signlens.backend.service.i.SignlensBackendService;
import signlens.backend.util.common.REST_CONTROLLER_URL;


@RestController
@CrossOrigin
public class SignlensBackendController {

	@Autowired
	SignlensBackendService backendService;
	
	@RequestMapping(value = REST_CONTROLLER_URL.DETECT_DYNAMIC_SIGN, method = RequestMethod.POST)
	public @ResponseBody ProcessResponseDto saveQuotation(@RequestParam("file") MultipartFile file, HttpServletRequest request){
		ProcessResponseDto responseDto = new ProcessResponseDto();	
		responseDto = backendService.detectDynamicSign(file);
		return responseDto;
	}
	
	@RequestMapping(value = REST_CONTROLLER_URL.AUDIO_TO_SIGN, method = RequestMethod.POST)
	public @ResponseBody ProcessResponseDto audioToSign(@RequestParam("file") MultipartFile file, HttpServletRequest request){
		ProcessResponseDto responseDto = new ProcessResponseDto();	
		responseDto = backendService.audioToSign(file);
		return responseDto;
	}
	@RequestMapping(value = REST_CONTROLLER_URL.VIDEO_TO_SIGN, method = RequestMethod.POST)
	public @ResponseBody ProcessResponseDto videoToSign(@RequestParam("file") MultipartFile file, HttpServletRequest request){
		ProcessResponseDto responseDto = new ProcessResponseDto();	
		responseDto = backendService.videoToSign(file);
		return responseDto;
	}
	@RequestMapping(value = REST_CONTROLLER_URL.VOCAL_TRAINING, method = RequestMethod.POST)
	public @ResponseBody ProcessResponseDto vocalTraining(@RequestParam("file") MultipartFile file, HttpServletRequest request){
		ProcessResponseDto responseDto = new ProcessResponseDto();	
		responseDto = backendService.vocalTraining(file);
		return responseDto;
	}
	
	@RequestMapping(value = REST_CONTROLLER_URL.GET_ALL_LESSONS, method = RequestMethod.POST)
	public @ResponseBody ProcessResponseDto getAllLessonsById(@RequestBody ProcessRequestDto processRequestDto, HttpServletRequest request){
		ProcessResponseDto responseDto = new ProcessResponseDto();	
		responseDto = backendService.getAllLessonsById(processRequestDto);
		return responseDto;
	}
	@RequestMapping(value = REST_CONTROLLER_URL.START_QUIZ, method = RequestMethod.POST)
	public @ResponseBody ProcessResponseDto startQuiz(@RequestBody ProcessRequestDto processRequestDto, HttpServletRequest request){
		ProcessResponseDto responseDto = new ProcessResponseDto();	
		responseDto = backendService.startQuiz(processRequestDto);
		return responseDto;
	}
	@RequestMapping(value = REST_CONTROLLER_URL.GET_QUIZ, method = RequestMethod.POST)
	public @ResponseBody ProcessResponseDto getQuizByUID(@RequestBody ProcessRequestDto processRequestDto, HttpServletRequest request){
		ProcessResponseDto responseDto = new ProcessResponseDto();	
		responseDto = backendService.getQuizByUID(processRequestDto);
		return responseDto;
	}
	@RequestMapping(value = REST_CONTROLLER_URL.GET_URL, method = RequestMethod.POST)
	public @ResponseBody ProcessResponseDto getSignURL(@RequestBody ProcessRequestDto processRequestDto, HttpServletRequest request){
		ProcessResponseDto responseDto = new ProcessResponseDto();	
		responseDto = backendService.getSignURL(processRequestDto);
		return responseDto;
	}
	
	
	
}
