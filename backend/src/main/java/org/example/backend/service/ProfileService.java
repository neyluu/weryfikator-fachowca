package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.profile.CreateProfileRequest;
import org.example.backend.dto.request.profile.ImageDto;
import org.example.backend.dto.request.profile.PriceDto;
import org.example.backend.entity.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {
    public void apply(Profile profile, CreateProfileRequest dto) {

        profile.setSpecialization(dto.specialization());
        profile.setDescription(dto.description());
        profile.setExperience(dto.experience());
        profile.setLocalization(new Localization(
                dto.localization().city(),
                dto.localization().voivodeship()
        ));
        profile.setPhoneNumber(dto.phoneNumber());
        profile.setEmail(dto.email());

        PriceDto c = dto.prices().consultation();
        profile.setConsultationEnabled(c.enabled());
        profile.setConsultationPrice(new PriceRange(c.value().min(), c.value().max()));

        PriceDto h = dto.prices().hourly();
        profile.setHourlyEnabled(h.enabled());
        profile.setHourlyPrice(new PriceRange(h.value().min(), h.value().max()));

        PriceDto p = dto.prices().project();
        profile.setProjectEnabled(p.enabled());
        profile.setProjectPrice(new PriceRange(p.value().min(), p.value().max()));

        profile.getAvailability().clear();
        profile.getAvailability().addAll(
                dto.availability().stream()
                        .map(a -> new AvailabilityDay(
                                a.day(),
                                a.startTime(),
                                a.endTime()
                        ))
                        .toList()
        );

        profile.getCategories().clear();
        profile.getCategories().addAll(dto.categories());
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

    private List<ProfileImage> processImages(List<ImageDto> images, Profile profile) {
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

                    byte[] imageBytes = Base64.getDecoder().decode(base64BytesStr);
                    ProfileImage profileImage = new ProfileImage(imageBytes, extension, profile);

                    profileImages.add(profileImage);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to decode base64 image data", e);
                }
            }
        }

        return profileImages;
    }
}
