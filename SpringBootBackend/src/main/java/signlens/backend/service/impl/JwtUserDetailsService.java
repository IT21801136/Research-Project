package signlens.backend.service.impl;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import signlens.backend.dao.domain.AppUser;
import signlens.backend.dao.dto.AppUserDto;
import signlens.backend.repository.JwtUserRepository;


@Service
public class JwtUserDetailsService implements UserDetailsService {

	@Autowired
	private JwtUserRepository jwtUserRepository;

	@Autowired
	private PasswordEncoder bcryptEncoder;
	
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		AppUser user = jwtUserRepository.findByUsername(username);
		
//		if ("javainuse".equals(username)) {
//			return new User("javainuse", "$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6",
//					new ArrayList<>());
//		} else {
//			throw new UsernameNotFoundException("User not found with username: " + username);
//		}
		
		if (user == null) {
			throw new UsernameNotFoundException("User not found with username: " + username);
		}
		return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
				new ArrayList<>());
	}

	public AppUser save(AppUserDto user) {
		AppUser newUser = new AppUser();
		newUser.setUsername(user.getUsername());
		newUser.setName(user.getName());
		newUser.setUserRole(user.getUserRole());
		newUser.setEmail(user.getEmail());
		newUser.setPassword(bcryptEncoder.encode(user.getPassword()));
			
		
		return  jwtUserRepository.save(newUser);
	}
	
	public AppUserDto findUserByUsername(String username) {
		AppUser user = jwtUserRepository.findByUsername(username);
		
		AppUserDto userDto = new AppUserDto();
		userDto.setUserId(user.getUserId());
		userDto.setName(user.getName());
		userDto.setUsername(user.getName());
		userDto.setEmail(user.getEmail());
		userDto.setUserRole(user.getUserRole());
//		userDto.setPassword(user.getPassword());

		return userDto;
		
	}
}