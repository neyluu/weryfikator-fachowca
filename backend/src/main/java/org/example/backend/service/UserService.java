package org.example.backend.service;

import org.example.backend.dto.request.UpdateAccountRequest;
import org.example.backend.dto.response.AuthResponse;
import org.example.backend.entity.Role;
import org.example.backend.entity.User;
import org.example.backend.repository.UserRepository;
import org.example.backend.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public UserService(
        UserRepository userRepository,
        JwtUtil jwtUtil,
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public User getByEmail(String email) {
        return userRepository
            .findByEmail(email)
            .orElseThrow(() ->
                new IllegalArgumentException("Użytkownik nie istnieje")
            );
    }

    public AuthResponse upgradeToSpecialist(String email) {
        User user = getByEmail(email);
        if (
            user.getRole() == Role.SPECIALIST
        ) throw new IllegalArgumentException("Już jesteś specjalistą");
        user.setRole(Role.SPECIALIST);
        userRepository.save(user);
        String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getRole().name(),
            user.getFullName()
        );
        return new AuthResponse(
            token,
            user.getFullName(),
            user.getEmail(),
            user.getRole().name()
        );
    }

    public AuthResponse update(String currentEmail, UpdateAccountRequest dto) {
        User user = getByEmail(currentEmail);
        if (dto.fullName() != null) {
            user.setFullName(dto.fullName());
        }
        if (dto.email() != null && !dto.email().equals(currentEmail)) {
            if (
                userRepository.existsByEmail(dto.email())
            ) throw new IllegalArgumentException("Email już istnieje");
            user.setEmail(dto.email());
        }
        if (dto.newPassword() != null) {
            if (
                dto.currentPassword() == null
            ) throw new IllegalArgumentException("Podaj aktualne hasło");
            if (
                !passwordEncoder.matches(
                    dto.currentPassword(),
                    user.getPasswordHash()
                )
            ) throw new IllegalArgumentException(
                "Aktualne hasło jest nieprawidłowe"
            );
            user.setPasswordHash(passwordEncoder.encode(dto.newPassword()));
        }
        userRepository.save(user);
        String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getRole().name(),
            user.getFullName()
        );
        return new AuthResponse(
            token,
            user.getFullName(),
            user.getEmail(),
            user.getRole().name()
        );
    }
}
