package backend.repository;

import backend.model.PersonalizGoalsModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PersonalizGoalsRepository extends JpaRepository<PersonalizGoalsModel, Long> {
    List<PersonalizGoalsModel> findByUserId(String userId);
    List<PersonalizGoalsModel> findByUserIdAndCompleted(String userId, boolean completed);
}