package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.CreateProfileRequest;
import org.example.backend.entity.PriceRange;
import org.example.backend.entity.Profile;
import org.example.backend.entity.ProfileImage;
import org.example.backend.entity.User;
import org.example.backend.repository.ProfileRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> create(
            @Valid @RequestBody CreateProfileRequest dto,
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User with email " + email + " was not found"
                ));

        Profile profile = new Profile();

        profile.setSpecialization(dto.specialization());
        profile.setDescription(dto.description());
        profile.setExperience(dto.experience());
        profile.setLocalization(dto.localization());
        profile.setPhoneNumber(dto.phoneNumber());
        profile.setEmail(dto.email());

        CreateProfileRequest.PriceDto c = dto.prices().consultation();
        profile.setConsultationEnabled(c.enabled());
        profile.setConsultationPrice(new PriceRange(
                c.value().min(),
                c.value().max()
        ));

        CreateProfileRequest.PriceDto h = dto.prices().hourly();
        profile.setHourlyEnabled(h.enabled());
        profile.setHourlyPrice(new PriceRange(
                h.value().min(),
                h.value().max()
        ));

        CreateProfileRequest.PriceDto p = dto.prices().project();
        profile.setProjectEnabled(p.enabled());
        profile.setProjectPrice(new PriceRange(
                p.value().min(),
                p.value().max()
        ));

        try {
            List<ProfileImage> profileImages = processImages(dto.images(), profile);
            profile.setImages(profileImages);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid image data: " + e.getMessage()));
        }

        profile.setDays(dto.days());
        profile.setCategories(dto.categories());

        profile.setHourStart(dto.hourStart());
        profile.setHourEnd(dto.hourEnd());

        profile.setUser(user);

        profileRepository.save(profile);

        return ResponseEntity.ok(
                Map.of("message", "Profile created")
        );
    }

    private List<ProfileImage> processImages(List<CreateProfileRequest.ImageDto> images, Profile profile) {
        List<ProfileImage> profileImages = new ArrayList<>();

        for (var imgDto : images) {
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