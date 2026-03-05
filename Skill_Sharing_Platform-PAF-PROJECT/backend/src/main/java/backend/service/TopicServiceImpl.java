package backend.service;

import backend.model.Topic;
import backend.repository.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
public class TopicServiceImpl implements TopicService {

    private final TopicRepository repo;

    public TopicServiceImpl(TopicRepository repo) {
        this.repo = repo;
    }

    @Override public List<Topic> findAll() {
        return repo.findAll();
    }

    @Override public Topic findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Topic not found"));
    }

    @Override public Topic save(Topic topic) {
        topic.setId(null);          // force insert
        return repo.save(topic);
    }

    @Override public Topic update(Long id, Topic incoming) {
        Topic current = findById(id);
        current.setTitle(incoming.getTitle());
        current.setResource(incoming.getResource());
        current.setDeadline(incoming.getDeadline());
        current.setProgress(incoming.getProgress());
        return repo.save(current);
    }

    @Override public void delete(Long id) {
        repo.deleteById(id);
    }
}

