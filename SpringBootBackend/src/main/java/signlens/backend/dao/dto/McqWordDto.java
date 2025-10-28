package signlens.backend.dao.dto;

import lombok.Data;
import signlens.backend.dao.domain.McqWord;

@Data
public class McqWordDto {
	
//	private Integer id;
//	private String label;
//	private String value;
//	private String opt1;
//	private String opt2;
//	private String opt3;
//	private String opt4;
	
	private McqWord word;
	private boolean isCorrect;

}
