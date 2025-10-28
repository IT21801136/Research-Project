package signlens.backend.service.i;

import org.springframework.web.multipart.MultipartFile;

import signlens.backend.dao.dto.ProcessRequestDto;
import signlens.backend.dao.dto.ProcessResponseDto;

public interface SignlensBackendService {
	
	public ProcessResponseDto detectDynamicSign(MultipartFile file);
	public ProcessResponseDto audioToSign(MultipartFile file);
	public ProcessResponseDto videoToSign(MultipartFile file);
	public ProcessResponseDto vocalTraining(MultipartFile file);
	public ProcessResponseDto getAllLessonsById(ProcessRequestDto processRequestDto);
	public ProcessResponseDto startQuiz(ProcessRequestDto processRequestDto);
	public ProcessResponseDto getQuizByUID(ProcessRequestDto processRequestDto);
	public ProcessResponseDto getSignMapByValue(ProcessRequestDto processRequestDto);
	public ProcessResponseDto getSignURL(ProcessRequestDto processRequestDto);


}
