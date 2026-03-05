package backend.repository;

import backend.model.Post;
import backend.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUser(UserModel user);
}
