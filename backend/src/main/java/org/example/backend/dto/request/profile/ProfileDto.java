package org.example.backend.dto.request.profile;

import jakarta.validation.constraints.NotBlank;
import org.example.backend.entity.Profile;
import org.example.backend.entity.ProfileImage;

import java.util.List;

public record ProfileDto(
        String specialization,
        String description,
        String experience,
        LocalizationDto localization,
        String phoneNumber,
        String email,
        Boolean paidTravel,
        Boolean remoteConsultation,
        PricesDto prices,
        ImageDto profilePicture,
        List<ImageDto> images,
        List<AvailabilityDto> availability,
        List<String> categories
) {
    public static ProfileDto of(Profile profile) {

        return new ProfileDto(
                profile.getSpecialization(),
                profile.getDescription(),
                profile.getExperience(),
                new LocalizationDto(
                        profile.getLocalization().getCity(),
                        profile.getLocalization().getVoivodeship()
                ),
                profile.getPhoneNumber(),
                profile.getEmail(),
                profile.getPaidTravel(),
                profile.getRemoteConsultations(),

                new PricesDto(
                        new PriceDto(
                                profile.getConsultationEnabled(),
                                profile.getConsultationPrice() != null
                                        ? new ValueDto(
                                        profile.getConsultationPrice().getMin(),
                                        profile.getConsultationPrice().getMax()
                                )
                                        : null
                        ),
                        new PriceDto(
                                profile.getHourlyEnabled(),
                                profile.getHourlyPrice() != null
                                        ? new ValueDto(
                                        profile.getHourlyPrice().getMin(),
                                        profile.getHourlyPrice().getMax()
                                )
                                        : null
                        ),
                        new PriceDto(
                                profile.getProjectEnabled(),
                                profile.getProjectPrice() != null
                                        ? new ValueDto(
                                        profile.getProjectPrice().getMin(),
                                        profile.getProjectPrice().getMax()
                                )
                                        : null
                        )
                ),

                mapProfileImage(profile.getProfilePicture()),

                profile.getImages()
                        .stream()
                        .map(ProfileDto::mapProfileImage)
                        .toList(),

                profile.getAvailability()
                        .stream()
                        .map(a -> new AvailabilityDto(
                                a.getDay(),
                                a.getStartTime(),
                                a.getEndTime()
                        ))
                        .toList(),

                profile.getCategories()
        );
    }

    private static ImageDto mapProfileImage(ProfileImage image) {
        if (image == null) return null;

        String base64 = java.util.Base64.getEncoder()
                .encodeToString(image.getData());

        String url = "data:image/" +
                image.getFileExtension() +
                ";base64," +
                base64;

        return new ImageDto(
                image.getId().toString(),
                null,
                url
        );
    }
}
