package signlens.backend.dao.dto;

import java.util.List;

import lombok.Data;
import signlens.backend.dao.domain.Lessons;
import signlens.backend.dao.domain.SignMap;

@Data
public class ProcessResponseDto {
	private boolean isSuccess;
	private String message;
	private String sign;
	private SignMap signMap;
	private boolean isValid;
	private List<Lessons> lessons;
	private List<QuizDto> quizDtoList;
	private List<McqWordDto> mcqWordDtolist;
	private String value;
	private String url;
	private String sinhalaText;
	private String originalLabel;
	
}
