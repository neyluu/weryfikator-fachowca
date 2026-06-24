package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ratings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long specialistId;

    @Column(nullable = false)
    private Long authorId;

    @Column(nullable = false)
    private Integer quality;

    @Column(nullable = false)
    private Integer price;

    @Column(nullable = false)
    private Integer timeliness;

    @Column(length = 1000)
    private String comment;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "rating", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RatingImage> images = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}