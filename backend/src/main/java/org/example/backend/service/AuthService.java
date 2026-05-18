package org.example.backend.service;

import org.example.backend.dto.request.*;
import org.example.backend.dto.response.*;
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
            userRepository.existsByUsername(req.username())
        ) throw new IllegalArgumentException("Username is taken already");
        if (
            userRepository.existsByEmail(req.email())
        ) throw new IllegalArgumentException("Mail is taken already");

        User user = new User();
        user.setUsername(req.username());
        user.setEmail(req.email());
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getEmail());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository
            .findByUsername(req.username())
            .orElseThrow(() ->
                new IllegalArgumentException("Incorrect credentials")
            );

        if (
            !passwordEncoder.matches(req.password(), user.getPasswordHash())
        ) throw new IllegalArgumentException("Incorrect credentials");

        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getEmail());
    }
}
