package backend.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;

import java.util.*;

@JsonIgnoreProperties(
        value        = { "followerCount", "followingCount" }, // just the virtual counts
        allowGetters = true
)
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property  = "id",
        scope     = UserModel.class
)
@Entity
@Table(name = "users")
public class UserModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String email;
    private String gender;
    private String image;
    private String password;
    private String mobile;
    private Date dateOfBirth;
    private String description;
    private String googleSub;

    /**
     * The users who follow me.
     */
    @ManyToMany
    @JoinTable(
            name = "user_followers",
            joinColumns        = @JoinColumn(name = "user_id"),      // this user's id
            inverseJoinColumns = @JoinColumn(name = "follower_id")   // follower's id
    )
    @JsonIdentityReference(alwaysAsId = true)
    private Set<UserModel> followers = new HashSet<>();

    /**
     * The users I am following.
     *
     * mappedBy = "followers" tells Hibernate not to
     * create another join table, but to use the one above.
     */
    @ManyToMany(mappedBy = "followers")
    @JsonIdentityReference(alwaysAsId = true)
    @JsonIgnore   // avoid infinite recursion when serializing
    private Set<UserModel> following = new HashSet<>();

    // Posts relationship, etc.
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Post> posts = new ArrayList<>();

    // Getters and setters for posts
    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }

    // Getters and Setters
    @Transient
    public int getFollowerCount() {
        return followers.size();
    }

    @Transient
    public int getFollowingCount() {
        return following.size();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public Date getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(Date dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getDescription() { return description; } // Getter for description
    public void setDescription(String description) { this.description = description; } // Setter for description

    public String getGoogleSub() {
        return googleSub;
    }

    public void setGoogleSub(String googleSub) {
        this.googleSub = googleSub;
    }

    public Set<UserModel> getFollowers() {
        return followers;
    }

    public void setFollowers(Set<UserModel> followers) {
        this.followers = followers;
    }

    public Set<UserModel> getFollowing() {
        return following;
    }

    public void setFollowing(Set<UserModel> following) {
        this.following = following;
    }
}
