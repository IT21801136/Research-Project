package signlens.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import signlens.backend.dao.domain.SignMap;

public interface SignMapRepository extends JpaRepository<SignMap, Integer>{
	
	@Query("SELECT s FROM SignMap s WHERE s.label=:label")
	public SignMap findSignMapByLabel(@Param("label") String label);
	
	@Query("SELECT s FROM SignMap s WHERE s.value=:value")
	public SignMap findSignMapByValue(@Param("value") String value);
}
