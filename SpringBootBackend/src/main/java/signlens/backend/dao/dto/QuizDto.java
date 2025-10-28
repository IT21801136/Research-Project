package signlens.backend.dao.dto;

import lombok.Data;
import signlens.backend.dao.domain.McqWord;

@Data
public class QuizDto {
	
	private Integer id;
	private Integer paper_i;
	private Integer userid;
	private Integer qid;
	private Boolean isCorrect;
	private McqWord mcqWord;

}
