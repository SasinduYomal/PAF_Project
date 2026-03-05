package backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

@Entity
@Table(name = "topics")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String resource;            // URL; optional
    private LocalDate deadline;         // nullable → “—” in UI

    @Min(0) @Max(100)
    private Integer progress = 0;       // 0-100

    /* ---------- JPA needs a public / protected no-arg constructor ---------- */
    public Topic() {}

    public Topic(Long id, String title, String resource,
                 LocalDate deadline, Integer progress) {
        this.id = id;
        this.title = title;
        this.resource = resource;
        this.deadline = deadline;
        this.progress = progress;
    }

    /* ------------------------ getters & setters --------------------------- */
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getResource() { return resource; }
    public void setResource(String resource) { this.resource = resource; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }
}
