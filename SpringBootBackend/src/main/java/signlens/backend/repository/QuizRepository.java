package signlens.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import signlens.backend.dao.domain.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, Integer>{
	
	@Query("SELECT q FROM Quiz q WHERE q.userid=:uid")
	public List<Quiz> findQuizesByUid(@Param("uid") Integer uid);

}
