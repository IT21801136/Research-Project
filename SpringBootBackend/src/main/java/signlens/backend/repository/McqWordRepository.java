package signlens.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import signlens.backend.dao.domain.McqWord;

public interface McqWordRepository extends JpaRepository<McqWord, Integer>{
	@Query(value ="SELECT * FROM signlens.mcq_words ORDER BY RAND() LIMIT 10",nativeQuery = true)
	public List<McqWord> generateQuiz();
}


