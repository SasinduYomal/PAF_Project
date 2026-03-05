package backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Optional description provided by the user
    private String description;

    // Stores filenames of uploaded media (images/videos)
    @ElementCollection
    @CollectionTable(name = "post_media", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "filename")
    private List<String> mediaFiles;

    @CreationTimestamp            // set once, on INSERT
    private LocalDateTime createdAt;

    @UpdateTimestamp              // updated on every UPDATE
    private LocalDateTime updatedAt;

    // Many posts can belong to one user.
    // Adjust the fetch type as needed.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference   // Prevents infinite recursion during JSON serialization.
    private UserModel user;

    public Post() {
    }

    public Post(String description, List<String> mediaFiles, UserModel user, LocalDateTime createdAt) {
        this.description = description;
        this.createdAt = createdAt;
        this.mediaFiles = mediaFiles;
        this.user = user;
    }

    // Getters and setters

    @JsonProperty("username")
    public String getUsername() {
        return user != null
                ? user.getUsername()
                : null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getMediaFiles() {
        return mediaFiles;
    }

    public void setMediaFiles(List<String> mediaFiles) {
        this.mediaFiles = mediaFiles;
    }

    public UserModel getUser() {
        return user;
    }

    public void setUser(UserModel user) {
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
