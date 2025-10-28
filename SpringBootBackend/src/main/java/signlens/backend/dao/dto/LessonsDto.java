package signlens.backend.dao.dto;

import lombok.Data;

@Data
public class LessonsDto {
	
	private Integer id;
	private Integer lesson_id;
	private String content;
	private String img_url;

}
