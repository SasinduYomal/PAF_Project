package backend.service;

import backend.model.Topic;
import java.util.List;

public interface TopicService {
    List<Topic> findAll();
    Topic findById(Long id);
    Topic save(Topic topic);
    Topic update(Long id, Topic topic);
    void delete(Long id);
}

