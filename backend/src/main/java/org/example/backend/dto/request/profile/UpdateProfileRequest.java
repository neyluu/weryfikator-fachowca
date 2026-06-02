package org.example.backend.dto.request.profile;

import java.util.List;

public record UpdateProfileRequest(
        String specialization,
        String description,
        String experience,
        String localization,
        String phoneNumber,
        String email,
        PricesDto prices,
        ImageDto profilePicture,
        List<ImageDto> images,
        List<AvailabilityDto> availability,
        List<String> categories
) {
}
