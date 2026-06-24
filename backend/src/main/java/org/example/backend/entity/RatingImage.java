package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rating_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String url;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rating_id", nullable = false)
    private Rating rating;
}