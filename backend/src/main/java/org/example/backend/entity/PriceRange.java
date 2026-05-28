package org.example.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
public class PriceRange {

    private Double min;
    private Double max;

    public PriceRange(Double min, Double max) {
        this.min = min;
        this.max = max;
    }
}