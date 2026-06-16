package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.profile.CreateProfileRequest;
import org.example.backend.dto.request.profile.ProfileDto;
import org.example.backend.dto.response.SearchProfileDto;
import org.example.backend.entity.Profile;
import org.example.backend.entity.User;
import org.example.backend.repository.ProfileRepository;
import org.example.backend.repository.UserRepository;
import org.example.backend.service.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService = new ProfileService();
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    @GetMapping("/search")
    public List<SearchProfileDto> search(
            @RequestParam(required = false, defaultValue = "") String service,
            @RequestParam(required = false, defaultValue = "") String city
    ) {
        return profileRepository.search(service, city)
                .stream()
                .map(SearchProfileDto::of)
                .toList();
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody CreateProfileRequest dto, Authentication auth) {

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow();

        Profile profile = new Profile();

        profileService.apply(profile, dto);
        profileService.applyImages(profile, dto.images());
        profileService.applyProfilePicture(profile, dto.profilePicture());

        profile.setUser(user);

        profileRepository.save(profile);

        return ResponseEntity.ok(Map.of("message", "created"));
    }

    @PutMapping("/update")
    @Transactional
    public ResponseEntity<?> update(@RequestBody CreateProfileRequest dto, Authentication auth) {

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow();

        Profile profile = profileRepository.findByUser(user)
                .orElseThrow();

        profileService.apply(profile, dto);
        profileService.applyImages(profile, dto.images());
        profileService.applyProfilePicture(profile, dto.profilePicture());

        return ResponseEntity.ok(Map.of("message", "updated"));
    }

    @Transactional(readOnly = true)
    @GetMapping("/me")
    public ProfileDto get(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User with email " + email + " was not found"
                ));

        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Profile not found"
                ));

        return ProfileDto.of(profile);
    }
}