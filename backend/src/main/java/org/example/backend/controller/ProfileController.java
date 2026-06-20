package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.request.profile.CreateProfileRequest;
import org.example.backend.dto.request.profile.ProfileDto;
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

import java.util.Map;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService = new ProfileService();
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody CreateProfileRequest dto, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        User user = userRepository.findById(userId).orElseThrow();

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
        Long userId = (Long) auth.getPrincipal();
        User user = userRepository.findById(userId).orElseThrow();

        Profile profile = profileRepository.findByUser(user).orElseThrow();
        profileService.apply(profile, dto);
        profileService.applyImages(profile, dto.images());
        profileService.applyProfilePicture(profile, dto.profilePicture());

        return ResponseEntity.ok(Map.of("message", "updated"));
    }

    @Transactional(readOnly = true)
    @GetMapping("/me")
    public ProfileDto get(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        return ProfileDto.of(profile);
    }

    @Transactional(readOnly = true)
    @GetMapping("/{id}")
    public ProfileDto getById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        return ProfileDto.of(profile);
    }
}