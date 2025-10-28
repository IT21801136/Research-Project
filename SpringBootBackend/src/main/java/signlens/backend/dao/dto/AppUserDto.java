package signlens.backend.dao.dto;

import lombok.Data;

@Data
public class AppUserDto {
	private Integer userId;
	private String username;
	private String name;
	private String email;
	private Integer userRole;
	private String password;
}
