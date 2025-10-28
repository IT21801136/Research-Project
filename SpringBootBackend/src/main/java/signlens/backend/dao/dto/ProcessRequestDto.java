package signlens.backend.dao.dto;

import lombok.Data;

@Data
public class ProcessRequestDto {
	private byte[] video;
	private Integer userID;
	private Integer lessonId;
	private String value;
}
