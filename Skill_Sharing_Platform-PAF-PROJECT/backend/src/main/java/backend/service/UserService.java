package backend.service;

import backend.exception.UserNotFoundException;
import backend.model.UserModel;
import backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository repository;

    @Autowired
    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public UserModel findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    public Optional<UserModel> findFirstByGoogleSub(String googleSub) {
        return repository.findByGoogleSub(googleSub);
    }

    @Transactional
    public UserModel findOrCreateFromOAuth2(String googleSub,
                                            String email,
                                            String name,
                                            String pictureUrl) {
        Optional<UserModel> bySub   = repository.findByGoogleSub(googleSub);
        if (bySub.isPresent()) {
            UserModel u = bySub.get();
            u.setUsername(name);
            u.setImage(pictureUrl);
            return repository.save(u);
        }

        Optional<UserModel> byEmail = repository.findByEmail(email);
        if (byEmail.isPresent()) {
            UserModel u = byEmail.get();
            u.setGoogleSub(googleSub);
            u.setUsername(name);
            u.setImage(pictureUrl);
            return repository.save(u);
        }

        UserModel fresh = new UserModel();
        fresh.setGoogleSub(googleSub);
        fresh.setEmail(email);
        fresh.setUsername(name);
        fresh.setImage(pictureUrl);
        return repository.save(fresh);
    }

    @Transactional
    public UserModel followUser(Long currentUserId, Long targetUserId) {
        if (currentUserId.equals(targetUserId)) {
            throw new IllegalArgumentException("Cannot follow yourself");
        }
        UserModel current = repository.findById(currentUserId)
                .orElseThrow(() -> new UserNotFoundException(currentUserId));
        UserModel target = repository.findById(targetUserId)
                .orElseThrow(() -> new UserNotFoundException(targetUserId));

        if (target.getFollowers().add(current)) {
            repository.save(target);
        }
        return target;
    }

    @Transactional
    public UserModel unfollowUser(Long currentUserId, Long targetUserId) {
        if (currentUserId.equals(targetUserId)) {
            throw new IllegalArgumentException("Cannot unfollow yourself");
        }
        UserModel current = repository.findById(currentUserId)
                .orElseThrow(() -> new UserNotFoundException(currentUserId));
        UserModel target = repository.findById(targetUserId)
                .orElseThrow(() -> new UserNotFoundException(targetUserId));

        if (target.getFollowers().remove(current)) {
            repository.save(target);
        }
        return target;
    }
}

