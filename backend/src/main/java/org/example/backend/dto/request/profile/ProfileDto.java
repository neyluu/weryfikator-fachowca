package org.example.backend.dto.request.profile;

import java.util.List;
import org.example.backend.entity.Profile;
import org.example.backend.entity.ProfileImage;

public record ProfileDto(
    String specialization,
    String description,
    LocalizationDto localization,
    String phoneNumber,
    String email,
    Boolean paidTravel,
    Boolean remoteConsultations,
    PricesDto prices,
    ImageDto profilePicture,
    List<ImageDto> images,
    List<AvailabilityDto> availability,
    List<String> categories,
    List<ExperienceEntryDto> experienceEntries
) {
    public static ProfileDto of(Profile profile) {
        return new ProfileDto(
            profile.getSpecialization(),
            profile.getDescription(),
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
            profile
                .getImages()
                .stream()
                .map(ProfileDto::mapProfileImage)
                .toList(),
            profile
                .getAvailability()
                .stream()
                .map(availabilityDay ->
                    new AvailabilityDto(
                        availabilityDay.getDay(),
                        availabilityDay.getStartTime(),
                        availabilityDay.getEndTime()
                    )
                )
                .toList(),
            profile.getCategories(),
            profile
                .getExperienceEntries()
                .stream()
                .map(experienceEntry ->
                    new ExperienceEntryDto(
                        experienceEntry.getTitle(),
                        experienceEntry.getDescription(),
                        experienceEntry.getType(),
                        experienceEntry.getStartMonth(),
                        experienceEntry.getStartYear(),
                        experienceEntry.getEndMonth(),
                        experienceEntry.getEndYear()
                    )
                )
                .toList()
        );
    }

    private static ImageDto mapProfileImage(ProfileImage image) {
        if (image == null) return null;
        String base64 = java.util.Base64.getEncoder().encodeToString(
            image.getData()
        );
        String url =
            "data:image/" + image.getFileExtension() + ";base64," + base64;
        return new ImageDto(image.getId().toString(), null, url);
    }
}
