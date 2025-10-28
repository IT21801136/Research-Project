package signlens.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import signlens.backend.dao.domain.AppUser;



public interface JwtUserRepository extends JpaRepository<signlens.backend.dao.domain.AppUser, Integer>{
	public AppUser findByUsername(String username);
}
