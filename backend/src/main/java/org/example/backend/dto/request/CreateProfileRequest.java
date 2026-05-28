package org.example.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalTime;
import java.util.List;

public record CreateProfileRequest(
        @NotBlank String specialization,
        @NotBlank String description,
        @NotBlank String experience,
        @NotBlank String localization,
        @NotBlank String phoneNumber,
        @NotBlank String email,
        @Valid PricesDto prices,
        @NotEmpty List<ImageDto> images,
        @NotEmpty List<AvailabilityDto> availability,
        @NotEmpty List<String> categories
) {
    public record ImageDto(
            String id,
            Object file,
            String url
    ) {
    }

    public record PricesDto(
            @Valid PriceDto consultation,
            @Valid PriceDto hourly,
            @Valid PriceDto project
    ) {
    }

    public record PriceDto(
            Boolean enabled,
            Value value
    ) {
    }

    public record Value(
            Double min,
            Double max
    ) {
    }

    public record AvailabilityDto(
            String day,
            LocalTime startTime,
            LocalTime endTime
    ) {
    }
}