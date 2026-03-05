package backend.exception;

public class PersonalizGoalsNotFoundException extends RuntimeException {
    public PersonalizGoalsNotFoundException(Long id) {
        super("Could not find goal with id: " + id);
    }
}