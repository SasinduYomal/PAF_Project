package backend.controller;

import backend.exception.PersonalizGoalsNotFoundException;
import backend.model.PersonalizGoalsModel;
import backend.repository.PersonalizGoalsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Allow React app to connect
@RequestMapping("/api/goals")
public class PersonalizGoalsController {
    @Autowired
    private PersonalizGoalsRepository repository;

    // Get all goals for a user
    @GetMapping("/user/{userId}")
    List<PersonalizGoalsModel> getUserGoals(@PathVariable String userId) {
        return repository.findByUserId(userId);
    }

    // Create new goal
    @PostMapping
    PersonalizGoalsModel newGoal(@RequestBody PersonalizGoalsModel newGoal) {
        return repository.save(newGoal);
    }

    // Get single goal
    @GetMapping("/{id}")
    PersonalizGoalsModel getGoal(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new PersonalizGoalsNotFoundException(id));
    }

    // Update goal
    @PutMapping("/{id}")
    PersonalizGoalsModel updateGoal(@RequestBody PersonalizGoalsModel updatedGoal, @PathVariable Long id) {
        return repository.findById(id)
                .map(goal -> {
                    goal.setTitle(updatedGoal.getTitle());
                    goal.setDescription(updatedGoal.getDescription());
                    goal.setProgress(updatedGoal.getProgress());
                    goal.setTargetDate(updatedGoal.getTargetDate());
                    return repository.save(goal);
                })
                .orElseThrow(() -> new PersonalizGoalsNotFoundException(id));
    }

    // Delete goal
    @DeleteMapping("/{id}")
    void deleteGoal(@PathVariable Long id) {
        repository.deleteById(id);
    }

    // Get completed goals for a user
    @GetMapping("/user/{userId}/completed")
    List<PersonalizGoalsModel> getCompletedGoals(@PathVariable String userId) {
        return repository.findByUserIdAndCompleted(userId, true);
    }

    // Get in-progress goals for a user
    @GetMapping("/user/{userId}/in-progress")
    List<PersonalizGoalsModel> getInProgressGoals(@PathVariable String userId) {
        return repository.findByUserIdAndCompleted(userId, false);
    }
}
