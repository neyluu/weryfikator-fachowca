package org.example.backend.dto.request.profile;

import com.fasterxml.jackson.annotation.JsonProperty;

public record LocalizationDto (
          @JsonProperty("n") String city,
          @JsonProperty("p") String voivodeship
) {}
