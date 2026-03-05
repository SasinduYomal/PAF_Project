package backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class PersonalizGoalsNotFoundAdvice {
    @ResponseBody
    @ExceptionHandler(PersonalizGoalsNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String goalNotFoundHandler(PersonalizGoalsNotFoundException ex) {
        return ex.getMessage();
    }
}