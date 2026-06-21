package org.example.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceEntry {

    private String title;
    private String description;
    private String type;
    private Integer startMonth;
    private Integer startYear;
    private Integer endMonth;
    private Integer endYear;
}
