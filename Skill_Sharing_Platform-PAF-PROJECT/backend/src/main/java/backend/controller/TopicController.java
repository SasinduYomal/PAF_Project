package backend.controller;

import backend.model.Topic;
import backend.service.TopicService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true"
)
@PreAuthorize("isAuthenticated()")
public class TopicController {

    private final TopicService service;

    public TopicController(TopicService service) {
        this.service = service;
    }

    @GetMapping
    public List<Topic> all() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Topic one(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Topic create(@Valid @RequestBody Topic topic) {
        return service.save(topic);
    }

    @PutMapping("/{id}")
    public Topic update(@PathVariable Long id, @Valid @RequestBody Topic topic) {
        return service.update(id, topic);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

