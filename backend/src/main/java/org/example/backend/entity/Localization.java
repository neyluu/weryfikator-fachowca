package org.example.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
public class Localization {
    private String city;
    private String voivodeship;

    public Localization(String city, String voivodeship) {
        this.city = city;
        this.voivodeship = voivodeship;
    }
}
