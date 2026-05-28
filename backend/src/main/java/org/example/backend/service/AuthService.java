package org.example.backend.service;

import org.example.backend.dto.request.*;
import org.example.backend.dto.response.AuthResponse;
import org.example.backend.entity.Role;
import org.example.backend.entity.User;
import org.example.backend.repository.UserRepository;
import org.example.backend.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest req) {
        if (
            userRepository.existsByEmail(req.email())
        ) throw new IllegalArgumentException("Email już istnieje");
        User user = new User();
        user.setFullName(req.fullName());
        user.setEmail(req.email());
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setRole(req.role() != null ? req.role() : Role.USER);
        userRepository.save(user);
        String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getRole().name()
        );
        return new AuthResponse(
            token,
            user.getFullName(),
            user.getEmail(),
            user.getRole().name()
        );
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository
            .findByEmail(req.email())
            .orElseThrow(() ->
                new IllegalArgumentException("Nieprawidłowe dane")
            );
        if (
            !passwordEncoder.matches(req.password(), user.getPasswordHash())
        ) throw new IllegalArgumentException("Nieprawidłowe dane");
        String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getRole().name()
        );
        return new AuthResponse(
            token,
            user.getFullName(),
            user.getEmail(),
            user.getRole().name()
        );
    }
}
