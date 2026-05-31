package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String specialization;
    private String description;
    private String experience;
    private String localization;
    private String phoneNumber;
    private String email;

    private Boolean consultationEnabled;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "min", column = @Column(name = "consultation_min")),
            @AttributeOverride(name = "max", column = @Column(name = "consultation_max"))
    })
    private PriceRange consultationPrice;

    private Boolean hourlyEnabled;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "min", column = @Column(name = "hourly_min")),
            @AttributeOverride(name = "max", column = @Column(name = "hourly_max"))
    })
    private PriceRange hourlyPrice;

    private Boolean projectEnabled;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "min", column = @Column(name = "project_min")),
            @AttributeOverride(name = "max", column = @Column(name = "project_max"))
    })
    private PriceRange projectPrice;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProfileImage> images = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "profile_picture_id")
    private ProfileImage profilePicture;

    @ElementCollection
    private List<AvailabilityDay> availability = new ArrayList<>();

    @ElementCollection
    private List<String> categories = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
}