package org.example.backend.dto.request.profile;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CreateProfileRequest(
        @NotBlank String specialization,
        @NotBlank String description,
        @NotBlank String experience,
        @NotBlank LocalizationDto localization,
        @NotBlank String phoneNumber,
        @NotBlank String email,
        @Valid PricesDto prices,
        ImageDto profilePicture,
        @NotEmpty List<ImageDto> images,
        @NotEmpty List<AvailabilityDto> availability,
        @NotEmpty List<String> categories
) {
}