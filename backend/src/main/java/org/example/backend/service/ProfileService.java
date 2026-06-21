package org.example.backend.service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.profile.CreateProfileRequest;
import org.example.backend.dto.request.profile.ImageDto;
import org.example.backend.dto.request.profile.PriceDto;
import org.example.backend.entity.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    public void apply(Profile profile, CreateProfileRequest dto) {
        profile.setSpecialization(dto.specialization());
        profile.setDescription(dto.description());
        profile.setLocalization(
            new Localization(
                dto.localization().city(),
                dto.localization().voivodeship()
            )
        );
        profile.setPhoneNumber(dto.phoneNumber());
        profile.setEmail(dto.email());
        profile.setPaidTravel(dto.paidTravel());
        profile.setRemoteConsultations(dto.remoteConsultation());

        PriceDto consultationDto = dto.prices().consultation();
        profile.setConsultationEnabled(consultationDto.enabled());
        profile.setConsultationPrice(
            new PriceRange(
                consultationDto.value().min(),
                consultationDto.value().max()
            )
        );

        PriceDto hourlyDto = dto.prices().hourly();
        profile.setHourlyEnabled(hourlyDto.enabled());
        profile.setHourlyPrice(
            new PriceRange(hourlyDto.value().min(), hourlyDto.value().max())
        );

        PriceDto projectDto = dto.prices().project();
        profile.setProjectEnabled(projectDto.enabled());
        profile.setProjectPrice(
            new PriceRange(projectDto.value().min(), projectDto.value().max())
        );

        profile.getAvailability().clear();
        profile.getAvailability().addAll(
            dto
                .availability()
                .stream()
                .map(availabilityDto ->
                    new AvailabilityDay(
                        availabilityDto.day(),
                        availabilityDto.startTime(),
                        availabilityDto.endTime()
                    )
                )
                .toList()
        );

        profile.getCategories().clear();
        profile.getCategories().addAll(dto.categories());

        profile.getExperienceEntries().clear();
        if (dto.experienceEntries() != null) {
            profile.getExperienceEntries().addAll(
                dto
                    .experienceEntries()
                    .stream()
                    .map(experienceEntryDto ->
                        new ExperienceEntry(
                            experienceEntryDto.title(),
                            experienceEntryDto.description(),
                            experienceEntryDto.type(),
                            experienceEntryDto.startMonth(),
                            experienceEntryDto.startYear(),
                            experienceEntryDto.endMonth(),
                            experienceEntryDto.endYear()
                        )
                    )
                    .toList()
            );
        }
    }

    public void applyImages(Profile profile, List<ImageDto> images) {
        try {
            List<ProfileImage> newImages = processImages(images, profile);
            profile.getImages().clear();
            profile.getImages().addAll(newImages);
        } catch (Exception e) {
            throw new RuntimeException("Invalid images", e);
        }
    }

    public void applyProfilePicture(Profile profile, ImageDto dto) {
        if (dto == null) return;
        List<ProfileImage> img = processImages(List.of(dto), profile);
        if (!img.isEmpty()) {
            profile.setProfilePicture(img.getFirst());
        }
    }

    private List<ProfileImage> processImages(
        List<ImageDto> images,
        Profile profile
    ) {
        List<ProfileImage> profileImages = new ArrayList<>();
        for (ImageDto imgDto : images) {
            String base64Data = imgDto.url();
            if (base64Data != null && base64Data.contains(",")) {
                try {
                    String[] parts = base64Data.split(",");
                    String header = parts[0];
                    String base64BytesStr = parts[1];

                    String extension = "jpg";
                    if (header.contains("image/png")) extension = "png";
                    else if (header.contains("image/gif")) extension = "gif";
                    else if (header.contains("image/webp")) extension = "webp";

                    byte[] imageBytes = Base64.getDecoder().decode(
                        base64BytesStr
                    );
                    ProfileImage profileImage = new ProfileImage(
                        imageBytes,
                        extension,
                        profile
                    );
                    profileImages.add(profileImage);
                } catch (Exception e) {
                    throw new RuntimeException(
                        "Failed to decode base64 image data",
                        e
                    );
                }
            }
        }
        return profileImages;
    }
}
