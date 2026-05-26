package org.example.backend.service;

import org.example.backend.dto.response.AuthResponse;
import org.example.backend.entity.Role;
import org.example.backend.entity.User;
import org.example.backend.repository.UserRepository;
import org.example.backend.util.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
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

        if (user.getRole() == Role.SPECIALIST) {
            throw new IllegalArgumentException("Już jesteś specjalistą");
        }

        user.setRole(Role.SPECIALIST);

        userRepository.save(user);

        String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getRole().name()
        );

        return new AuthResponse(
            token,
            user.getUsername(),
            user.getEmail(),
            user.getRole().name()
        );
    }
}
