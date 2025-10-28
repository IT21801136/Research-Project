package signlens.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import signlens.backend.dao.domain.Lessons;

public interface LessonsRepository extends JpaRepository<Lessons, Integer>{
	
	@Query("SELECT l FROM Lessons l WHERE l.lesson_id=:lesson_id")
	public List<Lessons> findLessonsByLessonId(@Param("lesson_id") Integer lesson_id);

}
